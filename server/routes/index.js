module.exports = [
  {
    method: 'GET',
    path: '/admin/login/callback',
    handler: 'authController.keycloakCallback',
    config: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/admin/login',
    handler: 'authOverrideController.login',
    config: {
      auth: false,
    },
  },
];