import * as React from 'react';
import { render } from 'react-dom';

export const App = () => {
  return <div>OK!</div>;
};

render(<App />, document.querySelector('#app'));
