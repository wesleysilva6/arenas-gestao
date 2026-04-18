import { extendTheme } from '@chakra-ui/react';

// Tema personalizado para o NovaWave - Arena - Gestão de Quadras de Beach Tennis
const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F7FF',
      100: '#BAE7FF',
      200: '#91D5FF',
      300: '#69C0FF',
      400: '#40A9FF',
      500: '#1890FF', // Cor principal
      600: '#096DD9',
      700: '#0050B3',
      800: '#003A8C',
      900: '#002766',
    },
    gazin: {
      primary: '#1890FF',
      secondary: '#52C41A',
      accent: '#FF7A45',
    },
  },
  fonts: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
      },
    },
  },
});

export default theme;
