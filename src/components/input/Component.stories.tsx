/**
 * Vendor
 */

import React from 'react';

import { action } from '@storybook/addon-actions';

/**
 * Components
 */

import { Input } from './Component';

/**
 * Expo
 */

export default {
  component: Input,
  title: 'Input',
};

export const basic = () => (
  <Input onClick={() => alert('test')} />
);

