/**
 * Vendor
 */

import React from 'react';

/**
 * Components
 */

import { Button } from './Component';
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";
import {storiesOf} from "@storybook/react";

/**
 * Expo
 */

export default {
  component: Button,
  title: 'Button',
  includeStories: ['basicStory', 'withActionStory']
};

const basicButton = () => (
  <Button>
    {text('Label', 'Hello World')}
  </Button>
);

const buttonWithAction = () => (
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

export const basicStory = basicButton;
export const withActionStory = buttonWithAction;

basicStory.story = {
  parameters: { info: 'asdfsfasf' },
};
