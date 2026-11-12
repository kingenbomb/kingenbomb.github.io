import { VisuallyHidden, Button } from 'rsuite';
import { FaUniversalAccess } from 'react-icons/fa';

const App = () => (
  <Button>
    <VisuallyHidden>Universal Access</VisuallyHidden>
    <FaUniversalAccess />
  </Button>
);



export default App;
