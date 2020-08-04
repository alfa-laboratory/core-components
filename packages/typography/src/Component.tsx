import { Heading, HeadingProps } from './heading';
import { HeadingClassic, HeadingClassicProps } from './heading-classic';
import { Text, TextProps } from './text';

export const Typography: {
    Heading: React.FC<HeadingProps>;
    HeadingClassic: React.FC<HeadingClassicProps>;
    Text: React.FC<TextProps>;
} = {
    Heading,
    HeadingClassic,
    Text,
};
