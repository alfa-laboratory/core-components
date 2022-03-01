import { FC } from 'react';

import { Title, TitleProps } from './title';
import { Text, TextProps } from './text';
import { TitleResponsive } from './title-responsive';
import { TitleMobile, TitleMobileProps } from './title-mobile';

export const Typography: {
    Title: FC<TitleProps>;
    Text: FC<TextProps>;
    TitleResponsive: FC<TitleProps>;
    TitleMobile: FC<TitleMobileProps>;
} = {
    Title,
    Text,
    TitleResponsive,
    TitleMobile,
};
