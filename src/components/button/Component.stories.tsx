/**
 * Vendor
 */

import React from 'react';

/**
 * Components
 */

import {IButton,Button, ViewType, SizeType} from './Component';
import { text } from "@storybook/addon-knobs";


/**
 * Expo
 */

const enhanceText = <T extends string >(name: string, value: T): T => text(name, value) as T;

export default {
  component: Button,
  title: 'Button',
  includeStories: ['basicStory', 'withActionStory']
};

const basicButton = () => (
  <Button
    view={enhanceText<ViewType>('view','extra')}
    size={enhanceText<SizeType>('size','xl')}
  >
    {text('Label', 'Hello World')}
  </Button>
);

const buttonWithAction = (): IButton => (
    <Button
        onClick={() => alert('test')}
        onFocus={(e) => console.log('что происходите', e)}
        onBlur={() => console.log('Фокус ушел')}
    >
      {text('Label', 'Hello World')}
    </Button>
);

export const basicStory: IButton = basicButton as IButton;
export const withActionStory = buttonWithAction;

basicStory.story = {
  parameters: { info: 'Пример простой кнопки(без стилей) в сторибуке для нового дизайна' },
};
