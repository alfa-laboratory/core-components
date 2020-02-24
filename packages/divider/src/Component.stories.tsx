/**
 * Vendor
 */

import React from 'react';

import { withDesign } from 'storybook-addon-designs';
import { withKnobs } from '@storybook/addon-knobs';

/**
 * Components
 */

import { Divider } from './Component';

export default {
  title: 'Common|Divider',
  component: Divider,
  decorators: [withDesign, withKnobs]
};

export const basicDivider = () => (
  <div>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    <Divider />
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
  </div>
);

basicDivider.story = {
  name: 'Basic horizontal'
};

export const accentDivider = () => (
  <div>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    <Divider accent={true} />
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
  </div>
);

accentDivider.story = {
  name: 'Accent'
};

export const verticalDivider = () => {
  const styles = {
    display: 'inline-block',
    width: '100px',
    height: '50px',
    padding: '10px'
  };

  return (
    <div>
      <div style={styles}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div
        style={{
          ...styles,
          width: '10px'
        }}
      >
        <Divider orientation="vertical" />
      </div>
      <div style={styles}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
    </div>
  );
};
