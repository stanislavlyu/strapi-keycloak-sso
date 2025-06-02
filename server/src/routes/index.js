import checkAdminPermission from '../middlewares/checkAdminPermission';

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
      policies: [],
      middlewares: [checkAdminPermission('plugin::strapi-keycloak-sso.access')],
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
      middlewares: [checkAdminPermission('plugin::strapi-keycloak-sso.view-role-mappings')],
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
      middlewares: [checkAdminPermission('plugin::strapi-keycloak-sso.manage-role-mappings')],
    },
  },
];

export default routes;
