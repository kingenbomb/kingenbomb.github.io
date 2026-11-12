import { useState } from 'react';
import React from 'react';
import { AutoComplete } from 'rsuite';

const data = [
  'Eugenia',
  'Bryan',
  'Linda',
  'Nancy',
  'Lloyd',
  'Alice',
  'Julia',
  'Albert',
  'Louisa',
  'Lester',
  'Lola',
  'Lydia',
  'Hal',
  'Hannah',
  'Harriet',
  'Hattie',
  'Hazel',
  'Hilda'
];

const App = () => {
  const [value, setValue] = React.useState('');
  return <AutoComplete data={data} value={value} onChange={setValue} w={224} />;
};



export default App;
