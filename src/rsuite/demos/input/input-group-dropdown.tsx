import { HStack } from 'rsuite';
import { useState } from 'react';
import ArrowDownIcon from '@rsuite/icons/ArrowDown';
import React from 'react';
import { InputGroup, Dropdown, Whisper, Popover, Input, VStack, Box } from 'rsuite';

const currencies = [
  { label: 'CNY - Chinese Yuan', value: 'CNY', symbol: '¥', flag: '🇨🇳' },
  { label: 'USD - US Dollar', value: 'USD', symbol: '$', flag: '🇺🇸' },
  { label: 'EUR - Euro', value: 'EUR', symbol: '€', flag: '🇪🇺' },
  { label: 'GBP - British Pound', value: 'GBP', symbol: '£', flag: '🇬🇧' },
  { label: 'JPY - Japanese Yen', value: 'JPY', symbol: '¥', flag: '🇯🇵' }
];

function App() {
  const [currency, setCurrency] = React.useState(currencies[0]);

  const renderMenu = ({ onClose, left, top, className }, ref) => {
    return (
      <Popover ref={ref} className={className} full>
        <Dropdown.Menu>
          {currencies.map(currency => (
            <Dropdown.Item
              key={currency.value}
              eventKey={currency.value}
              onSelect={() => {
                setCurrency(currency);
                onClose();
              }}
            >
              <Box as="span" mr={8}>
                {currency.flag}
              </Box>
              {currency.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Popover>
    );
  };

  return (
    <VStack w={300}>
      <InputGroup>
        <Whisper placement="bottomStart" trigger="click" speaker={renderMenu}>
          <InputGroup.Button>
            <HStack>
              {currency.value}
              <ArrowDownIcon />
            </HStack>
          </InputGroup.Button>
        </Whisper>
        <Input />
        <InputGroup.Addon>{currency.symbol}</InputGroup.Addon>
      </InputGroup>

      <InputGroup inside>
        <Whisper placement="bottomStart" trigger="click" speaker={renderMenu}>
          <InputGroup.Button>
            <HStack>
              {currency.value}
              <ArrowDownIcon />
            </HStack>
          </InputGroup.Button>
        </Whisper>
        <Input />
        <InputGroup.Addon>{currency.symbol}</InputGroup.Addon>
      </InputGroup>
    </VStack>
  );
}



export default App;
