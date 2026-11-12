import { useRef, useState } from 'react';
import React from 'react';
import { Uploader, Button } from 'rsuite';

const App = () => {
  const [fileList, setFileList] = React.useState([]);
  const uploader = React.useRef();

  return (
    <>
      <Uploader
        fileList={fileList}
        autoUpload={false}
        action="//jsonplaceholder.typicode.com/posts/"
        onChange={setFileList}
        ref={uploader}
      >
        <Button>Select files...</Button>
      </Uploader>
      <hr />
      <Button
        disabled={!fileList.length}
        onClick={() => {
          uploader.current.start();
        }}
      >
        Start Upload
      </Button>
    </>
  );
};



export default App;
