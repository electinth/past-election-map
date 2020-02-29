import { createGlobalStyle } from 'styled-components';

import NotoSansThaiUIRegularWoff from './NotoSansThaiUI-Regular.woff';
import NotoSansThaiUIRegularWoff2 from './NotoSansThaiUI-Regular.woff';

import NotoSansThaiUIRBoldWoff2 from './NotoSansThaiUI-Bold.woff2';
import NotoSansThaiUIRBoldWoff from './NotoSansThaiUI-Bold.woff';

export default createGlobalStyle`
  @font-face {
    font-family: 'Noto Sans';
    src: url(${NotoSansThaiUIRegularWoff2}) format('woff2'),
    url(${NotoSansThaiUIRegularWoff}) format('woff');
    font-weight: normal;
  }

  @font-face {
    font-family: "Noto Sans";
    src: url(${NotoSansThaiUIRBoldWoff2}) format("woff2"),
      url(${NotoSansThaiUIRBoldWoff}) format("woff");
    font-weight: bold;
  }

  @font-face {
    font-family: "Noto Sans Thai";
    src: url(${NotoSansThaiUIRegularWoff2}) format('woff2'),
    url(${NotoSansThaiUIRegularWoff}) format('woff');
    font-weight: normal;
  }

  @font-face {
    font-family: "Noto Sans Thai";
    src: url(${NotoSansThaiUIRBoldWoff2}) format("woff2"),
      url(${NotoSansThaiUIRBoldWoff}) format("woff");
    font-weight: bold;
  }

`;
