import { Slider, RangeSlider } from 'rsuite';

const App = () => (
  <>
    <Slider
      progress
      defaultValue={50}
      onChange={value => {
        console.log(value);
      }}
    />
    <hr />
    <RangeSlider defaultValue={[10, 50]} />
  </>
);



export default App;
