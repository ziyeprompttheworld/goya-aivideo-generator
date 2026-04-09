"use client";

import { useTranslations } from "next-intl";
import { Marquee } from "@/components/magicui/marquee";
import { usePromptStore } from "@/store/use-prompt-store";
import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const showcaseItems = [
  {
    id: 1,
    prompt: "Reference @Image1 @Image2 for the silver-haired samurai, @Image3 @Image4 for the moonlit temple courtyard. High-end 3D Anime CG. A lightning-fast sword duel where blades clash with bright white sparks. The character executes a low-crouch dash and a vertical slash. Dynamic shaky-cam tracking follows the impact amidst swirling pink petals.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1770617365351_pWUvusx9.mp4",
  },
  {
    id: 2,
    prompt: "Reference @Image1 @Image2 for the cyber-ninja with a glowing mask, @Image3 @Image4 for the rainy neon rooftop. Cyberpunk anime aesthetic. The character draws a violet plasma katana, deflecting bullets in slow-motion. Handheld orbit lens with heavy rain distortion and purple-blue chromatic aberration.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1770618273175_M6cW36mJ.mp4",
  },
  {
    id: 3,
    prompt: "Reference @Image1 @Image2 for the female warrior in black leather, @Image3 @Image4 for the misty bamboo maze. Noir action anime. A sequence of rapid martial arts strikes and a backflip escape. Low-angle sliding camera through the bamboo stalks with thick volumetric fog and moonlight silhouettes.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1770618931964_28zeDQBH.mp4",
  },
  {
    id: 4,
    prompt: "Reference @Image1 @Image2 for the monk in red robes, @Image3 @Image4 for the sunlit mountain peak. Epic game cinematic style. The character performs a heavy ground-pound jump, creating a massive shockwave that displaces rocks and dust. Wide panoramic sweep to a dramatic low-angle heroic pose.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1775194361294_SXn6akG9.mp4",
  },
  {
    id: 5,
    prompt: "Reference @Image1 @Image2 for the spear-wielding hero, @Image3 @Image4 for the ancient stone bridge. Professional 3D anime combat. A continuous spear-spinning combo with golden energy trails. Multi-angle jump-cuts capturing the fluid rotation and powerful lunges against a sunset sky.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1775188128418_vnfwuDsj.mp4",
  },
  {
    id: 6,
    prompt: "Reference @Image1 @Image2 for the hooded assassin, @Image3 @Image4 for the dark gothic library. Dark fantasy anime mood. A tense moment of drawing a hidden dagger followed by a supernatural shadow-dash. Extreme close-up of the cold steel and the assassin's sharp focused eye.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1775200730595_9fXLmiHd.mp4",
  },
  {
    id: 7,
    prompt: "Reference @Image1 @Image2 for the character in a flowy white kimono, @Image3 @Image4 for the reflecting water surface. Elegant Zen-style animation. A slow-motion martial arts dance sequence on water, featuring liquid splashes and shimmery light reflections. Soft zoom-in focusing on the fluid hand movements.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1775188761712_tHGAgzLy.mp4",
  },
  {
    id: 8,
    prompt: "Reference @Image1 @Image2 for the swordsman in purple, @Image3 @Image4 for the autumn courtyard. High-fidelity 3D anime. A sequence of high-speed sword parries and a finishing thrust. Spinning gimbal shot capturing the cascade of red maple leaves reacting to the blade's wind.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1770627047985_WYEvEd7j.mp4",
  },
  {
    id: 9,
    prompt: "Reference @Image1 @Image2 for the martial monk, @Image3 @Image4 for the blue crystal cavern. Fantasy RPG cinematic style. Using glowing blue sticks to perform a rapid martial arts form. Wide-angle shot showing the bioluminescent environment and refracting light trails.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1775188464994_6ZaW8Ki0.mp4",
  },
  {
    id: 10,
    prompt: "Reference @Image1 @Image2 for the bearded sage, @Image3 @Image4 for the misty floating islands. Ethereal wuxia anime. Slow meditative movements creating visible energy ripples in the clouds. 360-degree rotating camera capturing the transcendental environment and spiritual aura.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1770618718325_qVrPkEZ4.mp4",
  },
  {
    id: 11,
    prompt: "Reference @Image1 @Image2 for the armored knight, @Image3 @Image4 for the scorched earth. Dark anime battlefield aesthetic. A massive vertical sword strike that cracks the ground with orange lava-like energy. Ground-level shaky tracking shot with heavy smoke and flying sparks.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1770619066233_For2ECDT.mp4",
  },
  {
    id: 12,
    prompt: "Reference @Image1 @Image2 for the spirit fox slayer, @Image3 @Image4 for the dense red forest. High-octane action anime. A supernatural dash sequence through a maze of trees, leaves flying in the wake of the movement. Smooth side-tracking drone shot at high velocity.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/1775201074754_7n64QXXP.mp4",
  },
  {
    id: 13,
    prompt: "reference the character movements and cinematography from @video1. generate a fight scene with @image2 as the left character and @image1 as the right character. intense action soundtrack.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_fight_scene.mp4",
  },
  {
    id: 14,
    prompt: "reference the camera movement from @video1. create a tech park concept video centered on the skyscraper in @image1. match the first-person diving perspective, conveying the futuristic and technological atmosphere of the campus.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_techpark_dive.mp4",
  },
  {
    id: 15,
    prompt: "reference the special effect from @video1. make the girl in @image1 grow the same wings, with identical wing-emergence trajectory.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_wings_effect.mp4",
  },
  {
    id: 16,
    prompt: "neon-lit futuristic sky corridor backdrop, with flying vehicles and holographic ads. the girl from @image2 releases silver levitating lanterns with holographic projections. camera pulls back to reveal lanterns filling the sky. scene fades to reveal the logo from @image1. 3d cyberpunk sci-fi animation style.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_cyberpunk_logo.mp4",
  },
  {
    id: 17,
    prompt: "hand-drawn comic style. three people sit together eating the fried chicken from @image1, warm and joyful atmosphere. the scene gradually blurs, and the text 'joy is in every moment' appears in the center of the frame.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_comic_chicken.mp4",
  },
  {
    id: 18,
    prompt: "extract the camera from @image1 @image2 @image3. place it on a white table against a pure white background. lens focuses on the camera in extreme close-up, then slowly orbits around it, clearly revealing the front, side, and back.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_camera_360.mp4",
  },
  {
    id: 19,
    prompt: "warm residential setting. medium shot of the thermos flask from @image1. camera smoothly pushes in to a close-up. a hand enters frame naturally, gently grips the flask and lifts it. camera follows the hand's slight rotation to showcase the product.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_thermos_product.mp4",
  },
  {
    id: 20,
    prompt: "add fried chicken, pizza, and other snacks onto the table surface in @video1. keep all other elements unchanged.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_table_food_add.mp4",
  },
  {
    id: 21,
    prompt: "replace the perfume bottle in @video1 with the face cream from @image1. keep all movements and camera work unchanged.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_perfume_replace.mp4",
  },
  {
    id: 22,
    prompt: "a leaf drifts down and lands on the ground, triggering a burst of golden particle effects. a gust of wind sweeps through, transitioning seamlessly into the next scene.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_leaf_extend.mp4",
  },
  {
    id: 23,
    prompt: "reference @image1 @image2 for the girl's appearance. the girl is in a strawberry field, picks one, takes a bite, and smiles saying: 'this is the real deal!' a speech bubble appears around her displaying the line.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_strawberry_bubble.mp4",
  },
  {
    id: 24,
    prompt: "reference @image1 for the two people chatting in an office. the woman speaks first: 'you always arrive right on time — do you enjoy that perfect timing?' the man smiles and replies: 'i have my own rhythm.' dialogue flows naturally, with matching subtitles appearing at the bottom of the frame.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_office_subtitle.mp4",
  },
  {
    id: 25,
    prompt: "set in the restaurant from @image4, with people coming and going. the girl from @image1 wears the outfit from @image2, tidying items at the counter. the boy from @image3 is a customer who approaches her, trying to ask for her contact. the logo from @image5 remains fixed in the lower-right corner throughout.",
    tag: "seedance 2.0",
    video: "https://pub-ac32e248dea34c51a8046b2a234cb4ba.r2.dev/showcase/sd2_restaurant_scene.mp4",
  },
];

function ShowcaseCard({ item }: { item: (typeof showcaseItems)[0] }) {
  const setPrompt = usePromptStore((state) => state.setPrompt);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible]);

  const handleCardClick = () => {
    setPrompt(item.prompt);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      onClick={handleCardClick}
      className="relative shrink-0 w-[280px] md:w-[420px] border border-white/10 overflow-hidden group cursor-pointer bg-black/40 backdrop-blur-sm transition-all hover:border-primary/50"
    >
      <div className="relative aspect-video overflow-hidden">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        >
          <source src={item.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-primary/40">
                <span className="text-[10px] text-white font-medium uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Try this prompt
                </span>
            </div>
        </div>
        <div className="absolute top-3 left-3 px-1.5 py-0.5 border border-white/20 bg-black/50">
          <span className="text-[9px] font-plex-mono text-white/60 lowercase tracking-[0.15em]">{item.tag}</span>
        </div>
      </div>
      <div className="px-4 py-3 bg-black border-t border-white/10">
        <p className="text-[10px] font-plex-mono text-white/40 lowercase tracking-[0.08em] leading-relaxed group-hover:text-white/80 transition-colors">
           → {item.prompt}
        </p>
      </div>
    </div>
  );
}

export function ShowcaseSection() {
  const t = useTranslations("Showcase");

  return (
    <section id="showcase" className="relative z-20 pb-24 overflow-hidden bg-black font-plex-mono border-y border-white/5" style={{ marginTop: "0" }}>
      <div style={{ paddingTop: "48px" }}>

      {/* Marquee row 1 — forward */}
      <Marquee pauseOnHover className="[--duration:70s] mb-4">
        {showcaseItems.slice(0, 13).map((item) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
      </Marquee>

      {/* Marquee row 2 — reverse */}
      <Marquee reverse pauseOnHover className="[--duration:70s]">
        {showcaseItems.slice(13).map((item) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
      </Marquee>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />
      
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-plex-mono">
            {t("ctaText")}
          </span>
        </div>
      </div>
      </div>
    </section>
  );
}
