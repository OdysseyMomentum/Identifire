import 'typeface-roboto';

import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { render } from 'react-dom';
import { App } from './app';

render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.querySelector('#app')
);
