import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  :root {
    font-size: 62.5%;
    font-family: "Noto Sans Thai", "Thonburi", sans-serif;
  }

  html {
    box-sizing: border-box;
  }

  *,
  *::after,
  *::before {
    margin: 0;
    padding: 0;
  }

`;
