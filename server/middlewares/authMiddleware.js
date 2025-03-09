'use strict';

/**
 * Middleware that redirects unauthenticated users to the Keycloak login page.
 *
 * @module AuthMiddleware
 * @function
 * @param {Object} ctx - Koa context.
 * @param {Object} ctx.state - Current request state.
 * @param {Object} [ctx.state.user] - The authenticated user, if available.
 * @param {Function} next - Next middleware function.
 * @returns {Promise<void>} Resolves when middleware execution is complete.
 */
module.exports = async (ctx, next) => {
  if (!ctx.state.user) {
    /** @type {Object} */
    const { KEYCLOAK_AUTH_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_REDIRECT_URI } =
      strapi.config.get('plugin.strapi-keycloak-passport');

    /** @type {string} */
    const keycloakLoginUrl = `${KEYCLOAK_AUTH_URL}?client_id=${KEYCLOAK_CLIENT_ID}&redirect_uri=${KEYCLOAK_REDIRECT_URI}&response_type=code`;

    return ctx.redirect(keycloakLoginUrl);
  }

  await next();
};