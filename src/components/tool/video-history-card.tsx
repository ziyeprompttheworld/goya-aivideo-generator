/**
 * Video History Card
 *
 * 单个视频历史记录卡片
 * - 生成中：显示元数据标签 + 进度面板
 * - 已完成：显示缩略图 + 标题 + 时间 + 复制按钮
 * - 失败：显示错误信息
 */

import { useTranslations } from "next-intl";
import { Copy, AlertCircle } from "lucide-react";
import { cn } from "@/components/ui";
import type { VideoHistoryItem } from "@/lib/video-history-storage";
import { toast } from "sonner";

interface VideoHistoryCardProps {
  video: VideoHistoryItem;
  isGenerating?: boolean;
  onDelete?: () => void;
}

export function VideoHistoryCard({
  video,
  isGenerating = false,
  onDelete,
}: VideoHistoryCardProps) {
  const t = useTranslations("VideoHistory");

  const isCompleted = video.status === "completed";
  const isFailed = video.status === "failed";

  // 格式化时间（显示日期和时间）
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      // 今天的视频只显示时间
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      // 其他日期显示日期和时间
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  };

  // 复制提示词
  const handleCopyPrompt = () => {
    if (video.prompt) {
      navigator.clipboard.writeText(video.prompt);
      toast.success("Prompt copied to clipboard");
    }
  };

  // metadata tags
  const renderMetadata = () => {
    return (
      <div className="flex items-center flex-wrap gap-1.5 mt-2">
        {video.model && (
          <span className="px-2 py-0.5 border border-white/8 text-[9px] text-white/30 tracking-[0.08em] lowercase">
            {video.model}
          </span>
        )}
        {video.aspectRatio && (
          <span className="px-2 py-0.5 border border-white/8 text-[9px] text-white/30 tracking-[0.08em]">
            {video.aspectRatio}
          </span>
        )}
        {video.duration && (
          <span className="px-2 py-0.5 border border-white/8 text-[9px] text-white/30 tracking-[0.08em]">
            {video.duration}s
          </span>
        )}
      </div>
    );
  };

  // generating state
  if (isGenerating || video.status === "generating") {
    return (
      <div className="border border-white/8 bg-white/[0.02] p-4 space-y-3 font-plex-mono">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-white/80 line-clamp-1 flex-1 lowercase">
            {video.prompt || "untitled"}
          </p>
          <span className="text-[9px] text-white/25 ml-3 tracking-[0.06em]">
            {formatTime(video.createdAt)}
          </span>
        </div>

        <div className="border border-white/8 bg-white/[0.02] p-5 flex items-center justify-center gap-3">
          <div className="w-4 h-4 border border-[#008fff] border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] text-white/40 lowercase tracking-[0.1em]">{t("generating")}</span>
        </div>

        {renderMetadata()}
      </div>
    );
  }

  // completed state
  if (isCompleted) {
    return (
      <div className="border border-white/8 bg-white/[0.02] overflow-hidden font-plex-mono">
        <div className="relative aspect-video bg-black">
          {video.videoUrl ? (
            <video
              src={video.videoUrl}
              className="w-full h-full object-cover"
              poster={video.thumbnailUrl || undefined}
              controls
            />
          ) : video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.prompt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center border border-white/8">
              <div className="text-[9px] text-white/20 uppercase tracking-[0.18em]">no preview</div>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-white/80 line-clamp-1 flex-1 lowercase">
              {video.prompt || "untitled"}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-white/25 tracking-[0.06em]">{formatTime(video.createdAt)}</span>
              {video.prompt && (
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="text-white/20 hover:text-white/60 transition-colors"
                  title="Copy prompt"
                >
                  <Copy className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          {renderMetadata()}
        </div>
      </div>
    );
  }

  // failed state
  if (isFailed) {
    return (
      <div className="border border-white/8 bg-white/[0.02] p-4 space-y-3 font-plex-mono">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400/70 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-rose-400/70 lowercase tracking-[0.06em]">{t("generationFailed")}</p>
            <p className="text-[9px] text-white/25 truncate mt-0.5 lowercase">
              {video.prompt || "unknown error"}
            </p>
          </div>
        </div>

        {renderMetadata()}

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="w-full text-[9px] text-white/20 uppercase tracking-[0.18em] hover:text-rose-400/60 transition-colors py-1.5 border border-white/8 hover:border-rose-400/20"
          >
            {t("removeFromHistory")}
          </button>
        )}
      </div>
    );
  }

  return null;
}
