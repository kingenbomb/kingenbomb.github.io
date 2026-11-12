import { NumberInput, VStack } from 'rsuite';

const App = () => (
  <VStack w={200}>
    <NumberInput defaultValue={0.01} step={0.01} />
  </VStack>
);



export default App;
