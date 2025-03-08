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
};