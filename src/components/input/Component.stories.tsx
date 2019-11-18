/**
 * Vendor
 */

import React from 'react';

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

