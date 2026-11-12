import { useState } from 'react';
import React from 'react';
import { Checkbox, CheckboxGroup } from 'rsuite';

const App = () => {
  const [value, setValue] = React.useState(['A', 'C']);
  return (
    <CheckboxGroup
      name="checkbox-group"
      value={value}
      onChange={value => {
        setValue(value);
      }}
    >
      <Checkbox value="A">Checkbox A</Checkbox>
      <Checkbox value="B">Checkbox B</Checkbox>
      <Checkbox value="C">Checkbox C</Checkbox>
      <Checkbox value="D">Checkbox D</Checkbox>
    </CheckboxGroup>
  );
};



export default App;
