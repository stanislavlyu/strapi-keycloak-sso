/**
 * Service for managing role mappings between Keycloak and Strapi.
 *
 * @typedef {Object} RoleMapping
 * @property {string} keycloakRole - The Keycloak role name.
 * @property {number} strapiRole - The ID of the corresponding Strapi role.
 *
 * @namespace
 */
module.exports = ({ strapi }) => ({
  /**
   * Saves the given role mappings to the database.
   *
   * @param {Object<string, number>} mappings - The role mappings.
   * @returns {Promise<void>}
   */
  async saveMappings(mappings) {
    await strapi.db.query('plugin::strapi-keycloak-passport.role-mapping').deleteMany();
    for (const [keycloakRole, strapiRole] of Object.entries(mappings)) {
      await strapi.db.query('plugin::strapi-keycloak-passport.role-mapping').create({
        data: { keycloakRole, strapiRole },
      });
    }
  },

  /**
   * Retrieves all role mappings from the database.
   *
   * @returns {Promise<RoleMapping[]>}
   */
  async getMappings() {
    const roleMappings = await strapi.entityService.findMany('plugin::strapi-keycloak-passport.role-mapping', {});
    return roleMappings;
  },
});
