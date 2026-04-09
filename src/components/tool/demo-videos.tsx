/**
 * Demo Videos
 *
 * 空状态占位视频展示
 * - 单个示例视频
 */

import { cn } from "@/components/ui";

export function DemoVideos({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 text-center", className)}>
      <div className="w-full max-w-lg aspect-video border border-white/8 bg-white/[0.02] relative group overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
            <svg className="w-4 h-4 text-white/20 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="text-[9px] text-white/20 uppercase tracking-[0.22em]">your video will appear here</div>
        </div>
      </div>
    </div>
  );
}
