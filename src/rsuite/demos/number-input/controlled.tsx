import { useState } from 'react';
import React from 'react';
import { NumberInput, VStack } from 'rsuite';

const App = () => {
  const [value, setValue] = React.useState(0.01);

  return (
    <VStack w={200}>
      <NumberInput value={value} onChange={setValue} step={0.01} />
    </VStack>
  );
};



export default App;
