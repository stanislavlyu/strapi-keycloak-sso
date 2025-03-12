'use strict';

/**
 * Middleware to enforce Strapi admin permissions dynamically.
 *
 * @async
 * @function
 * @param {string} requiredPermission - The required permission UID.
 * @returns {Function} Middleware function.
 */
module.exports = (requiredPermission) => async (ctx, next) => {
  try {

    // ✅ Use Admin User Info from `ctx.session.adminUser`
    const adminUser = ctx.session.adminUser;

    // Ensure user is authenticated
    if (!adminUser) {
      return ctx.unauthorized('User is not authenticated.');
    }

    /** @type {number[]} */
    const roleIds = adminUser.roles.map(role => role.id);

    // Fetch permissions assigned to user's roles
    const permissions = await strapi.db.query('admin::permission').findMany({
      where: { action: requiredPermission, role: { id: { $in: roleIds } } },
    });

    if (permissions.length === 0) {
      return ctx.forbidden(`Access denied. Missing permission: ${requiredPermission}`);
    }

    // Proceed if permission is valid
    await next();
  } catch (error) {
    strapi.log.error('🔴 Error checking admin permission:', error);
    return ctx.internalServerError('Failed to verify permissions.');
  }
};