import heroHoneySweets from './images/hero_honey_sweets_1794457838197.jpg';
import honeySundarbanPure from './images/honey_sundarban_pure_1794457838212.jpg';
import sweetsKalojamBox from './images/sweets_kalojam_box_1794457839440.jpg';
import sweetsRoshogolla from './images/sweets_roshogolla_1794457839024.jpg';

export const ASSETS = {
  heroHoneySweets,
  honeySundarbanPure,
  sweetsKalojamBox,
  sweetsRoshogolla,
};

const LEGACY_PATH_MAP: Record<string, string> = {
  '/src/assets/images/hero_honey_sweets_1794457838197.jpg': heroHoneySweets,
  '/src/assets/images/honey_sundarban_pure_1794457838212.jpg': honeySundarbanPure,
  '/src/assets/images/sweets_kalojam_box_1794457839440.jpg': sweetsKalojamBox,
  '/src/assets/images/sweets_roshogolla_1794457839024.jpg': sweetsRoshogolla,
};

export function resolveAssetUrl(url: string): string {
  if (!url) return honeySundarbanPure;
  return LEGACY_PATH_MAP[url] || url;
}
