export const normalizeCJKSpaces = (input: string): string => {
  return input
    .replace(/([\u4E00-\u9FFF])\s+([\u4E00-\u9FFF])/gu, '$1$2')
    .replace(/([\u4E00-\u9FFF])[\u00A0\u2000-\u200A\u202F\u205F\u3000\u2060\uFEFF]+([\u4E00-\u9FFF])/gu, '$1$2');
};
