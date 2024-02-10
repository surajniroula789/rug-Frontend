import React from 'react';

const SelectItems = ({ items, selectedItem, onSelect }) => {
  return (
    <div>
      {items.map((item, index) => (
        <label key={index}>
          <input
            type="radio"
            name="toolcolor"
            value={index}
            onChange={() => onSelect(item)}
            checked={selectedItem === item}
          />
          {item}
        </label>
      ))}
    </div>
  );
};

export default SelectItems;
