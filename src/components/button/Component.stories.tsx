/**
 * Vendor
 */

import React from 'react';

import { action } from '@storybook/addon-actions';

/**
 * Components
 */

import { Button } from './Component';

/**
 * Expo
 */

export default {
  component: Button,
  title: 'Button',
};

export const basic = () => (
  <Button onClick={() => alert('test')}>Hello Button</Button>
);

