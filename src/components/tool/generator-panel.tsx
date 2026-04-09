"use client";

/**
 * Generator Panel Component - Pollo.ai Style
 *
 * Tool page generator panel with dark theme design
 * Design inspired by https://pollo.ai
 * - Dark theme (#1A1A1A background)
 * - Uppercase labels for sections
 * - Purple accent color (#6D28D9)
 * - Dashed border upload area
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import { cn } from "@/components/ui";
import { DEFAULT_VIDEO_MODELS } from "@/components/video-generator";
import { getAvailableModels, calculateModelCredits } from "@/config/credits";
import { ChevronDown, X, Image as ImageIcon, Clock, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// ============================================================================
// Types
// ============================================================================

interface SectionLabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

function SectionLabel({ children, required, className }: SectionLabelProps) {
  return (
    <div className={cn("text-[9px] text-white/30 font-light uppercase tracking-[0.22em] mb-2 block font-plex-mono", className)}>
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </div>
  );
}

interface GeneratorPanelProps {
  toolType: "image-to-video" | "text-to-video" | "reference-to-video";
  isLoading?: boolean;
  onSubmit?: (data: GeneratorData) => void;
  availableModelIds?: string[];
  defaultModelId?: string;
  initialPrompt?: string;
  initialModelId?: string;
  initialDuration?: number;
  initialAspectRatio?: string;
  initialQuality?: string;
  initialImageUrl?: string;
}

export interface GeneratorData {
  toolType: string;
  model: string;
  prompt: string;
  duration: number;
  aspectRatio: string;
  quality?: string;
  outputNumber?: number;
  generateAudio?: boolean;
  imageFile?: File;
  imageUrl?: string;
  estimatedCredits: number;
}

export function GeneratorPanel({
  toolType,
  isLoading = false,
  onSubmit,
  availableModelIds,
  defaultModelId,
  initialPrompt,
  initialModelId,
  initialDuration,
  initialAspectRatio,
  initialQuality,
  initialImageUrl,
}: GeneratorPanelProps) {
  const models = getAvailableModels();
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [selectedModel, setSelectedModel] = useState(initialModelId || defaultModelId || models[0]?.id || "");
  const [duration, setDuration] = useState(initialDuration || 10);
  const [aspectRatio, setAspectRatio] = useState(initialAspectRatio || "16:9");
  const [quality, setQuality] = useState(initialQuality || "standard");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // Filter models based on tool type
  const availableModels = useMemo(() => {
    const allowList = Array.isArray(availableModelIds) && availableModelIds.length > 0;
    let filtered = allowList
      ? models.filter((m) => availableModelIds!.includes(m.id))
      : models;
    if (toolType === "image-to-video" || toolType === "reference-to-video") {
      filtered = filtered.filter((m) => m.supportImageToVideo);
    }
    return filtered;
  }, [toolType, models, availableModelIds]);

  const currentModel = useMemo(
    () => availableModels.find((m) => m.id === selectedModel) || availableModels[0],
    [selectedModel, availableModels]
  );
  const hasAvailableModels = availableModels.length > 0;

  const modelMetadata = useMemo(() => {
    return new Map(DEFAULT_VIDEO_MODELS.map((model) => [model.id, model]));
  }, []);

  const getModelIcon = (modelId: string, fallbackName: string) => {
    const meta = modelMetadata.get(modelId);
    return meta?.icon ?? fallbackName.charAt(0).toUpperCase();
  };

  const getModelColor = (modelId: string) => {
    const meta = modelMetadata.get(modelId);
    return meta?.color ?? "#71717a";
  };

  const renderModelIcon = (modelId: string, name: string, size: "sm" | "md" = "sm") => {
    const icon = getModelIcon(modelId, name);
    const color = getModelColor(modelId);
    const sizeClass = size === "sm" ? "w-4 h-4 text-xs" : "w-6 h-6 text-xs";

    if (typeof icon === "string" && (icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("/"))) {
      return (
        <img
          src={icon}
          alt={name}
          className={cn(sizeClass, "rounded object-cover")}
        />
      );
    }

    return (
      <span
        className={cn(sizeClass, "rounded flex items-center justify-center font-bold")}
        style={{ backgroundColor: color, color: "#fff" }}
      >
        {typeof icon === "string" ? icon : name.charAt(0).toUpperCase()}
      </span>
    );
  };

  useEffect(() => {
    if (!currentModel) return;

    if (currentModel.durations && !currentModel.durations.includes(duration)) {
      setDuration(currentModel.durations[0] || duration);
    }

    if (currentModel.aspectRatios && !currentModel.aspectRatios.includes(aspectRatio)) {
      setAspectRatio(currentModel.aspectRatios[0] || aspectRatio);
    }

    if (currentModel.qualities) {
      if (!currentModel.qualities.includes(quality)) {
        setQuality(currentModel.qualities[0] || quality);
      }
    }
  }, [currentModel, duration, aspectRatio, quality]);

  useEffect(() => {
    if (!availableModels.length) return;
    if (selectedModel && availableModels.some((m) => m.id === selectedModel)) {
      return;
    }
    const fallback = defaultModelId && availableModels.some((m) => m.id === defaultModelId)
      ? defaultModelId
      : availableModels[0]?.id;
    if (fallback) {
      setSelectedModel(fallback);
    }
  }, [availableModels, selectedModel, defaultModelId]);

  useEffect(() => {
    if (initialPrompt && !prompt) {
      setPrompt(initialPrompt);
    }
    if (initialImageUrl && !imageFile && !imageUrl) {
      setImageUrl(initialImageUrl);
    }
  }, [initialPrompt, initialImageUrl, prompt, imageFile, imageUrl]);

  useEffect(() => {
    if (!currentModel) return;
    if (initialDuration && currentModel.durations?.includes(initialDuration)) {
      setDuration(initialDuration);
    }
    if (initialAspectRatio && currentModel.aspectRatios?.includes(initialAspectRatio)) {
      setAspectRatio(initialAspectRatio);
    }
    if (initialQuality && currentModel.qualities?.includes(initialQuality)) {
      setQuality(initialQuality);
    }
  }, [currentModel, initialDuration, initialAspectRatio, initialQuality]);

  const estimatedCredits = useMemo(() => {
    if (!selectedModel) return 0;
    return calculateModelCredits(selectedModel, {
      duration,
      quality: currentModel?.qualities?.includes(quality) ? quality : undefined,
    });
  }, [selectedModel, duration, quality, currentModel]);

  const handleSubmit = useCallback(() => {
    if (!currentModel) return;
    const hasPrompt = prompt.trim().length > 0;
    const requiresImage = toolType !== "text-to-video";
    const hasImage = Boolean(imageFile || imageUrl);
    if (!hasPrompt || isLoading) return;
    if (requiresImage && !hasImage) return;

    const data: GeneratorData = {
      toolType,
      model: selectedModel,
      prompt: prompt.trim(),
      duration,
      aspectRatio,
      quality: currentModel?.qualities?.includes(quality) ? quality : undefined,
      outputNumber: 1,
      imageFile: imageFile || undefined,
      imageUrl: imageUrl || undefined,
      estimatedCredits,
    };

    onSubmit?.(data);
  }, [
    prompt,
    selectedModel,
    duration,
    aspectRatio,
    quality,
    imageFile,
    imageUrl,
    estimatedCredits,
    isLoading,
    toolType,
    onSubmit,
    currentModel,
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl(null);
  };

  const canSubmit = hasAvailableModels &&
    Boolean(currentModel) &&
    prompt.trim().length > 0 &&
    (!((toolType !== "text-to-video") && !imageFile && !imageUrl)) &&
    !isLoading;


  // Get page title
  const getPageTitle = () => {
    if (toolType === "image-to-video") return "IMAGE TO VIDEO";
    if (toolType === "text-to-video") return "TEXT TO VIDEO";
    if (toolType === "reference-to-video") return "REFERENCE TO VIDEO";
    return "AI GENERATOR";
  };

  return (
    <div className="h-full flex flex-col font-plex-mono">
      {/* Main Card */}
      <div className="flex-1 flex flex-col bg-black border border-white/8 overflow-hidden text-white">
        {/* Header Bar */}
        <div className="px-5 py-3 border-b border-white/8 shrink-0">
          <h2 className="text-[9px] text-white/30 font-light uppercase tracking-[0.22em]">
            {getPageTitle().toLowerCase()}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {!hasAvailableModels && (
            <div className="border border-white/8 p-4 text-[11px] text-white/30 lowercase tracking-[0.08em]">
              no models available for this tool.
            </div>
          )}

          {hasAvailableModels && (
            <>
          {/* Model Selection */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[9px] text-white/30 font-light uppercase tracking-[0.22em]">
              model
            </span>
            {currentModel && (
                <DropdownMenu open={isModelDropdownOpen} onOpenChange={setIsModelDropdownOpen}>
                <DropdownMenuTrigger asChild disabled={isLoading}>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-[11px] text-white/70 hover:text-white lowercase tracking-[0.08em]"
                  >
                    {renderModelIcon(currentModel.id, currentModel.name, "sm")}
                    <span>{currentModel.name}</span>
                    <ChevronDown className="w-3 h-3 text-white/30" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black border-white/10 w-72 max-h-[400px] overflow-y-scroll custom-scrollbar font-plex-mono">
                  <DropdownMenuLabel className="text-[9px] text-white/25 uppercase tracking-[0.2em] font-light">
                    video models
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/8" />
                  {availableModels.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      data-model-id={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className="text-white/60 hover:text-white hover:bg-white/[0.04] flex flex-col items-start py-3"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          {renderModelIcon(model.id, model.name, "md")}
                          <span className="text-[11px] tracking-[0.06em]">{model.name}</span>
                        </div>
                        {selectedModel === model.id && (
                          <Check className="w-3 h-3 text-[#008fff]" />
                        )}
                      </div>
                      {model.description && (
                        <div className="text-[10px] text-white/25 mt-1 ml-8 tracking-[0.04em]">{model.description}</div>
                      )}
                      <div className="text-[10px] text-white/25 mt-1 ml-8 flex items-center gap-2">
                        {model.maxDuration && (
                          <>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {model.maxDuration}
                            </span>
                            <span>·</span>
                          </>
                        )}
                        <span>{model.creditCost?.base ?? ""} credits</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Prompt Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionLabel className="mb-0">prompt</SectionLabel>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="describe the video you want to create..."
              disabled={isLoading}
              className="w-full min-h-[100px] max-h-[200px] px-4 py-3 bg-white/[0.02] border border-white/8 text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:border-white/20 transition-colors text-[12px] leading-relaxed tracking-[0.04em] font-plex-mono"
              rows={4}
              maxLength={2000}
            />
          </div>

          {/* Image Upload */}
          {(toolType === "image-to-video" || toolType === "reference-to-video") &&
            currentModel?.supportImageToVideo && (
              <div>
                <SectionLabel required={toolType === "image-to-video"}>
                  {toolType === "reference-to-video" ? "reference image" : "image source"}
                </SectionLabel>
                {imageFile || imageUrl ? (
                  <div className="relative group h-32 overflow-hidden border border-white/10">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Selected" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-3">
                        <span className="text-[10px] text-white/50 truncate bg-black/80 px-3 py-1.5 border border-white/10">
                          {imageFile?.name}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/80 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white/60" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-white/10 hover:border-white/25 transition-colors group">
                    <ImageIcon className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                    <p className="text-[11px] text-white/30 mt-2 lowercase tracking-[0.08em]">upload image</p>
                    <p className="text-[10px] text-white/15 mt-1 lowercase">jpg, png, webp · max 10mb</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isLoading} />
                  </label>
                )}
              </div>
            )}

          {/* Settings Group */}
          <div className="space-y-5">
            {/* Aspect Ratio */}
            {currentModel?.aspectRatios && (
              <div>
                <SectionLabel>aspect ratio</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                  {currentModel.aspectRatios.map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      onClick={() => setAspectRatio(ar)}
                      disabled={isLoading}
                      className={cn(
                        "aspect-square w-full text-[10px] font-light transition-all border flex items-center justify-center tracking-[0.06em]",
                        aspectRatio === ar
                          ? "border-[#008fff]/60 text-white bg-[#008fff]/5"
                          : "border-white/8 text-white/30 bg-white/[0.02] hover:border-white/20 hover:text-white/60"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={cn(
                          "border",
                          aspectRatio === ar ? "border-[#008fff]/60" : "border-white/20",
                          ar === "16:9" && "w-8 h-4",
                          ar === "9:16" && "w-4 h-8",
                          ar === "1:1" && "w-6 h-6",
                          ar === "4:3" && "w-6 h-4",
                          ar === "3:4" && "w-4 h-6"
                        )} />
                        <span>{ar}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Duration & Quality */}
            <div className="grid grid-cols-2 gap-4">
              {currentModel?.durations && (
                <div>
                  <SectionLabel>length</SectionLabel>
                  <div className="grid grid-cols-3 gap-1.5">
                    {currentModel.durations.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        disabled={isLoading}
                        className={cn(
                          "h-9 text-[11px] font-light transition-all border tracking-[0.06em]",
                          duration === d
                            ? "border-[#008fff]/60 text-white bg-[#008fff]/5"
                            : "border-white/8 text-white/30 bg-white/[0.02] hover:border-white/20 hover:text-white/60"
                        )}
                      >
                        {d}s
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentModel?.qualities && (
                <div>
                  <SectionLabel>resolution</SectionLabel>
                  <div className="grid grid-cols-3 gap-1.5">
                    {currentModel.qualities.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuality(q)}
                        disabled={isLoading}
                        className={cn(
                          "h-9 text-[11px] font-light transition-all border lowercase tracking-[0.04em]",
                          quality === q
                            ? "border-[#008fff]/60 text-white bg-[#008fff]/5"
                            : "border-white/8 text-white/30 bg-white/[0.02] hover:border-white/20 hover:text-white/60"
                        )}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div className="px-5 py-4 border-t border-white/8 space-y-4 shrink-0 bg-white/[0.01]">
          {/* Credits Display */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/25 uppercase tracking-[0.22em]">estimated credits</span>
            <span className="text-[12px] text-white/60 tracking-[0.06em]">{estimatedCredits}</span>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-light tracking-[0.18em] lowercase transition-all border",
              canSubmit
                ? "border-white/20 text-white/80 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30"
                : "border-white/5 text-white/20 bg-transparent"
            )}
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border border-white/20 border-t-white/60 rounded-full" style={{ animation: "spin 1s linear infinite" }} />
                generating...
              </>
            ) : (
              "→ generate video"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
