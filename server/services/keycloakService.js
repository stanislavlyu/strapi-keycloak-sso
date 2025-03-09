'use strict';

const axios = require('axios');

/**
 * @module KeycloakService
 * @description Handles Keycloak authentication and provides utility functions.
 */
module.exports = ({ strapi }) => ({
  /**
   * Fetches an admin access token from Keycloak.
   *
   * @async
   * @function fetchAdminToken
   * @returns {Promise<string>} The Keycloak access token.
   * @throws {Error} If authentication fails.
   */
  async fetchAdminToken() {
    const config = strapi.config.get('plugin.strapi-keycloak-passport');

    try {
      const tokenResponse = await axios.post(
        `${config.KEYCLOAK_AUTH_URL}/auth/realms/${config.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: config.KEYCLOAK_CLIENT_ID,
          client_secret: config.KEYCLOAK_CLIENT_SECRET,
          grant_type: 'client_credentials',
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (!tokenResponse.data.access_token) {
        throw new Error('❌ Failed to obtain Keycloak admin token');
      }

      return tokenResponse.data.access_token;
    } catch (error) {
      strapi.log.error('❌ Keycloak Admin Token Fetch Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch Keycloak admin token');
    }
  },
});