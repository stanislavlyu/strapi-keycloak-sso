/*************  ✨ Codeium Command 🌟  *************/
/**
 * Controller for handling Keycloak authentication.
 *
 * @namespace strapi.plugins['strapi-keycloak-passport'].controllers
 */
const axios = require('axios');

/**
 * Handles Keycloak login.
 *
 * @function login
 * @param {Object} ctx - Koa context
 * @param {Object} ctx.request - Request data
 * @param {string} ctx.request.body.email - Email address
 * @param {string} ctx.request.body.password - Password
 * @returns {Promise<Object>} - Response data
 */
module.exports = {
  async login(ctx) {
    try {
      const { email, password } = ctx.request.body;
      if (!email || !password) return ctx.badRequest('Missing email or password');

      const config = strapi.config.get('plugin.strapi-keycloak-passport');

      strapi.log.info(`Connexion of ${email} to passport channel`);

      // Forward login credentials to Keycloak
      const tokenResponse = await axios.post(config.KEYCLOAK_TOKEN_URL, new URLSearchParams({
        client_id: config.KEYCLOAK_CLIENT_ID,
        client_secret: config.KEYCLOAK_CLIENT_SECRET,
        username: email,
        password,
        grant_type: 'password',
      }).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      strapi.log.info(`${email} login to channel successful`);

      const { access_token } = tokenResponse.data;

      // Retrieve user details from Keycloak
      const userInfoResponse = await axios.get(config.KEYCLOAK_USERINFO_URL, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const userInfo = userInfoResponse.data;

      // Find or create Strapi admin user
      const adminUser = await strapi.plugin('strapi-keycloak-passport')
        .service('adminUserService')
        .findOrCreate(userInfo);

      // Generate Strapi JWT
      const jwt = await strapi.admin.services.token.createJwtToken(adminUser);

      return ctx.send({
        data: {
          token: jwt,
          user: {
            id: adminUser.id,
            firstname: adminUser.firstname,
            lastname: adminUser.lastname,
            username: adminUser.username || null,
            email: adminUser.email,
            connectedToken: null,
            attemptResetToken: "0",
            isActive: adminUser.isActive,
            blocked: adminUser.blocked || false,
            preferedLanguage: null,
            createdAt: adminUser.createdAt,
            updatedAt: adminUser.updatedAt,
          },
        },
      });
    } catch (error) {
      strapi.log.error(error);
      strapi.log.error(`🔴 Login via passport Failed: ${error.response?.data || error.message}`);
      return ctx.badRequest('Invalid credentials', {
        error: {
          status: error?.status ?? 400,
          name: error?.name ?? 'ApplicationError',
          message: error?.message ?? 'Invalid credentials',
          details: error?.details ?? {},
        },
      });
    }
  },
};

// const axios = require('axios');

// module.exports = {
//   async login(ctx) {
//     try {
//       const { email, password } = ctx.request.body;
//       if (!email || !password) {
//         return ctx.badRequest('Invalid credentials', {
//           error: {
//             status: 400,
//             name: 'ApplicationError',
//             message: 'Invalid credentials',
//             details: {},
//           },
//         });
//       }

//       const config = strapi.config.get('plugin.strapi-keycloak-passport');
//       const tokenUrl = config.KEYCLOAK_TOKEN_URL;
//       const userInfoUrl = config.KEYCLOAK_USERINFO_URL;

//       // Forward login credentials to Keycloak
//       const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
//         client_id: config.KEYCLOAK_CLIENT_ID,
//         client_secret: config.KEYCLOAK_CLIENT_SECRET,
//         username: email,
//         password,
//         grant_type: 'password',
//       }).toString(), {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       });

//       const { access_token } = tokenResponse.data;

//       // Retrieve user details from Keycloak
//       const userInfoResponse = await axios.get(userInfoUrl, {
//         headers: { Authorization: `Bearer ${access_token}` },
//       });

//       const userInfo = userInfoResponse.data;

//       // Find or create Strapi admin user
//       const adminUser = await strapi.plugin('strapi-keycloak-passport')
//         .service('adminUserService')
//         .findOrCreate(userInfo);

//       // Generate Strapi JWT
//       const jwt = await strapi.admin.services.token.createJwtToken(adminUser);

//       return ctx.send({
//         data: {
//           token: jwt,
//           user: {
//             id: adminUser.id,
//             firstname: adminUser.firstname,
//             lastname: adminUser.lastname,
//             username: adminUser.username || null,
//             email: adminUser.email,
//             connectedToken: jwt,
//             attemptResetToken: "0",
//             isActive: adminUser.isActive,
//             blocked: adminUser.blocked || false,
//             preferedLanguage: null,
//             createdAt: adminUser.createdAt,
//             updatedAt: adminUser.updatedAt,
//           },
//         },
//       });
//     } catch (error) {
//       strapi.log.error('🔴 Keycloak Login Failed:', error.response?.data || error.message);
//       return ctx.badRequest('Invalid credentials', {
//         error: {
//           status: 400,
//           name: 'ApplicationError',
//           message: 'Invalid credentials',
//           details: {},
//         },
//       });
//     }
//   },
// };
