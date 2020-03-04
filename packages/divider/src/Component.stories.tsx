/**
 * Vendor
 */

import React from 'react';

import { withKnobs } from '@storybook/addon-knobs';

/**
 * Components
 */

import { Divider } from './Component';

export default {
  title: 'Common|Divider',
  component: Divider,
  decorators: [withKnobs]
};

export const Basic = () => (
  <div>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    <Divider />
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
  </div>
);
