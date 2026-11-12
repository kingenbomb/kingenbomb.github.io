import { useState } from 'react';
import React from 'react';
import { InputPicker } from 'rsuite';

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
  item => ({ label: item, value: item })
);

const App = () => {
  const [value, setValue] = React.useState(null);
  return <InputPicker value={value} onChange={setValue} data={data} w={224} />;
};



export default App;
