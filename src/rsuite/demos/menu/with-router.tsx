import Link from 'next/link';
import { Menu } from 'rsuite';

const App = () => (
  <Menu>
    <Menu.Item as={Link} href="/guide/introduction">
      Guide
    </Menu.Item>
    <Menu.Item as={Link} href="/components/overview">
      Components
    </Menu.Item>
    <Menu.Item as={Link} href="/resources/palette">
      Resources
    </Menu.Item>
  </Menu>
);


export default App;
