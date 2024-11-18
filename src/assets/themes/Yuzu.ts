import { extendTheme } from '@mui/joy';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          '50': '#F3F2FF',
          '100': '#E6E5FF',
          '200': '#D2C9FF',
          '300': '#B09FFC',
          '400': '#886CF9',
          '500': '#602DF8',
          '600': '#4C16CB',
          '700': '#3D1B9B',
          '800': '#250E72',
          '900': '#130145',
        },
        text: {},
      },
    },
    dark: {
      palette: {},
    },
  },
  fontFamily: {
    display: 'Figtree, var(--joy-fontFamily-fallback)',
    body: 'Figtree, var(--joy-fontFamily-fallback)',
  },
  fontSize: {
    // font size of h1
    xl4: '2.5rem',
  },
});

export default theme;
