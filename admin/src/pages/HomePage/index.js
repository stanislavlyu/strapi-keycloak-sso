/*
 *
 * HomePage
 *
 */

import React from 'react';
import { Box, Flex, Typography, Button } from '@strapi/design-system';
import { Link } from '@strapi/design-system/v2';
import { ExternalLink } from '@strapi/icons';
import pluginId from '../../pluginId';

const HomePage = () => {
  return (
    <Box padding={8} background="neutral0" shadow="filterShadow" borderRadius="4px">
      <Flex direction="column" alignItems="center" gap={4}>
        <Typography variant="alpha" as="h1">
          {pluginId}&apos;s Home Page
        </Typography>

        <Typography textColor="neutral600" variant="epsilon">
          Enhance your experience by reviewing the documentation.
        </Typography>

        <Link href="https://docs.strapi.io" isExternal>
          <Button startIcon={<ExternalLink />}>View Documentation</Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default HomePage;