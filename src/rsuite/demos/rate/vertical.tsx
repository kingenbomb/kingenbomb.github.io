import { Rate } from 'rsuite';
import { FaCoffee } from "react-icons/fa";

const App = () => (
  <Rate defaultValue={2.5} allowHalf vertical character={<FaCoffee />} color="blue" />
);



export default App;
