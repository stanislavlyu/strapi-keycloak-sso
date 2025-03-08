'use strict';

const axios = require('axios');

/**
 * @module RoleService
 * @description Service for managing Keycloak-admin user creation and role assignments in Strapi.
 */
module.exports = ({ strapi }) => ({
  /**
   * Finds an existing admin user by email or creates a new one.
   * Assigns the correct Strapi role based on Keycloak role mappings.
   *
   * @async
   * @function findOrCreate
   * @param {Object} userInfo - The user information from Keycloak.
   * @param {string} userInfo.email - The user's email address.
   * @param {string} [userInfo.preferred_username] - The preferred username from Keycloak.
   * @param {string} [userInfo.given_name] - The user's first name from Keycloak.
   * @param {string} [userInfo.family_name] - The user's last name from Keycloak.
   * @param {string} userInfo.sub - The unique Keycloak user ID.
   * @returns {Promise<Object>} The created or found Strapi admin user.
   */
  async findOrCreate(userInfo) {
    /** @type {string} */
    const email = userInfo.email;
    /** @type {string} */
    const username = userInfo.preferred_username || '';
    /** @type {string} */
    const firstname = userInfo.given_name || '';
    /** @type {string} */
    const lastname = userInfo.family_name || '';
    /** @type {string} */
    const keycloakUserId = userInfo.sub;

    /** @type {Object|null} */
    let adminUser = await strapi.query('admin::user').findOne({ where: { email } });

    /** @type {Object<string, number>} */
    const roleMappings = await strapi
      .plugin('strapi-keycloak-passport')
      .service('roleMappingService')
      .getMappings();

    /** @type {number} */
    const DEFAULT_ROLE = 5;

    /** @type {number} */
    let APPLIED_ROLES = []; // Default Strapi role if no mapping is found

    try {
      // 🔥 Fetch user roles from Keycloak
      const config = strapi.config.get('plugin.strapi-keycloak-passport');
      const tokenResponse = await axios.post(
        `${config.KEYCLOAK_AUTH_URL}/auth/realms/DeveloperConsole/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: config.KEYCLOAK_CLIENT_ID,
          client_secret: config.KEYCLOAK_CLIENT_SECRET,
          grant_type: 'client_credentials',
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) throw new Error('Failed to obtain Keycloak admin token');


      const rolesResponse = await axios.get(
        `${config.KEYCLOAK_AUTH_URL}/auth/admin/realms/DeveloperConsole/users/${keycloakUserId}/role-mappings/realm`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      /** @type {string[]} */
      const keycloakRoles = rolesResponse.data.map(role => role.name);

      keycloakRoles.map(role => {
        roleMappings.find(mapRole => {
          if (mapRole.keycloakRole === role) {
            APPLIED_ROLES.push(mapRole.strapiRole)
          }
        })
      })

    } catch (error) {
      strapi.log.error('Failed to fetch user roles from Keycloak:', error);
    }

    const USER_ROLES = APPLIED_ROLES.length ? APPLIED_ROLES : [DEFAULT_ROLE]

    if (!adminUser) {
      adminUser = await strapi.query('admin::user').create({
        data: {
          email,
          firstname,
          lastname,
          username,
          isActive: true,
          roles: USER_ROLES,
        },
      });
    } else {
      await strapi.query('admin::user').update({
        where: { id: adminUser.id },
        data: {
          firstname,
          lastname,
          roles: USER_ROLES
        },
      });
    }

    return adminUser;
  },
});