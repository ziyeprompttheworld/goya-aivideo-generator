"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { LocaleLink } from "@/i18n/navigation";
import { cn } from "@/components/ui";
import { NEW_USER_GIFT } from "@/config/pricing-user";

/**
 * CTA Section - 行动号召区域
 *
 * 设计模式: Social Proof + CTA
 * - 用户头像展示社交证明
 * - Marquee 滚动展示评价
 * - Glassmorphism 风格卡片
 */

// 优势列表
const benefits = [
  { icon: Check, labelKey: "benefits.free", color: "text-green-500" },
  { icon: Check, labelKey: "benefits.noCard", color: "text-green-500" },
  { icon: Check, labelKey: "benefits.cancel", color: "text-green-500" },
  { icon: Check, labelKey: "benefits.support", color: "text-green-500" },
];

export function CTASection() {
  const t = useTranslations("CTA");

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* 全黑背景 */}
      <div className="absolute inset-0 -z-10 bg-black" />

      <div className="container mx-auto px-4">
        <div className="relative max-w-6xl mx-auto">
          {/* 主要 CTA 卡片 */}
          <BlurFade inView>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative border border-white/10 bg-transparent overflow-hidden font-plex-mono"
            >

              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                {/* 左侧: 内容 */}
                <div className="space-y-6">
                  {/* 徽章 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 border border-white/20"
                  >
                    <Sparkles className="h-3 w-3 text-white/50" />
                    <span className="text-[10px] uppercase font-plex-mono tracking-widest text-white/50">
                      {t("badge")}
                    </span>
                  </motion.div>

                  {/* 标题 */}
                  <h2 className="text-2xl md:text-3xl font-light text-white lowercase tracking-widest leading-normal">
                    {t("title")}
                    <span className="block text-white/50 mt-2">
                      {t("subtitle")}
                    </span>
                  </h2>

                  {/* 描述 */}
                  <p className="text-[11px] text-white/40 tracking-[0.1em] lowercase max-w-sm">
                    {t("description")}
                  </p>

                  {/* 优势列表 */}
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => {
                      const Icon = benefit.icon;
                      return (
                        <motion.li
                          key={benefit.labelKey}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 text-[11px] text-white/60 lowercase tracking-[0.05em]"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-white/40" />
                          <span>{t(benefit.labelKey, { credits: NEW_USER_GIFT.credits })}</span>
                        </motion.li>
                      );
                    })}
                  </ul>

                  {/* CTA 按钮组 */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <LocaleLink href="/#generator">
                      <div
                        className="inline-flex items-center border border-white/20 px-8 py-3 text-[11px] font-plex-mono text-white/70 tracking-[0.1em] hover:border-white/50 transition-colors cursor-pointer lowercase"
                      >
                        {t("getStarted")}
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </div>
                    </LocaleLink>

                  </div>

                  {/* 社交证明 - 头像 (Hidden for audit) */}
                  {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4 pt-4"
                  >
                    <AvatarCircles
                      numPeople={500000}
                      avatarUrls={avatarUrls}
                      className="justify-start"
                    />
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">4.9/5</span>{" "}
                        {t("from")} 2,000+ {t("reviews")}
                      </p>
                    </div>
                  </motion.div> */}
                </div>

                {/* 右侧: 预览卡片 */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* 视频预览卡片 */}
                  <div className="relative border border-white/10 bg-black overflow-hidden font-plex-mono">
                    <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      >
                        <source src="/assets/seedance_showcase/1775188128418_vnfwuDsj.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      {/* Subtitle/Prompt Overlay */}
                      <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md border border-white/10 p-2 opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-[9px] text-white/70 font-plex-mono leading-tight lowercase">
                          → cinematic wide shot: glowing neon structures in a void, sharp physics-based reflections.
                        </p>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-[10px] lowercase tracking-[0.1em] text-white/50">
                        <span>[ render complete ]</span>
                        <span className="text-[#008fff]">verified</span>
                      </div>
                      <div className="h-0.5 bg-white/10 overflow-hidden">
                        <div className="h-full w-full bg-[#008fff]/60" />
                      </div>
                      <p className="text-[9px] text-white/20 text-center tracking-[0.2em] lowercase">
                        seedance 2.0 native output
                      </p>
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </BlurFade>

        </div>
      </div>
    </section>
  );
}
