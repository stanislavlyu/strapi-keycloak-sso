'use strict';

/**
 * Auth middleware that redirects to Keycloak login page if user is not authenticated.
 *
 * @function
 * @param {Object} ctx - Koa context
 * @param {Function} next - Next middleware
 * @returns {Promise<void>} - Resolves when middleware finishes execution
 */
module.exports = async (ctx, next) => {
  if (!ctx.state.user) {
    const { KEYCLOAK_AUTH_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_REDIRECT_URI } =
      strapi.config.get('plugin.strapi-keycloak-passport');

    const keycloakLoginUrl = `${KEYCLOAK_AUTH_URL}?client_id=${KEYCLOAK_CLIENT_ID}&redirect_uri=${KEYCLOAK_REDIRECT_URI}&response_type=code`;

    return ctx.redirect(keycloakLoginUrl);
  }

  await next();
};