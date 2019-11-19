/**
 * Vendor
 */

import React from 'react';

/**
 * Components
 */

import {IButton,Button, ViewType, SizeType} from './Component';
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";


/**
 * Expo
 */

const enhanceText = <T extends string >(name: string, value: T): T => text(name, value) as T;

export default {
  component: Button,
  title: 'Button',
  includeStories: ['basic']
};

const basicButton = () => (
  <Button
    view={enhanceText<ViewType>('view','extra')}
    size={enhanceText<SizeType>('size','xl')}
    onClick={action('onClick')}
  >
    {text('Label', 'Hello World')}
  </Button>
);

export const basic: IButton = basicButton as IButton;

basic.story = {
  parameters: { info: 'Пример простой кнопки(без стилей) в сторибуке для нового дизайна' },
};
