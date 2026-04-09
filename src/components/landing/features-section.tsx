"use client";

import { Video, Zap, Layers, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const allFeatures = [
  {
    icon: Video,
    titleKey: "True Human Kinetics",
    descKey: "Seedance 2.0 algorithm ensuring fluid, natural human motion and limb consistency.",
  },
  {
    icon: Zap,
    titleKey: "Physical Photorealism",
    descKey: "Accurate volumetric lighting and ray-traced reflections on complex surfaces.",
  },
  {
    icon: Layers,
    titleKey: "Multi-Scale Mastery",
    descKey: "Native support for cinematic 2.35:1 wide and mobile 9:16 vertical outputs.",
  },
  {
    icon: Shield,
    titleKey: "Prompt-Sanity Engine",
    descKey: "Automatic negative prompt injection to ensure anatomically correct generations.",
  },
  {
    icon: Clock,
    titleKey: "Hyper-Parallel Render",
    descKey: "Distributed compute infrastructure providing 300% faster generation speeds.",
  },
  {
    icon: Zap,
    titleKey: "Sovereign Privacy",
    descKey: "End-to-end encryption for all prompts and high-fidelity video assets.",
  },
];

export function FeaturesSection() {
  const t = useTranslations("Features");

  return (
    <section className="relative py-24 overflow-hidden bg-black font-plex-mono border-b border-white/5">
      <div className="container mx-auto px-4">
        {/* Header - Industrial Alignment */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 items-end gap-8">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-white/20 lowercase mb-4">
              [ technical specifications ]
            </div>
            <h2 className="text-[24px] md:text-[36px] font-light text-white leading-tight lowercase">
              the engine behind <br />
              <span style={{ color: "rgba(255,255,255,0.7)" }}>impossible visuals.</span>
            </h2>
          </div>
          <p className="text-[11px] text-white/35 max-w-sm ml-auto text-left md:text-right leading-relaxed lowercase">
            we don't just generate pixels. we simulate the physics of light and the rhythm of life using seedance 2.0.
          </p>
        </div>

        {/* 6-Column Matrix Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-l border-t border-white/10">
          {allFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 border-r border-b border-white/10 hover:bg-white/[0.02] transition-colors"
              >
                <div className="mb-6 opacity-30 group-hover:opacity-100 transition-opacity">
                   <Icon className="h-5 w-5 text-white" strokeWidth={1} />
                </div>
                <h3 className="text-[11px] font-plex-mono text-white/70 mb-3 tracking-[0.05em] uppercase">
                  {feature.titleKey}
                </h3>
                <p className="text-[10px] text-white/30 leading-relaxed tracking-[0.02em] lowercase">
                  {feature.descKey}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Verification Strip */}
        <div className="mt-20 flex flex-wrap justify-between items-center gap-8 opacity-20 filter grayscale">
          <span className="text-[10px] tracking-[0.2em] uppercase font-light">sora-2 compliant</span>
          <span className="text-[10px] tracking-[0.2em] uppercase font-light">veo 3.1 architecture</span>
          <span className="text-[10px] tracking-[0.2em] uppercase font-light">seedance native</span>
          <span className="text-[10px] tracking-[0.2em] uppercase font-light">zero-knowledge private</span>
        </div>
      </div>
    </section>
  );
}

