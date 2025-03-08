// /*
//  *
//  * HomePage
//  *
//  */
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Flex,
//   Typography,
//   Button,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Select,
//   Option,
//   Loader,
//   Alert,
// } from '@strapi/design-system';
// import { Check, ExclamationMarkCircle } from '@strapi/icons';
// import pluginId from '../../pluginId';

// const HomePage = () => {
//   const [keycloakRoles, setKeycloakRoles] = useState([]);
//   const [strapiRoles, setStrapiRoles] = useState([]);
//   const [roleMappings, setRoleMappings] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     async function fetchRoles() {
//       try {
//         const response = await axios.get('/strapi-keycloak-passport/keycloak-roles');
//         setKeycloakRoles(response.data.keycloakRoles);
//         setStrapiRoles(response.data.strapiRoles);
//       } catch (err) {
//         setError('Failed to fetch roles. Please check Keycloak settings.');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchRoles();
//   }, []);

//   const handleRoleMappingChange = (keycloakRole, strapiRole) => {
//     setRoleMappings((prev) => ({
//       ...prev,
//       [keycloakRole]: strapiRole,
//     }));
//   };

//   const saveMappings = async () => {
//     try {
//       await axios.post('/strapi-keycloak-passport/save-keycloak-role-mappings', { mappings: roleMappings });
//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 3000);
//     } catch (error) {
//       setError('Failed to save mappings. Try again.');
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   if (loading) return <Loader>Loading roles...</Loader>;

//   return (
//     <Box padding={8} background="transparent" shadow="filterShadow" borderRadius="4px">
//       <Typography variant="alpha" as="h1">Keycloak Role Mapping</Typography>
//       <Typography textColor="neutral600" variant="epsilon" style={{ marginBottom: '1rem', paddingVertical: '1rem' }}>
//         Map Keycloak roles to Strapi admin roles.
//       </Typography>

//       {error && (
//         <Alert title="Error" variant="danger" startIcon={<ExclamationMarkCircle />}>{error}</Alert>
//       )}

//       {success && (
//         <Alert title="Success" variant="success" startIcon={<Check />}>Role mappings saved successfully!</Alert>
//       )}

//       <Box background="neutral0">
//         <Table>
//           <Thead>
//             <Tr>
//               <Th>Keycloak Role</Th>
//               <Th>Strapi Role</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {keycloakRoles.map((kcRole) => (
//               <Tr key={kcRole.id}>
//                 <Td>{kcRole.name}</Td>
//                 <Td>
//                   <Select
//                     placeholder="Select Strapi Role"
//                     onChange={(roleId) => handleRoleMappingChange(kcRole.name, roleId)}
//                     value={roleMappings[kcRole.name]}
//                   >
//                     {strapiRoles.map((strapiRole) => (
//                       <Option key={strapiRole.id} value={strapiRole.id}>
//                         {strapiRole.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>

//         <Flex justifyContent="flex-end" marginTop={4}>
//           <Button onClick={saveMappings} variant="primary">Save Mappings</Button>
//         </Flex>
//       </Box>
//     </Box>
//   );
// };

// export default HomePage;

/*
 *
 * HomePage
 *
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
import pluginId from '../../pluginId';

const HomePage = () => {
  const [keycloakRoles, setKeycloakRoles] = useState([]);
  const [strapiRoles, setStrapiRoles] = useState([]);
  const [roleMappings, setRoleMappings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const rolesResponse = await axios.get('/strapi-keycloak-passport/keycloak-roles');
        const mappingsResponse = await axios.get('/strapi-keycloak-passport/get-keycloak-role-mappings');

        setKeycloakRoles(rolesResponse.data.keycloakRoles);
        setStrapiRoles(rolesResponse.data.strapiRoles);

        // ✅ Directly set roleMappings, since API returns an object
        setRoleMappings(mappingsResponse.data);
      } catch (err) {
        setError('Failed to fetch roles. Please check Keycloak settings.');
      } finally {
        setLoading(false);
      }
    }
    fetchRoles();
  }, []);

  const handleRoleMappingChange = (keycloakRole, strapiRole) => {
    setRoleMappings((prev) => ({
      ...prev,
      [keycloakRole]: strapiRole,
    }));
  };

  const saveMappings = async () => {
    try {
      await axios.post('/strapi-keycloak-passport/save-keycloak-role-mappings', { mappings: roleMappings });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Failed to save mappings. Try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) return <Loader>Loading roles...</Loader>;

  return (
    <Box padding={8} background="transparent" shadow="filterShadow" borderRadius="4px">
      <Typography variant="alpha" as="h1">Keycloak Role Mapping</Typography>

      <Box paddingTop={4} paddingBottom={4}>
        <Typography textColor="neutral600" variant="epsilon">
          Map Keycloak roles to Strapi admin roles.
        </Typography>
      </Box>


      {error && (
        <Alert title="Error" variant="danger" startIcon={<ExclamationMarkCircle />}>{error}</Alert>
      )}

      {success && (
        <Alert title="Success" variant="success" startIcon={<Check />}>Role mappings saved successfully!</Alert>
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
            {keycloakRoles.map((kcRole) => (
              <Tr key={kcRole.id}>
                <Td>{kcRole.name}</Td>
                <Td>
                  <Select
                    placeholder="Select Strapi Role"
                    onChange={(roleId) => handleRoleMappingChange(kcRole.name, roleId)}
                    value={roleMappings[kcRole.name] || ''} // ✅ Ensure valid value
                  >
                    {strapiRoles.map((strapiRole) => (
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