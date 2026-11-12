import { TimePicker, VStack } from 'rsuite';

const App = () => (
  <VStack spacing={8}>
    <TimePicker size="lg" placeholder="Large" />
    <TimePicker size="md" placeholder="Medium" />
    <TimePicker size="sm" placeholder="Small" />
    <TimePicker size="xs" placeholder="Xsmall" />
  </VStack>
);



export default App;
