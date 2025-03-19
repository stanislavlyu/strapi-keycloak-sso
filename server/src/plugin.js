'use strict';

/**
 * Keycloak Plugin Registration for Strapi v5
 * @module plugin
 * @param {Object} strapi - Strapi instance
 * @returns {Object} - Plugin definition
 */
module.exports = ({ strapi }) => ({
  /**
   * Register Keycloak Plugin & Permissions
   */
  async register() {
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

    try {
      // 🔄 Strapi v5: Registering Permissions
      await strapi.admin.roles.updatePermissions({
        uid: 'plugin::strapi-keycloak-passport.access',
        actions: actions.map(action => action.uid),
      });

      strapi.log.info('✅ Keycloak Plugin permissions successfully registered.');
    } catch (error) {
      strapi.log.error('❌ Failed to register Keycloak Plugin permissions:', error);
    }
  },

  /**
   * Bootstrap Keycloak Plugin
   */
  async bootstrap() {
    strapi.log.info('🔒 Keycloak Plugin Bootstrap Complete.');
  },
});