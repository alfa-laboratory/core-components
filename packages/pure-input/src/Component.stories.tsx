/**
 * Vendor
 */

import {
  withKnobs, select, text, boolean
} from '@storybook/addon-knobs';
import React, { useState } from 'react';
import { withDesign } from 'storybook-addon-designs';

/**
 * Components
 */

import { PureInput } from './Component';

export default {
  title: 'Common',
  component: PureInput,
  decorators: [withDesign, withKnobs]
};

export const PureInputStory = () => {
  const [value, setValue] = useState('value');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => setValue(event.target.value);

  return (
    <PureInput
      type={ select('type', ['text', 'number', 'card', 'email', 'file', 'hidden', 'money', 'password', 'tel', 'text'], 'text') }
      size={ select('size', ['s', 'm', 'l'], 's') }
      disabled={ boolean('disabled', false) }
      styled={ boolean('styled', true) }
      placeholder={ text('placeholder', '') }
      value={ value }
      onChange={ handleChange }
    />
  );
};

PureInputStory.story = {
  name: 'PureInput',
  parameters: {
    design: {
      type: 'figma',
      // public link for testing
      url: ''
    }
  }
};
