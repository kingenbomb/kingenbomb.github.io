import { TimeRangePicker } from 'rsuite';

const App = () => (
  <>
    <TimeRangePicker hideMinutes={minute => minute % 15 !== 0} editable={false} />
  </>
);



export default App;
