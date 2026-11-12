import { Link } from 'rsuite';
import NextLink from 'next/link';

const App = () => {
  return (
    <Link as={NextLink} href="/">
      Next Link
    </Link>
  );
};



export default App;
