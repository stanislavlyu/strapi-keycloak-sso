const checkAdminPermission = require('../middlewares/checkAdminPermission');

module.exports = [
  {
    method: 'POST',
    path: '/admin/login',
    handler: 'authOverrideController.login',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/keycloak-roles',
    handler: 'authController.getRoles',
    config: {
      auth: false,
      policies: [],
      middleware: [checkAdminPermission('plugin::strapi-keycloak-passport.access')],
    },
  },
  {
    method: 'GET',
    path: '/get-keycloak-role-mappings',
    handler: 'authController.getRoleMappings',
    config: {
      auth: false,
      policies: [],
      middlewares: [checkAdminPermission('plugin::strapi-keycloak-passport.view-role-mappings')],
    },
  },
  {
    method: 'POST',
    path: '/save-keycloak-role-mappings',
    handler: 'authController.saveRoleMappings',
    config: {
      auth: false, // ✅ Ensure Strapi doesn't block it first
      policies: [],
      middlewares: [checkAdminPermission('plugin::strapi-keycloak-passport.manage-role-mappings')],
    },
  },
];