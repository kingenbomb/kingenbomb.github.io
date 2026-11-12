import { Nav } from 'rsuite';

const App = () => (
  <Nav defaultActiveKey="home">
    <Nav.Item eventKey="home">Home</Nav.Item>
    <Nav.Item eventKey="products">Products</Nav.Item>
    <Nav.Item eventKey="services">Services</Nav.Item>
    <Nav.Item eventKey="contact">Contact Us</Nav.Item>
  </Nav>
);



export default App;
