import { createGlobalStyle } from 'styled-components';
import COLOR from './color';

export default createGlobalStyle`
  :root {
    font-size: 62.5%;
    font-family: "Noto Sans Thai", "Thonburi", sans-serif;
    color: ${COLOR.white};
  }

  html {
    box-sizing: border-box;
  }

  *,
  *::after,
  *::before {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${COLOR.background};
  }

`;
