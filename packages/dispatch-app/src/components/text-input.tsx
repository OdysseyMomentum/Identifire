import * as React from 'react';

import { Input } from '@chakra-ui/react';

import { EditableField } from './editable-field';

interface Props {
  label: string;
  value: string;
  onChange: (ev: any) => void;
}

export const TextInput: React.FunctionComponent<Props> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <EditableField label={label} value={value}>
      {({ onDone }) => (
        <Input
          ref={(r) => r && r.focus()}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onBlur={onDone}
        />
      )}
    </EditableField>
  );
};
