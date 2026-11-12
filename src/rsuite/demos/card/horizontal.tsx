import { Card, Text, VStack, TagGroup, Tag } from 'rsuite';

const App = () => {
  return (
    <Card width={500} shaded direction="row">
      <img
        src="https://images.unsplash.com/photo-1576606539605-b2a44fa58467?q=80&w=1974"
        alt="Shadow"
        width={200}
        style={{ objectFit: 'cover' }}
      />
      <VStack spacing={2}>
        <Card.Header>
          <Text size="lg" bold>
            Cream
          </Text>
        </Card.Header>
        <Card.Body>
          Meet Shadow, a spirited little explorer with a heart full of adventure! This charming pup
          loves to roam the fields, soaking up the sights and sounds of nature.
        </Card.Body>
        <Card.Footer>
          <TagGroup>
            <Tag size="sm">🐶 Dog</Tag>
            <Tag size="sm">☀️ Sunny</Tag>
            <Tag size="sm">🌈 Rainbow</Tag>
          </TagGroup>
        </Card.Footer>
      </VStack>
    </Card>
  );
};



export default App;
