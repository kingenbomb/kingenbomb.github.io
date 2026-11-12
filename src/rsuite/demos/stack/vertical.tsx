import { VStack, Center } from 'rsuite';

const DecorativeBox = ({ children, ...rest }) => (
  <Center bg="var(--rs-placeholder)" p={40} rounded="lg" {...rest}>
    {children}
  </Center>
);

const App = () => {
  return (
    <VStack>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </VStack>
  );
};



export default App;
