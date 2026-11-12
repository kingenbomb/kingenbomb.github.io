import { TimePicker } from 'rsuite';

const App = () => (
  <>
    <TimePicker hideMinutes={minute => minute % 15 !== 0} editable={false} />
  </>
);



export default App;
