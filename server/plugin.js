module.exports = ({ strapi }) => ({
  register() {
    strapi.log.info('🔍 Registering Keycloak Plugin Permissions...');

    const actions = [
      {
        section: 'plugins',
        displayName: 'Access Keycloak Plugin',
        uid: 'access',
        pluginName: 'strapi-keycloak-passport',
      },
      {
        section: 'plugins',
        displayName: 'View Role Mappings',
        uid: 'view-role-mappings',
        pluginName: 'strapi-keycloak-passport',
      },
      {
        section: 'plugins',
        displayName: 'Manage Role Mappings',
        uid: 'manage-role-mappings',
        pluginName: 'strapi-keycloak-passport',
      },
    ];

    strapi.admin.services.permission.actionProvider.registerMany(actions);
    strapi.log.info('✅ Keycloak Plugin permissions successfully registered.');
  },

  bootstrap() {
    strapi.log.info('🔒 Keycloak Plugin Bootstrap Complete.');
  },
});