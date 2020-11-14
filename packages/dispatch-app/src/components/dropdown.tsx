import * as React from 'react';

import { Select } from '@chakra-ui/react';

import { EditableField } from './editable-field';

interface Props {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
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
          {options.map(({ label: l, value: v }, idx) => (
            <option key={idx} value={v}>
              {l}
            </option>
          ))}
        </Select>
      )}
    </EditableField>
  );
};
