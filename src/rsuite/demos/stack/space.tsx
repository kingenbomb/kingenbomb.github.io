import { Stack } from 'rsuite';
import { useState } from 'react';
import React from 'react';
import { VStack, HStack, Slider, Text, Center } from 'rsuite';

const DecorativeBox = ({ children, ...rest }) => (
  <Center bg="var(--rs-placeholder)" p={40} rounded="lg" {...rest}>
    {children}
  </Center>
);

const App = () => {
  const [spacing, setSpacing] = React.useState(6);

  return (
    <VStack spacing={20}>
      <HStack wrap>
        <Text muted>Spacing</Text>
        <Slider value={spacing} w={300} onChange={setSpacing} keepTooltipOpen />
      </HStack>
      <Stack spacing={spacing}>
        <DecorativeBox />
        <DecorativeBox />
        <DecorativeBox />
        <DecorativeBox />
      </Stack>
    </VStack>
  );
};



export default App;
