import { Avatar, Badge, HStack } from 'rsuite';

const App = () => (
  <HStack spacing={10}>
    <Badge content={6} placement="topStart">
      <Avatar src="https://i.pravatar.cc/150?u=1" />
    </Badge>

    <Badge content={6} placement="topEnd">
      <Avatar src="https://i.pravatar.cc/150?u=1" />
    </Badge>

    <Badge content={6} placement="bottomStart">
      <Avatar src="https://i.pravatar.cc/150?u=1" />
    </Badge>

    <Badge content={6} placement="bottomEnd">
      <Avatar src="https://i.pravatar.cc/150?u=1" />
    </Badge>
  </HStack>
);



export default App;
