import { FC } from 'react';

import { Title, TitleProps } from './title';
import { Text, TextProps } from './text';
import { TitleResponsive } from './title-responsive';

export const Typography: {
    Title: FC<TitleProps>;
    Text: FC<TextProps>;
    TitleResponsive: FC<TitleProps>;
} = {
    Title,
    Text,
    TitleResponsive,
};
