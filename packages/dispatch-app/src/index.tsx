import 'typeface-roboto';

import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { render } from 'react-dom';
import { App } from './app';
import { AppContextProvider } from './app_context';

render(
  <ChakraProvider>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </ChakraProvider>,
  document.querySelector('#app')
);
