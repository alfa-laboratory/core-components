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

import { BaseInput } from './Component';

export default {
  title: 'Common',
  component: BaseInput,
  decorators: [withDesign, withKnobs]
};

export const BaseInputStory = () => {
  const [value, setValue] = useState('value');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => setValue(event.target.value);

  return (
    <BaseInput
      type={ select('type', ['text', 'number', 'card', 'email', 'file', 'hidden', 'money', 'password', 'tel', 'text'], 'text') }
      size={ select('size', ['s', 'm', 'l'], 's') }
      disabled={ boolean('Disabled', false) }
      placeholder={ text('placeholder', '') }
      label={ text('label', '') }
      value={ value }
      onChange={ handleChange }
    />
  );
};

BaseInputStory.story = {
  name: 'BaseInput',
  parameters: {
    design: {
      type: 'figma',
      // public link for testing
      url: ''
    }
  }
};
