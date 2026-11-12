import { TagInput, VStack } from 'rsuite';

const App = () => (
  <VStack w={300}>
    <TagInput size="lg" placeholder="Large" block />
    <TagInput size="md" placeholder="Medium" block />
    <TagInput size="sm" placeholder="Small" block />
    <TagInput size="xs" placeholder="Xsmall" block />
  </VStack>
);



export default App;
