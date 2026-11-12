import { useState } from 'react';
import React from 'react';
import { Uploader, Button } from 'rsuite';

const App = () => {
  const [value, setValue] = React.useState([]);
  return (
    <Uploader fileList={value} action="//jsonplaceholder.typicode.com/posts/" onChange={setValue}>
      <Button>Select files...</Button>
    </Uploader>
  );
};



export default App;
