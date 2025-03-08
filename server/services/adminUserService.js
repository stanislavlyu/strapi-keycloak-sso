'use strict';

module.exports = ({ strapi }) => ({
  async findOrCreate(userInfo) {
    const { email, preferred_username, given_name, family_name } = userInfo;

    let adminUser = await strapi.query('admin::user').findOne({ where: { email } });

    if (!adminUser) {
      adminUser = await strapi.query('admin::user').create({
        data: {
          email,
          firstname: given_name || '',
          lastname: family_name || '',
          username: preferred_username,
          isActive: true,
          // TODO Apply role mapping here
          roles: [5], // Assign default admin role (modify as needed)
        },
      });
    }

    return adminUser;
  },
});