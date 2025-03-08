'use strict';

module.exports = {
  async keycloakCallback(ctx) {
    try {
      const { code } = ctx.query;
      if (!code) return ctx.badRequest('Missing authorization code');

      const passport = require('passport');

      passport.authenticate('oauth2', async (err, user) => {
        if (err || !user) {
          return ctx.unauthorized('Authentication failed');
        }

        // Map Keycloak user to Strapi admin
        const adminUser = await strapi.plugin('strapi-keycloak-passport')
          .service('adminUserService')
          .findOrCreate(user);

        // Generate Strapi JWT
        const jwt = await strapi.admin.services.token.createJwtToken(adminUser);

        return ctx.send({ jwt });
      })(ctx);
    } catch (error) {
      strapi.log.error('Keycloak Login Failed:', error);
      return ctx.unauthorized('Authentication failed');
    }
  },
  async getRoles(ctx) {
    try {
      const axios = require('axios')
      const config = strapi.config.get('plugin.strapi-keycloak-passport');

      // 1️⃣ Get Admin Token
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
      if (!accessToken) throw new Error('Failed to get Keycloak admin token');

      // 2️⃣ Fetch Keycloak Roles using Admin Token
      const rolesResponse = await axios.get(
        `${config.KEYCLOAK_AUTH_URL}/auth/admin/realms/DeveloperConsole/roles`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const keycloakRoles = rolesResponse.data;
      const strapiRoles = await strapi.query('admin::role').findMany();

      return ctx.send({ keycloakRoles, strapiRoles });
    } catch (error) {
      strapi.log.error('Failed to fetch Keycloak roles:', error.response?.data || error.message);
      return ctx.badRequest('Failed to fetch Keycloak roles');
    }
  },

  async getRoleMappings(ctx) {
    try {
      const mappings = await strapi
        .plugin('strapi-keycloak-passport')
        .service('roleMappingService')
        .getMappings();

      // Convert array of mappings into an object
      const formattedMappings = mappings.reduce((acc, mapping) => {
        acc[mapping.keycloakRole] = mapping.strapiRole;
        return acc;
      }, {});

      return ctx.send(formattedMappings);
    } catch (error) {
      strapi.log.error('Failed to retrieve role mappings:', error);
      return ctx.badRequest('Failed to retrieve role mappings');
    }
  },
  async saveRoleMappings(ctx) {
    try {
      const { mappings } = ctx.request.body;
      await strapi.plugin('strapi-keycloak-passport').service('roleMappingService').saveMappings(mappings);
      return ctx.send({ message: 'Mappings saved' });
    } catch (error) {
      strapi.log.error('Failed to save mappings:', error);
      return ctx.badRequest('Failed to save mappings');
    }
  },
};