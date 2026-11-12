import { useState } from 'react';
import React from 'react';
import { SelectPicker } from 'rsuite';

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
  item => ({ label: item, value: item })
);

const App = () => {
  const [value, setValue] = React.useState(null);

  return <SelectPicker value={value} onChange={setValue} data={data} w={224} />;
};



export default App;
