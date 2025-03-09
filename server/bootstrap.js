'use strict';

/**
 * @module StrapiKeycloakBootstrap
 * @description Bootstraps the Strapi Keycloak Passport Plugin and overrides admin authentication routes.
 * @async
 * @function
 * @param {Object} strapi - The Strapi instance.
 */
module.exports = async ({ strapi }) => {
  strapi.log.info('🚀 Strapi Keycloak Passport Plugin Bootstrapped');

  // ✅ Apply Middleware to Intercept `/admin/login` Before Strapi Handles It
  overrideAdminRoutes(strapi);

  strapi.log.info('🔒 Passport Keycloak Strategy Initialized');
};

/**
 * Overrides admin authentication routes to use Keycloak.
 *
 * @function overrideAdminRoutes
 * @param {Object} strapi - The Strapi instance.
 */
function overrideAdminRoutes(strapi) {
  try {
    strapi.log.info('🛠 Applying Keycloak Authentication Middleware...');

    strapi.server.use(async (ctx, next) => {
      /** @type {string} */
      const requestPath = ctx.request.path;
      /** @type {string} */
      const requestMethod = ctx.request.method;

      if (requestPath === '/admin/login' && requestMethod === 'POST') {
        const authController = require('./controllers/authOverrideController');
        await authController.login(ctx);
      } else if (
        (requestPath === '/admin/auth/reset-password' || requestPath.includes('/admin/auth/register')) &&
        requestMethod === 'GET'
      ) {
        return ctx.redirect('/admin/login');
      } else {
        await next();
      }
    });

    strapi.log.info(`
    ╔════════════════════════════════╗
    ║      🛡️ PASSPORT APPLIED 🛡️      ║
    ╚════════════════════════════════╝
    `);
    strapi.log.info('🚴 Admin login request rerouted to passport.');
    strapi.log.info('📒 Registration route blocked. ⛑️');
    strapi.log.info('🕵️‍♂️ Reset password route blocked. ⛑️');
  } catch (error) {
    strapi.log.error('❌ Failed to register Keycloak Middleware:', error);
  }
}
