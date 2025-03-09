/*
 * HomePage Component
 *
 * @module HomePage
 * @description UI for mapping Keycloak roles to Strapi roles in Strapi Admin panel.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  Typography,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Option,
  Loader,
  Alert,
} from '@strapi/design-system';
import { Check, ExclamationMarkCircle } from '@strapi/icons';

/**
 * HomePage Component
 *
 * @returns {JSX.Element} Component for managing role mappings between Keycloak and Strapi.
 */
const HomePage = () => {
  /**
   * State for managing UI and data.
   * @type {[Object, React.Dispatch<React.SetStateAction<Object>>]}
   */
  const [state, setState] = useState({
    keycloakRoles: [],
    strapiRoles: [],
    roleMappings: {},
    loading: true,
    error: null,
    success: false,
  });

  useEffect(() => {
    /**
     * Fetches roles from Keycloak and Strapi, and retrieves saved mappings.
     *
     * @async
     * @function fetchRoles
     */
    async function fetchRoles() {
      try {
        const rolesResponse = await axios.get('/strapi-keycloak-passport/keycloak-roles');
        const mappingsResponse = await axios.get('/strapi-keycloak-passport/get-keycloak-role-mappings');

        setState(prev => ({
          ...prev,
          keycloakRoles: rolesResponse.data.keycloakRoles,
          strapiRoles: rolesResponse.data.strapiRoles,
          roleMappings: mappingsResponse.data,
          loading: false,
        }));
      } catch (err) {
        setState(prev => ({ ...prev, error: 'Failed to fetch roles. Please check Keycloak settings.', loading: false }));
      }
    }
    fetchRoles();
  }, []);

  /**
   * Updates the role mapping state when a role is selected.
   *
   * @param {string} keycloakRole - The Keycloak role name.
   * @param {number} strapiRole - The selected Strapi role ID.
   */
  const handleRoleMappingChange = (keycloakRole, strapiRole) => {
    setState(prev => ({
      ...prev,
      roleMappings: {
        ...prev.roleMappings,
        [keycloakRole]: strapiRole,
      },
    }));
  };

  /**
   * Saves the current role mappings to Strapi.
   *
   * @async
   * @function saveMappings
   */
  const saveMappings = async () => {
    try {
      await axios.post('/strapi-keycloak-passport/save-keycloak-role-mappings', { mappings: state.roleMappings });
      setState(prev => ({ ...prev, success: true }));
      setTimeout(() => setState(prev => ({ ...prev, success: false })), 3000);
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to save mappings. Try again.' }));
      setTimeout(() => setState(prev => ({ ...prev, error: null })), 3000);
    }
  };

  if (state.loading) return <Loader>Loading roles...</Loader>;

  return (
    <Box padding={8} background="transparent" shadow="filterShadow" borderRadius="4px">
      <Typography variant="alpha" as="h1">Passport Role Mapping</Typography>

      <Box paddingTop={4} paddingBottom={4}>
        <Typography textColor="neutral600" variant="epsilon">
          Map Keycloak roles to Strapi admin roles.
        </Typography>
      </Box>

      {state.error && (
        <Box paddingBottom={4}>
          <Alert title="Error" variant="danger" startIcon={<ExclamationMarkCircle />}>{state.error}</Alert>
        </Box>
      )}

      {state.success && (
        <Box paddingBottom={4}>
          <Alert title="Success" variant="success" startIcon={<Check />}>Role mappings link complete!</Alert>
        </Box>
      )}

      <Box background="neutral0">
        <Table>
          <Thead>
            <Tr>
              <Th>Keycloak Role</Th>
              <Th>Strapi Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {state.keycloakRoles.map((kcRole) => (
              <Tr key={kcRole.id}>
                <Td>{kcRole.name}</Td>
                <Td>
                  <Select
                    placeholder="Select Strapi Role"
                    onChange={(roleId) => handleRoleMappingChange(kcRole.name, roleId)}
                    value={state.roleMappings[kcRole.name] || ''} // ✅ Ensure valid value
                  >
                    {state.strapiRoles.map((strapiRole) => (
                      <Option key={strapiRole.id} value={strapiRole.id}>
                        {strapiRole.name}
                      </Option>
                    ))}
                  </Select>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Box padding={4} paddingRight={8}>
          <Flex justifyContent="flex-end">
            <Button onClick={saveMappings} variant="primary">Save Mappings</Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;