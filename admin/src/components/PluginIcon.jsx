/**
 * PluginIcon Component
 *
 * @module PluginIcon
 * @description Displays the Keycloak Plugin icon in Strapi Admin UI.
 */

import { Monitor } from '@strapi/icons';

/**
 * Renders the plugin icon for the Strapi admin sidebar.
 *
 * @returns {JSX.Element} React component displaying the plugin icon.
 */
const PluginIcon = () => <Monitor aria-label="Keycloak Plugin Icon" />;

export { PluginIcon };
