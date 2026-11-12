import { Tooltip, Whisper, Button } from 'rsuite';

const App = () => (
  <Whisper
    placement="top"
    trigger="click"
    speaker={<Tooltip arrow={false}>This is a Tooltip without arrow indicator</Tooltip>}
  >
    <Button>Click</Button>
  </Whisper>
);



export default App;
