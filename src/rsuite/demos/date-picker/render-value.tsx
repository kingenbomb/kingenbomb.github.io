import { DatePicker } from 'rsuite';
import { format } from 'date-fns/format';

const App = () => {
  return (
    <>
      <DatePicker
        placeholder="Select Date"
        renderValue={value => {
          return format(value, 'EEE, d MMM');
        }}
      />
      <hr />

      <DatePicker
        editable={false}
        placeholder="Uneditable"
        renderValue={value => {
          return format(value, 'EEE, d MMM');
        }}
      />
    </>
  );
};



export default App;
