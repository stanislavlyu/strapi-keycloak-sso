'use strict';

const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios');

module.exports = async ({ strapi }) => {
  strapi.log.info('🚀 Strapi Keycloak Passport Plugin Bootstrapped');

  // Get Keycloak Config
  const config = strapi.config.get('plugin.strapi-keycloak-passport');

  // Setup OAuth2 Strategy
  passport.use(
    new OAuth2Strategy(
      {
        authorizationURL: config.KEYCLOAK_AUTH_URL,
        tokenURL: config.KEYCLOAK_TOKEN_URL,
        clientID: config.KEYCLOAK_CLIENT_ID,
        clientSecret: config.KEYCLOAK_CLIENT_SECRET,
        callbackURL: config.KEYCLOAK_REDIRECT_URI,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { data } = await axios.get(config.KEYCLOAK_USERINFO_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          return done(null, data);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  strapi.log.info('🔒 Passport Keycloak Strategy Initialized');

  // ✅ Use Middleware to Intercept `/admin/login` Before Strapi Handles It
  overrideAdminRoutes(strapi);
};

function overrideAdminRoutes(strapi) {
  try {
    strapi.log.info('🛠 Applying Keycloak Authentication Middleware...');

    strapi.server.use(async (ctx, next) => {
      if (ctx.request.path === '/admin/login' && ctx.request.method === 'POST') {
        const authController = require('./controllers/authOverrideController');
        await authController.login(ctx);
      } else {
        await next();
      }
    });

    strapi.server.use(async (ctx, next) => {
      if (ctx.request.path === '/admin/login/callback' && ctx.request.method === 'GET') {
        const authController = require('./controllers/authController');
        await authController.keycloakCallback(ctx);
      } else {
        await next();
      }
    });

    strapi.log.info('✅ Keycloak Authentication Middleware Applied.');
  } catch (error) {
    strapi.log.error('❌ Failed to register Keycloak Middleware:', error);
  }
}
