import { Button } from 'rsuite';
import { Tooltip, Whisper } from 'rsuite';

const App = () => (
  <Whisper speaker={<Tooltip> Tooltip!</Tooltip>}>
    <span>
      <Button disabled style={{ pointerEvents: 'none' }}>
        button
      </Button>
    </span>
  </Whisper>
);



export default App;
