import { Breadcrumb } from 'rsuite';
import Link from 'next/link';

const App = () => (
  <Breadcrumb aria-label="breadcrumb">
    <Breadcrumb.Item as={Link} href="/">
      Home
    </Breadcrumb.Item>
    <Breadcrumb.Item as={Link} href="/components/overview">
      Components
    </Breadcrumb.Item>
    <Breadcrumb.Item active>Breadcrumb</Breadcrumb.Item>
  </Breadcrumb>
);


export default App;
