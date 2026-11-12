import { TimeRangePicker, Stack } from 'rsuite';

const App = () => (
  <Stack direction="column" spacing={8} alignItems="flex-start">
    <TimeRangePicker size="lg" placeholder="Large" />
    <TimeRangePicker size="md" placeholder="Medium" />
    <TimeRangePicker size="sm" placeholder="Small" />
    <TimeRangePicker size="xs" placeholder="Xsmall" />
  </Stack>
);



export default App;
