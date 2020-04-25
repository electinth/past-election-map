export const size = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 425,
  tablet: 768,
  laptop: 1024,
  desktop: 1440
}

export const device = {
  mobile: `(max-width: ${size.mobileL}px)`,
  tablet: `(max-width: ${size.tablet}px)`
};

export function isMobile() {
  return innerWidth <= size.tablet;
}
