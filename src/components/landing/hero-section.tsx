"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  VideoGeneratorInput,
  type SubmitData,
  DEFAULT_CONFIG,
  DEFAULT_DEFAULTS,
} from "@/components/video-generator";
import { SeascapeBackground2D } from "@/components/SeascapeBackground2D";
import { authClient } from "@/lib/auth/client";
import { calculateModelCredits, getAvailableModels } from "@/config/credits";
import { NEW_USER_GIFT } from "@/config/pricing-user";
import { uploadImage } from "@/lib/video-api";
import { useSigninModal } from "@/hooks/use-signin-modal";
import { videoTaskStorage } from "@/lib/video-task-storage";
import type { ProviderType } from "@/ai";
import {
  isModelModeSupported,
  type GenerationMode,
} from "@/ai/model-mapping";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PENDING_PROMPT_KEY = "goya_ai_pending_prompt";
const PENDING_IMAGE_KEY = "goya_ai_pending_image";
const NOTIFICATION_ASKED_KEY = "goya_ai_notification_asked";
const TOOL_PREFILL_KEY = "goya_ai_tool_prefill";

function normalizeGeneratorMode(mode?: string): GenerationMode {
  if (mode === "image-to-video" || mode === "i2v") {
    return "image-to-video";
  }
  if (mode === "reference-to-video" || mode === "r2v") {
    return "reference-to-video";
  }
  if (mode === "frames-to-video") {
    return "frames-to-video";
  }
  return "text-to-video";
}

interface HeroSectionProps {
  currentProvider?: ProviderType;
}

/**
 * Hero Section - 视频生成器优先设计
 *
 * 设计模式: Video-First Hero with Glassmorphism
 * - Hero 区域直接集成视频生成组件
 * - Glassmorphism 风格: 背景模糊、透明层、微妙边框
 * - Magic UI 动画组件增强交互体验
 */
export function HeroSection({ currentProvider }: HeroSectionProps) {
  const t = useTranslations("Hero");
  const tNotify = useTranslations("Notifications");
  const locale = useLocale();
  const router = useRouter();
  const signInModal = useSigninModal();
  const { data: session } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<SubmitData | null>(null);

  const generatorConfig = useMemo(() => {
    const availableModels = getAvailableModels({
      enabledOnly: true,
    });
    const availableIds = new Set(availableModels.map((model) => model.id));
    
    // Create a mapping of modelId -> primary provider
    const providerByModel = new Map(
      availableModels.map((model) => [model.id, model.provider])
    );

    const videoModels = DEFAULT_CONFIG.videoModels ?? [];
    const filteredVideoModels = videoModels.filter((model) => availableIds.has(model.id));

    const filteredVideoModes = (DEFAULT_CONFIG.videoModes ?? [])
      .map((mode) => {
        const normalizedMode = normalizeGeneratorMode(mode.id);
        const supportedModels = (mode.supportedModels ?? []).filter((modelId) => {
          if (!availableIds.has(modelId)) return false;
          const provider = providerByModel.get(modelId);
          if (!provider) return false;
          return isModelModeSupported(modelId, provider, normalizedMode);
        });
        return {
          ...mode,
          supportedModels,
        };
      })
      .filter((mode) => mode.supportedModels.length > 0);

    return {
      ...DEFAULT_CONFIG,
      videoModels: filteredVideoModels,
      videoModes: filteredVideoModes,
    };
  }, [currentProvider]);

  const generatorDefaults = useMemo(() => {
    const preferredModel = (generatorConfig.videoModels ?? [])[0]?.id ?? DEFAULT_DEFAULTS.videoModel;
    return {
      ...DEFAULT_DEFAULTS,
      videoModel: preferredModel,
    };
  }, [generatorConfig.videoModels]);

  const defaultDuration = useMemo(() => {
    const rawDuration = generatorDefaults.duration ?? generatorConfig.durations?.[0];
    if (!rawDuration) return 10;
    const parsed = Number.parseInt(String(rawDuration), 10);
    return Number.isNaN(parsed) ? 10 : parsed;
  }, [generatorDefaults.duration, generatorConfig.durations]);

  const parseDuration = (duration?: string | number) => {
    if (typeof duration === "number") return duration;
    if (!duration) return undefined;
    const parsed = Number.parseInt(duration, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const calculateCredits = useCallback((params: {
    type: "video" | "image";
    model: string;
    outputNumber: number;
    duration?: string;
    resolution?: string;
    hasVideoInput?: boolean;
    inputVideoDuration?: number;
  }) => {
    if (params.type !== "video") return 0;
    const parsedDuration = parseDuration(params.duration) ?? defaultDuration;
    const baseCredits = calculateModelCredits(params.model, {
      duration: parsedDuration,
      quality: params.resolution,
      hasVideoInput: params.hasVideoInput,
      inputVideoDuration: params.inputVideoDuration,
      outputNumber: params.outputNumber,
    });
    return baseCredits; // calculateModelCredits already multiplies by outputNumber in my previous edit
  }, [defaultDuration]);

  const resolveImagesBySlot = async (data: SubmitData) => {
    if (!data.imageSlots || data.imageSlots.length === 0) {
      if (data.images && data.images.length > 0) {
        const urls = await Promise.all(data.images.map(f => uploadImage(f)));
        return { default: urls[0], all: urls };
      }
      return null;
    }

    const results = await Promise.all(
      data.imageSlots.map(async (slot) => ({
        slot: slot.slot,
        url: await uploadImage(slot.file),
      }))
    );

    const mapping: Record<string, any> = {};
    results.forEach((r) => {
      mapping[r.slot] = r.url;
    });
    return mapping;
  };

  const getToolRouteByMode = (mode: string) => {
    const normalized = normalizeGeneratorMode(mode);
    if (normalized === "image-to-video") {
      return "image-to-video";
    }
    if (normalized === "reference-to-video") {
      return "reference-to-video";
    }
    return "text-to-video";
  };

  const processSubmission = async (data: SubmitData) => {
    setIsSubmitting(true);
    console.log("Starting submission with data:", data);
    try {
      const normalizedMode = normalizeGeneratorMode(data.mode);
      const imageMapping = await resolveImagesBySlot(data);
      
      const payload = {
        prompt: data.prompt,
        model: data.model,
        mode: normalizedMode,
        duration: parseDuration(data.duration),
        aspectRatio: data.aspectRatio,
        quality: data.quality ?? data.resolution,
        outputNumber: data.outputNumber,
        generateAudio: data.generateAudio,
        // Common fields
        imageUrl: imageMapping?.default || imageMapping?.start || data.imageUrl || (data.imageUrls?.[0]),
        imageUrls: imageMapping?.all || data.imageUrls,
        // Seedance 2.0 specialized multi-frame
        firstFrameUrl: imageMapping?.start || (typeof data.firstFrameUrl === 'string' && !data.firstFrameUrl.startsWith('blob:') ? data.firstFrameUrl : undefined),
        lastFrameUrl: imageMapping?.end || (typeof data.lastFrameUrl === 'string' && !data.lastFrameUrl.startsWith('blob:') ? data.lastFrameUrl : undefined),
        referenceImageUrls: imageMapping 
          ? Object.keys(imageMapping).filter(k => k.startsWith('ref')).map(k => imageMapping[k]) 
          : (Array.isArray(data.referenceImageUrls) ? data.referenceImageUrls.filter(u => typeof u === 'string' && !u.startsWith('blob:')) : undefined),
      };
      
      console.log("Sending API request with payload:", payload);
      
      const response = await fetch("/api/v1/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP Error ${response.status}` };
        }
        console.error("API error details:", errorData);
        throw new Error(
          errorData?.error?.message || errorData?.message || "Failed to generate video"
        );
      }

      const result = await response.json();
      console.log("API success result:", result);
      
      // Calculate route and navigate immediately for better UX
      const toolRoute = getToolRouteByMode(normalizedMode);
      const targetUrl = `/${locale}/${toolRoute}?id=${result.data.videoUuid}`;
      
      // Navigate immediately while finishing background tasks
      router.push(targetUrl);
      toast.success("Generation started!");
      
      // Continue background storage in parallel
      try {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            TOOL_PREFILL_KEY,
            JSON.stringify({
              ...payload,
              videoUuid: result.data.videoUuid
            })
          );
        }
      } catch (storageError) {
        console.warn("Failed to store tool prefill data:", storageError);
      }
      
      if (session?.user?.id) {
        videoTaskStorage.addTask({
          userId: session.user.id,
          videoId: result.data.videoUuid,
          taskId: result.data.taskId,
          prompt: data.prompt,
          model: data.model,
          mode: normalizedMode,
          status: "generating",
          createdAt: Date.now(),
          notified: false,
        });
      }
    } catch (error) {
      console.error("Submission failed:", error);
      const message = error instanceof Error ? error.message : "Failed to generate video. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setPendingSubmitData(null);
    }
  };
  const handleAllowNotify = () => {
    setShowNotifyDialog(false);
    Notification.requestPermission().then(() => {
      localStorage.setItem(NOTIFICATION_ASKED_KEY, "1");
      if (pendingSubmitData) {
        processSubmission(pendingSubmitData);
      }
    });
  };

  const handleSkipNotify = () => {
    setShowNotifyDialog(false);
    localStorage.setItem(NOTIFICATION_ASKED_KEY, "1");
    if (pendingSubmitData) {
      processSubmission(pendingSubmitData);
    }
  };

  const handleSubmit = async (data: SubmitData) => {
    let activeUser = session?.user ?? null;
    if (!activeUser) {
      try {
        const fresh = await authClient.getSession();
        activeUser = fresh?.data?.user ?? null;
      } catch (error) {
        console.warn("Failed to refresh session:", error);
      }
    }

    if (!activeUser) {
      try {
        sessionStorage.setItem(PENDING_PROMPT_KEY, data.prompt);
        if (data.images?.[0]) {
          const reader = new FileReader();
          reader.onloadend = () => {
            sessionStorage.setItem(PENDING_IMAGE_KEY, reader.result as string);
          };
          reader.readAsDataURL(data.images[0]);
        }
      } catch (error) {
        console.warn("Failed to store pending input:", error);
      }
      signInModal.onOpen();
      return;
    }

    // Check for notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      const asked = localStorage.getItem(NOTIFICATION_ASKED_KEY);
      if (!asked && Notification.permission === "default") {
        setPendingSubmitData(data);
        setShowNotifyDialog(true);
        return;
      }
    }

    processSubmission(data);
  };

  const canvasWrapRef = useRef<HTMLDivElement>(null);

  // Parallax: canvas scrolls at ×0.15 scroll speed (passive)
  useEffect(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Hero canvas */}
      <div className="mono-cursor-zone relative w-full overflow-hidden z-10" style={{ height: "420px" }}>
        {/* Parallax canvas layer ×0.15 */}
        <div ref={canvasWrapRef} className="absolute inset-0 will-change-transform">
          <SeascapeBackground2D contained />
        </div>

        {/* Text overlay — azumbrunnen fadeInUp, staggered, IBM Plex Mono */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-plex-mono"
          style={{ padding: "36px 40px" }}
        >
          <div className="pointer-events-auto text-center">
            {/* Eyebrow — opacity 0.54 (azumbrunnen nav/muted default) */}
            <div
              className="text-[11px] font-light tracking-[0.22em] mb-5 lowercase"
              style={{
                color: "rgba(255,255,255,0.54)",
                animation: "monoFadeInUp 0.8s cubic-bezier(0.23,1,0.32,1) both",
                animationDelay: "0s",
              }}
            >
              {t("badge")}
            </div>
            {/* Headline — azumbrunnen h1: weight 400, line-height 1.15 */}
            <div
              className="text-[56px] md:text-[72px] font-light text-white whitespace-nowrap"
              style={{
                lineHeight: 1.15,
                marginBottom: "16px",
                textShadow: "0 2px 40px rgba(0,0,0,0.8)",
                animation: "monoFadeInUp 0.8s cubic-bezier(0.23,1,0.32,1) both",
                animationDelay: "0.15s",
              }}
            >
              make <span style={{ color: "#008fff", animation: "hueRotate 10s ease infinite", display: "inline-block" }}>moving</span> films.
            </div>
            {/* Subhead — opacity 0.80 (azumbrunnen intro text) */}
            <div
              className="text-[18px] font-light lowercase"
              style={{
                letterSpacing: "0.04em",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.80)",
                textShadow: "0 1px 20px rgba(0,0,0,0.6)",
                animation: "monoFadeInUp 0.8s cubic-bezier(0.23,1,0.32,1) both",
                animationDelay: "0.30s",
              }}
            >
              type a prompt. receive a film.
            </div>
            {/* CTA — azumbrunnen pill ghost button: scale(1.015) hover, push active */}
            <button
              onClick={() => {
                document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-7 inline-block border border-white/35 rounded-full px-7 py-3 text-[11px] tracking-[0.12em] lowercase"
              style={{
                color: "rgba(255,255,255,0.80)",
                transition: "transform 0.15s ease, border-color 0.15s",
                animation: "monoFadeInUp 0.8s cubic-bezier(0.23,1,0.32,1) both",
                animationDelay: "0.45s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.015)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#008fff";
                (e.currentTarget as HTMLButtonElement).style.color = "#008fff";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.35)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.80)";
              }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.animation = "push 0.5s ease-out"; }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.animation = ""; }}
            >
              → start creating
            </button>
          </div>
        </div>
      </div>

      {/* Generator Section — floats up over the wave canvas */}
      <section id="generator" className="relative z-10 font-plex-mono" style={{ marginTop: "-80px", paddingTop: "0", paddingBottom: "80px", background: "linear-gradient(to bottom, transparent 0%, transparent 60px, #000 140px)" }}>
        <div className="container mx-auto px-4" style={{ paddingTop: "40px" }}>
          <div
            className="w-full max-w-4xl mx-auto border border-white/8 bg-white/[0.03] p-8 backdrop-blur-sm"
            style={{
              animation: "monoFadeInUp 0.9s cubic-bezier(0.23,1,0.32,1) both",
              animationDelay: "0.45s",
              boxShadow: "0 0 60px rgba(0,143,255,0.06), 0 0 120px rgba(0,143,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {generatorConfig.videoModels.length > 0 ? (
              <VideoGeneratorInput
                config={{ ...generatorConfig, promptTemplates: [] }}
                defaults={generatorDefaults}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                calculateCredits={calculateCredits}
                onSubmit={handleSubmit}
              />
            ) : (
              <div className="border border-white/10 p-8 text-center text-[11px] text-white/50 lowercase tracking-[0.1em]">
                no active models available.
              </div>
            )}
          </div>
          {/* Scroll hint — triggers user to explore showcase below */}
          <div className="text-center mt-8">
            <a
              href="#showcase"
              onClick={e => { e.preventDefault(); document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-block"
            >
              <div className="text-[22px] md:text-[28px] font-light text-white/60 lowercase tracking-tight hover:text-white/90 transition-colors font-plex-mono">
                click an example to try.
              </div>
              <div className="text-[11px] text-white/25 tracking-[0.18em] lowercase font-plex-mono mt-1 hover:text-white/50 transition-colors">
                real prompts. real results. ↓
              </div>
            </a>
          </div>
        </div>
      </section>

        <AlertDialog open={showNotifyDialog} onOpenChange={setShowNotifyDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{tNotify("enableNotifications")}</AlertDialogTitle>
              <AlertDialogDescription>
                {tNotify("notificationDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleSkipNotify}>{tNotify("maybeLater")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleAllowNotify}>{tNotify("allow")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
