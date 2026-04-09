"use client";

import { Type, Upload, Video, Download, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { BlurFade } from "@/components/magicui/blur-fade";
import { MagicCard } from "@/components/magicui/magic-card";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { cn } from "@/components/ui";
import { LocaleLink } from "@/i18n/navigation";

/**
 * How It Works Section - 工作流程展示
 *
 * 设计模式: Step-by-Step with MagicCard + Connected Timeline
 * - MagicCard 鼠标跟随光效
 * - 渐变连接线 + 箭头
 * - 动画数字计数器
 */

// 步骤数据
const steps = [
  {
    step: "01",
    icon: Type,
    titleKey: "steps.prompt.title",
    descKey: "steps.prompt.description",
    gradient: { from: "#9E7AFF", to: "#C084FC" },
    stat: { value: 30, suffix: "s", labelKey: "steps.prompt.stat" },
  },
  {
    step: "02",
    icon: Upload,
    titleKey: "steps.upload.title",
    descKey: "steps.upload.description",
    gradient: { from: "#6366F1", to: "#818CF8" },
    stat: { value: 20, suffix: "+", labelKey: "steps.upload.stat" },
  },
  {
    step: "03",
    icon: Video,
    titleKey: "steps.generate.title",
    descKey: "steps.generate.description",
    gradient: { from: "#EC4899", to: "#F472B6" },
    stat: { value: 2, suffix: "min", labelKey: "steps.generate.stat" },
  },
  {
    step: "04",
    icon: Download,
    titleKey: "steps.download.title",
    descKey: "steps.download.description",
    gradient: { from: "#F59E0B", to: "#FBBF24" },
    stat: { value: 1080, suffix: "p", labelKey: "steps.download.stat" },
  },
];

export function HowItWorks() {
  const t = useTranslations("HowItWorks");

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* 全黑背景 */}
      <div className="absolute inset-0 -z-10 bg-black" />

      <div className="container mx-auto px-4">
        {/* 区域标题 */}
        <BlurFade inView>
          <motion.div className="text-center max-w-3xl mx-auto mb-16">
            {/* 徽章 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 mb-6"
            >
              <Clock className="h-3 w-3 text-white/50" />
              <span className="text-[10px] uppercase font-plex-mono tracking-widest text-white/50">
                {t("badge")}
              </span>
            </motion.div>

            {/* 主标题 */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl md:text-3xl font-light font-plex-mono text-white mb-4 lowercase tracking-widest"
            >
              {t("title")}
              <span className="block text-white/50 mt-2">
                {t("subtitle")}
              </span>
            </motion.h2>

            {/* 描述 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[11px] font-plex-mono text-white/40 tracking-[0.1em] lowercase max-w-2xl mx-auto"
            >
              {t("description")}
            </motion.p>
          </motion.div>
        </BlurFade>

        {/* 步骤卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <BlurFade key={step.step} delay={index * 0.1} inView>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* 包裹层：抛弃 MagicCard */}
                  <div
                    className="h-full border border-white/10 bg-transparent flex flex-col font-plex-mono p-6"
                  >
                    <div className="relative h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="w-6 h-6 flex items-center justify-center text-[10px] font-light text-white shrink-0 border border-white/20"
                        >
                          {step.step}
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                          className="w-10 h-10 flex items-center justify-center opacity-70"
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </motion.div>
                      </div>

                      {/* 标题 */}
                      <h3 className="text-[12px] font-light text-white mb-2 lowercase tracking-[0.1em] line-clamp-1">
                        {t(step.titleKey)}
                      </h3>

                      {/* 描述 */}
                      <p className="text-[11px] text-white/40 tracking-[0.05em] leading-[1.8] lowercase line-clamp-2 flex-1">
                        {t(step.descKey)}
                      </p>

                      {/* 统计数据 */}
                      {step.stat && (
                        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between uppercase tracking-[0.1em]">
                          <span className="text-[10px] text-white/30">
                            {t(step.stat.labelKey)}
                          </span>
                          <span className="text-[12px] text-white/60 tabular-nums">
                            <NumberTicker value={step.stat.value} />
                            <span className="text-[10px] ml-0.5">
                              {step.stat.suffix}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </BlurFade>
            );
          })}
        </div>

        {/* 底部 CTA */}
        <BlurFade delay={0.5} inView>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            <LocaleLink href="/#generator">
              <div
                className="inline-flex items-center border border-white/20 px-8 py-3 text-[11px] font-plex-mono text-white/70 tracking-[0.1em] hover:border-white/50 transition-colors cursor-pointer lowercase"
              >
                {t("cta")}
                <ArrowRight className="ml-2 h-3 w-3" />
              </div>
            </LocaleLink>
          </motion.div>
        </BlurFade>
      </div>
    </section>
  );
}
