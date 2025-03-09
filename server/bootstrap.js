'use strict';

module.exports = async ({ strapi }) => {
  strapi.log.info('🚀 Strapi Keycloak Passport Plugin Bootstrapped');

  // ✅ Use Middleware to Intercept `/admin/login` Before Strapi Handles It
  overrideAdminRoutes(strapi);

  strapi.log.info('🔒 Passport Keycloak Strategy Initialized');
};

function overrideAdminRoutes(strapi) {
  try {
    strapi.log.info('🛠 Applying Keycloak Authentication Middleware...');

    strapi.server.use(async (ctx, next) => {
      if (ctx.request.path === '/admin/login' && ctx.request.method === 'POST') {
        const authController = require('./controllers/authOverrideController');
        await authController.login(ctx);
      } else if ((ctx.request.path === '/admin/auth/reset-password' || ctx.request.path === '/admin/auth/register-admin') && ctx.request.method === 'GET') {
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
