import { Link, HStack } from 'rsuite';

const App = () => {
  return (
    <HStack spacing={20}>
      <Link underline="always">Underline always</Link>
      <Link underline="hover">Underline hover</Link>
      <Link underline="not-hover">Underline not-hover</Link>
      <Link underline="never">Underline never</Link>
    </HStack>
  );
};


export default App;
