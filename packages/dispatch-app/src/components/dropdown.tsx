import * as React from 'react';

import { Select } from '@chakra-ui/react';

import { EditableField } from './editable-field';

interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (e: any) => void;
}

export const Dropdown: React.FunctionComponent<Props> = ({
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <EditableField label={label} value={value}>
      {({ onDone }) => (
        <Select
          ref={(r) => r && r.focus()}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onDone}
        >
          {options.map((o, idx) => (
            <option key={idx} value={o}>
              {o}
            </option>
          ))}
        </Select>
      )}
    </EditableField>
  );
};
