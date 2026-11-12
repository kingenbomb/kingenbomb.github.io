import { NumberInput, VStack } from 'rsuite';

const App = () => (
  <VStack w={200}>
    <NumberInput defaultValue={10} max={100} min={10} />
  </VStack>
);



export default App;
