import { AutoComplete, VStack, HStack, Text, Divider } from 'rsuite';

const data = [];

const App = () => (
  <VStack divider={<Divider />}>
    <HStack>
      <Text muted w={80}>
        Disabled
      </Text>
      <AutoComplete data={data} disabled defaultValue="Eugenia" w={200} />
    </HStack>
    <HStack>
      <Text muted w={80}>
        ReadOnly
      </Text>
      <AutoComplete data={data} readOnly defaultValue="Eugenia" w={200} />
    </HStack>
    <HStack>
      <Text muted w={80}>
        Plaintext
      </Text>
      <AutoComplete data={data} plaintext defaultValue="Eugenia" w={200} />
    </HStack>
  </VStack>
);



export default App;
