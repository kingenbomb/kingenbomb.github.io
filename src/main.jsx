import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Toaster } from 'sonner';
import App from './App.jsx';
import './css/fonts.css';
import './css/variables.css';
import './css/preview-slider.css';
import './css/color-picker.css';
import './css/docs.css';
import './css/category.css';
import './styles.css';

document.documentElement.setAttribute('data-theme', 'dark');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <HashRouter>
        <App />
        <Toaster theme="dark" position="bottom-right" />
      </HashRouter>
    </ChakraProvider>
  </StrictMode>
);
