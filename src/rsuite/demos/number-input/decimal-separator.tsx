import { NumberInput, VStack } from 'rsuite';

const App = () => (
  <VStack w={200}>
    <NumberInput defaultValue={3.14159} step={0.00001} decimalSeparator="," />
  </VStack>
);



export default App;
