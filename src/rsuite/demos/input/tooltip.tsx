import InfoRoundIcon from '@rsuite/icons/InfoRound';
import { Input, Whisper, InputGroup, Tooltip, VStack } from 'rsuite';

const App = () => (
  <VStack w={300}>
    <InputGroup inside>
      <Input />
      <InputGroup.Addon>
        <Whisper placement="top" speaker={<Tooltip> Help information</Tooltip>}>
          <InfoRoundIcon />
        </Whisper>
      </InputGroup.Addon>
    </InputGroup>

    <Whisper trigger="focus" speaker={<Tooltip>Required</Tooltip>}>
      <Input autoComplete="off" />
    </Whisper>
  </VStack>
);



export default App;
