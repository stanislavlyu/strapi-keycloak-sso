/**
 * Strapi Keycloak Passport Plugin Routes (Strapi v5)
 *
 * @module Routes
 */
const routes = [
  // ✅ Override Admin Login with Keycloak
  {
    method: 'POST',
    path: '/admin/login',
    handler: 'authOverrideController.login',
    config: {
      auth: false, // No auth required for login
    },
  },

  // ✅ Get Keycloak Roles (Admin Permission Required)
  {
    method: 'GET',
    path: '/keycloak-roles',
    handler: 'authController.getRoles',
    config: {
      auth: false,
      // auth: { strategy: 'admin' }, // ✅ Required for accessing admin APIs
      policies: [],
      middlewares: ['plugin::strapi-keycloak-passport.checkAdminPermission'],
    },
  },

  // ✅ Get Role Mappings (Admin Permission Required)
  {
    method: 'GET',
    path: '/get-keycloak-role-mappings',
    handler: 'authController.getRoleMappings',
    config: {
      auth: false, // ✅ Required for admin data access
      policies: [],
      middlewares: ['plugin::strapi-keycloak-passport.checkAdminPermission'],
    },
  },

  // ✅ Save Role Mappings (Requires Manage Permission)
  {
    method: 'POST',
    path: '/save-keycloak-role-mappings',
    handler: 'authController.saveRoleMappings',
    config: {
      auth: false, // ✅ Ensures only admins can perform this action
      policies: [],
      middlewares: ['plugin::strapi-keycloak-passport.checkAdminPermission'],
    },
  },
];

export default routes;