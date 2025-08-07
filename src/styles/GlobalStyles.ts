import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: "DS-Digital";
    src: url("/src/assets/fonts/DS-DIGI.TTF") format("truetype");
  }
  *, *::before, *::after {
    box-sizing: border-box;
    user-select: none;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    max-width: 100vw;
    min-height: 100vh;
    background-color: #e0f7fa;
  }

  body {
    font-family: "Segoe UI", sans-serif;
    background-color: #e0f7fa;
    color: #004d40;
  }
`;

export default GlobalStyles;
