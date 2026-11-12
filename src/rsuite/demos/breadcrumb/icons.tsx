import { Breadcrumb } from 'rsuite';
import { GoHomeFill } from 'react-icons/go';

const App = () => (
  <Breadcrumb aria-label="breadcrumb">
    <Breadcrumb.Item icon={<GoHomeFill />}>Home</Breadcrumb.Item>
    <Breadcrumb.Item>Components</Breadcrumb.Item>
    <Breadcrumb.Item active>Breadcrumb</Breadcrumb.Item>
  </Breadcrumb>
);



export default App;
