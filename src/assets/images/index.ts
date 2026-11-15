import heroHoneySweets from './hero_honey_sweets_1794457838197.jpg';
import honeySundarbanPure from './honey_sundarban_pure_1794457838212.jpg';
import sweetsKalojamBox from './sweets_kalojam_box_1794457839440.jpg';
import sweetsRoshogolla from './sweets_roshogolla_1794457839024.jpg';

export const IMAGES = {
  heroHoneySweets,
  honeySundarbanPure,
  sweetsKalojamBox,
  sweetsRoshogolla,
};

const LEGACY_IMAGE_MAP: Record<string, string> = {
  '/src/assets/images/hero_honey_sweets_1794457838197.jpg': heroHoneySweets,
  '/src/assets/images/honey_sundarban_pure_1794457838212.jpg': honeySundarbanPure,
  '/src/assets/images/sweets_kalojam_box_1794457839440.jpg': sweetsKalojamBox,
  '/src/assets/images/sweets_roshogolla_1794457839024.jpg': sweetsRoshogolla,
};

export function normalizeImagePath(path: string): string {
  return LEGACY_IMAGE_MAP[path] || path;
}
