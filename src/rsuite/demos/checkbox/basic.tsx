import { Checkbox, HStack } from 'rsuite';

const App = () => (
  <HStack spacing={20}>
    <Checkbox />
    <Checkbox>Label</Checkbox>
    <Checkbox defaultChecked>Checked</Checkbox>
  </HStack>
);


export default App;
