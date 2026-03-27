import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import './index.css';
import App from './App.tsx';
// import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
    <ChakraProvider theme={theme}>
      <App /> 
    </ChakraProvider>
);
