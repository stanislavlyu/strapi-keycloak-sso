/**
 * Service for managing role mappings between Keycloak and Strapi.
 *
 * @typedef {Object} RoleMapping
 * @property {string} keycloakRole - The Keycloak role name.
 * @property {number} strapiRole - The ID of the corresponding Strapi role.
 *
 * @namespace RoleMappingService
 * @param {Object} strapi - Strapi instance
 * @returns {Object} - Role mapping service methods
 */
const roleMappingService = ({ strapi }) => ({
  /**
   * Saves the given role mappings to the database.
   *
   * @async
   * @function saveMappings
   * @param {Object<string, number>} mappings - The role mappings.
   * @returns {Promise<void>} - Resolves when role mappings are saved.
   */
  async saveMappings(mappings) {
    try {
      // ✅ Delete all existing mappings (Strapi v5 requires explicit filters)
      await strapi.db.query('plugin::strapi-keycloak-sso.role-mapping').deleteMany({
        where: {
          id: {
            $notNull: true,
          },
        },
      });

      // ✅ Bulk insert new role mappings
      for (const [keycloakRole, strapiRole] of Object.entries(mappings)) {
        await strapi.entityService.create('plugin::strapi-keycloak-sso.role-mapping', {
          data: { keycloakRole, strapiRole },
        });
      }

      strapi.log.info('✅ Role mappings saved successfully.');
    } catch (error) {
      strapi.log.error('❌ Failed to save role mappings:', error);
      throw new Error('Failed to save role mappings.');
    }
  },

  /**
   * Retrieves all role mappings from the database.
   *
   * @async
   * @function getMappings
   * @returns {Promise<RoleMapping[]>} - List of role mappings.
   */
  async getMappings() {
    try {
      const roleMappings = await strapi.entityService.findMany('plugin::strapi-keycloak-sso.role-mapping', {});
      return roleMappings;
    } catch (error) {
      strapi.log.error('❌ Failed to retrieve role mappings:', error);
      throw new Error('Failed to retrieve role mappings.');
    }
  },
});

export default roleMappingService;
