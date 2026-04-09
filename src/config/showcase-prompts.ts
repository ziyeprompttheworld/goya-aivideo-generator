export interface ShowcaseVideo {
  id: string;
  url: string;
  thumbnail: string;
  prompt: string;
  title: string;
}

export const SHOWCASE_VIDEOS: ShowcaseVideo[] = [
  {
    id: "kenjutsu",
    url: "/seedance_showcase/1770617365351_pWUvusx9.mp4",
    thumbnail: "/seedance_showcase/thumbnails/1770617365351.jpg",
    title: "Kenjutsu Duel",
    prompt: "Reference @Image1 @Image2 for the white-haired swordsman, @Image3 @Image4 for the traditional dojo. A high-speed kenjutsu duel where the character dodges and counters with lethal precision. Dynamic tracking shots follow the blade's path, capturing cherry blossom petals drifting in the air."
  },
  {
    id: "martial-arts",
    url: "/seedance_showcase/1775188128418_vnfwuDsj.mp4",
    thumbnail: "/seedance_showcase/thumbnails/1775188128418.jpg",
    title: "Martial Arts Master",
    prompt: "Reference @Image1 @Image2 for the spear-wielding character, @Image3 @Image4 for the scene. Generate a martial arts action sequence where the character performs fluid spear techniques. Use multi-angle tracking shots to capture the power and beauty of martial arts."
  },
  {
    id: "cyber-samurai",
    url: "/seedance_showcase/1770618273175_M6cW36mJ.mp4",
    thumbnail: "/seedance_showcase/thumbnails/1770618273175.jpg",
    title: "Cyber Samurai",
    prompt: "Reference @Image1 @Image2 for the cyber-samurai, @Image3 @Image4 for the neon-lit rooftop. The character ignites a plasma sword, engaging in futuristic combat against multiple shadows. Handheld camera movement with motion blur."
  },
  {
    id: "monk-crystals",
    url: "/seedance_showcase/1775188464994_6ZaW8Ki0.mp4",
    thumbnail: "/seedance_showcase/thumbnails/1775188464994.jpg",
    title: "Crystal Cave Monk",
    prompt: "Reference @Image1 @Image2 for the dual-wielding monk, @Image3 @Image4 for the cave of crystals. Ethereal martial arts where each strike glows with blue light. Wide panoramic sweep followed by tight gimbal shots."
  }
];
