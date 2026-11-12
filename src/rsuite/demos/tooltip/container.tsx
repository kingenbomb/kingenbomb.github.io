import { Button } from 'rsuite';
import { Tooltip, Whisper } from 'rsuite';
import PlacementContainer from '@/components/PlacementContainer';

const App = () => (
  <PlacementContainer placement="auto">
    {({ container, placement, preventOverflow }) => (
      <Whisper
        preventOverflow
        trigger="click"
        container={container}
        placement={placement}
        speaker={
          <Tooltip w={120}>
            This is a <i>tooltip</i> .
          </Tooltip>
        }
      >
        <Button appearance="primary">Click me</Button>
      </Whisper>
    )}
  </PlacementContainer>
);



export default App;
