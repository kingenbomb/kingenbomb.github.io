import { NumberInput, VStack } from 'rsuite';

const App = () => {
  return (
    <VStack spacing={10} w={200}>
      <NumberInput prefix="$" />
      <NumberInput suffix="￥" />
      <NumberInput suffix="%" />
    </VStack>
  );
};



export default App;
