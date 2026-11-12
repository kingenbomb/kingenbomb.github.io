import { PasswordInput, VStack } from 'rsuite';
import { FaKey, FaLock } from 'react-icons/fa';

const App = () => (
  <VStack>
    <PasswordInput w={300} placeholder="Enter your password" startIcon={<FaLock />} />
    <PasswordInput w={300} placeholder="Enter your password" endIcon={<FaKey />} />
  </VStack>
);



export default App;
