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
  tablet: `(max-width: ${size.tablet}px)`,
  laptop: `(max-width: ${size.laptop}px)`,
  desktop: `(max-width: ${size.desktop}px)`
};

export function isTablet() {
  return innerWidth <= size.tablet;
}

export function isLaptop() {
  return innerWidth <= size.laptop;
}
