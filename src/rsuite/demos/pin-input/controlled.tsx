import { useState } from 'react';
import React from 'react';
import { PinInput } from 'rsuite';

const App = () => {
  const [value, setValue] = React.useState('');
  return <PinInput value={value} onChange={setValue} onComplete={value => console.log(value)} />;
};



export default App;
