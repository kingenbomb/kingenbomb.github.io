import { useState } from 'react';
import React from 'react';
import { Rate, VStack, Divider } from 'rsuite';
import { FaHeart, FaRegStar, FaStar } from 'react-icons/fa';

const App = () => {
  const [value, setValue] = React.useState(2.5);
  return (
    <VStack spacing={10}>
      <Divider label="Svg icon" labelPlacement="start" />
      <Rate allowHalf value={value} character={<FaHeart />} color="red" onChange={setValue} />
      <Rate
        allowHalf
        value={value}
        onChange={setValue}
        color="yellow"
        renderCharacter={(value, index) => {
          if (value >= index + 1) {
            return <FaStar />;
          }
          return <FaRegStar />;
        }}
      />
      <Divider label="Emoji" labelPlacement="start" />
      <Rate allowHalf value={value} character="❤️" onChange={setValue} />
      <Rate allowHalf value={value} character="👍" onChange={setValue} />
      <Rate allowHalf value={value} character="⭐️" onChange={setValue} />
    </VStack>
  );
};



export default App;
