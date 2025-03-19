/**
 * @module AuthMiddleware
 * @description Middleware to enforce authentication for protected routes.
 * @param {Object} ctx - Koa context.
 * @param {Object} ctx.state - Current request state.
 * @param {Object} [ctx.state.user] - The authenticated user, if available.
 * @param {Function} next - Next middleware function.
 * @returns {Promise<void>} Resolves when middleware execution is complete.
 */
const authMiddleware = async (ctx, next) => {
  /** @type {Object} */
  const { KEYCLOAK_AUTH_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_REDIRECT_URI } =
    strapi.config.get('plugin::strapi-keycloak-passport');

  /** @type {string} */
  const keycloakLoginUrl = `${KEYCLOAK_AUTH_URL}?client_id=${KEYCLOAK_CLIENT_ID}&redirect_uri=${KEYCLOAK_REDIRECT_URI}&response_type=code`;

  // ✅ Ensure user is authenticated
  if (!ctx.state.user) {
    strapi.log.warn('🔐 Unauthorized access attempt, redirecting to Keycloak.');
    return ctx.unauthorized('Authentication required. Redirecting to Keycloak.', {
      redirect: keycloakLoginUrl,
    });
  }

  await next();
};

export default authMiddleware;