import * as React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Box, Heading, Button, Spinner } from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import debounce from 'lodash.debounce';

import { RestAPI } from 'common-types';

import { Panel, TextInput, Dropdown } from '../../components';
import { map } from '../../services/map';
import { useAppContext } from '../../app_context';

const { useEffect, useState, useRef, useMemo } = React;

const HARDCODED_EMERGENCY_ADDRESS = 'Biltstraat 80, Utrecht Netherlands';

export const CreateEvent: React.FunctionComponent = () => {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const mapMarkerRef = useRef<undefined | mapboxgl.Marker>();
  const locations = useState<any[]>([]);

  const updateAddress = useMemo(
    () =>
      debounce(
        async (address: string) => {
          const { data } = await axios.get(
            `https://eu1.locationiq.com/v1/search.php?key=pk.ebb6168d820aab1459e6f928e5c11671&q=${encodeURIComponent(
              address
            )}&format=json`
          );
          const [{ lat, lon }] = data;
          // Hack
          // const lat = 52.0953925;
          // const lon = 5.1303194;
          mapMarkerRef.current = map.setCurrentEventPin({ lat, lon });
        },
        500,
        { trailing: true }
      ),
    []
  );

  useEffect(() => {
    updateAddress(HARDCODED_EMERGENCY_ADDRESS);
  }, []);

  const history = useHistory();
  const { api } = useAppContext();

  return (
    <Panel>
      <Box marginBottom="1.2rem">
        <Heading size="lg">Create event</Heading>
      </Box>
      {isCreatingEvent && <Spinner size="lg" />}
      {!isCreatingEvent && (
        <Formik
          initialValues={{
            address: HARDCODED_EMERGENCY_ADDRESS,
            type: 'Fire' as RestAPI.Dispatch.EventType,
            nrOfParticipants: 2,
            credentialType: 'BHV' as RestAPI.Dispatch.CredentialType,
          }}
          onSubmit={async (values) => {
            setIsCreatingEvent(true);
            const { lat, lng } = mapMarkerRef.current!.getLngLat();
            const { id } = await api.dispatchEvent.create({
              ...values,
              latitude: lat,
              longitude: lng,
            });
            history.push(`/event/${id}`);
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
                          onChange={(v) => {
                            updateAddress(v);
                            setFieldValue('address', v);
                          }}
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
                        options={[
                          { label: 'Fire', value: 'Fire' },
                          { label: 'Cardiac Arrest', value: 'Cardiac Arrest' },
                          { label: 'Car Crash', value: 'Car Crash' },
                        ]}
                      />
                    )}
                  </Field>
                </Box>
                <Box marginBottom="1.2rem">
                  <Field name="credentialType">
                    {({ field }) => (
                      <Dropdown
                        label="Credential Type"
                        value={field.value}
                        onChange={(v) => setFieldValue('credentialType', v)}
                        options={[
                          { label: 'BHV', value: 'BHV' },
                          { label: 'CPR', value: 'CPR' },
                        ]}
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
      )}
    </Panel>
  );
};
