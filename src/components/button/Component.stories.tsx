/**
 * Vendor
 */

import React from 'react';

import { action } from '@storybook/addon-actions';

/**
 * Components
 */

import { Button } from './Component';
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";

/**
 * Expo
 */

export default {
  component: Button,
  title: 'Button',
};

export const basic = () => (
  <Button
      view={text('View','extra')}
      size={text('Size','xl')}
      onClick={() => alert('test')}
      onFocus={(e) => console.log('что происходите', e)}
      onBlur={(e) => console.log('Фокус ушел')}
  >
    {text('Label', 'Hello World')}
  </Button>
);

