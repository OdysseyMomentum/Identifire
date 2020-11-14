import * as React from 'react';

import { useHistory } from 'react-router-dom';

import axios from 'axios';

const { useEffect } = React;

import { Box, Heading, Button } from '@chakra-ui/react';

import { Formik, Field } from 'formik';

import { Panel, TextInput, Dropdown } from '../../components';

import { map } from '../../services/map';

const HARDCODED_EMERGENCY_ADDRESS = '80 biltstraat netherlands';

export const CreateEvent: React.FunctionComponent = () => {
  useEffect(() => {
    (async () => {
      // hardcoded the event location for now, in reality this will come from integration with the dispatch center
      // const { data } = await axios.get(
      //   'https://eu1.locationiq.com/v1/search.php?key=pk.ebb6168d820aab1459e6f928e5c11671&q=""&format=json'
      // );
      // const [{ lat, lon }] = data;
      // Hack
      const lat = 52.0953925;
      const lon = 5.1303194;
      map.addPin({ lat, lon });
    })();
  }, []);

  const history = useHistory();

  return (
    <Panel>
      <Box padding="1rem" borderRadius="md" backgroundColor="white">
        <Box marginBottom="1.2rem">
          <Heading size="lg">Create event</Heading>
        </Box>
        <Formik
          initialValues={{
            address: HARDCODED_EMERGENCY_ADDRESS,
            type: 'Fire',
            nrOfParticipants: 2,
          }}
          onSubmit={() => {
            console.log('do stuff');
            history.push('/event/123');
          }}
        >
          {({ setFieldValue, submitForm }) => {
            return (
              <>
                <Box marginBottom="1.2rem">
                  <Field name="address">
                    {({ field }) => {
                      return (
                        <TextInput
                          onChange={(v) => setFieldValue('address', v)}
                          label="Address"
                          value={field.value}
                        />
                      );
                    }}
                  </Field>
                </Box>
                <Box marginBottom="1.2rem">
                  <Field name="type">
                    {({ field }) => (
                      <Dropdown
                        label="Type"
                        value={field.value}
                        onChange={(v) => setFieldValue('type', v)}
                        options={['Fire', 'Health']}
                      />
                    )}
                  </Field>
                </Box>
                <Box marginBottom="1.2rem">
                  <Field name="nrOfParticipants">
                    {({ field }) => (
                      <TextInput
                        label="Number of participants"
                        value={field.value}
                        onChange={(v) => setFieldValue('nrOfParticipants', v)}
                      />
                    )}
                  </Field>
                </Box>
                <Box marginBottom="0.5rem">
                  <Button onClick={submitForm}>Create event</Button>
                </Box>
              </>
            );
          }}
        </Formik>
      </Box>
    </Panel>
  );
};
