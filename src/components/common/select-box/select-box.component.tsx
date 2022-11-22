import React from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import './select-box.component.scss';

interface Props {
  index: number;
  labelText: string;
  options: { name: string; id: number }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (data: SelectChangeEvent<any>) => void;
  size?: 'small' | 'medium' | undefined;
  disabled?: boolean;
}

const SelectBoxComponent: React.FC<Props> = ({
  labelText,
  options,
  handleChange,
  size,
  disabled,
}) => {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size={size} disabled={disabled}>
        <InputLabel id="select-label">{labelText}</InputLabel>
        <Select
          labelId="select-label"
          className="select-box"
          label={labelText}
          onChange={(e) => handleChange(e)}
          defaultValue=""
        >
          {options && options.length ? (
            options.map((opt, index) => {
              return (
                <MenuItem value={opt.name} key={index}>
                  {opt.name}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem></MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectBoxComponent;
