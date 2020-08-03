import { Heading, HeadingProps } from './heading';
import { Paragraph, ParagraphProps } from './paragraph';
import { Text } from './text';

export const Typography: {
    Heading: React.FC<HeadingProps>;
    Paragraph: React.FC<ParagraphProps>;
    Text: React.FC<ParagraphProps>;
} = {
    Heading,
    Paragraph,
    Text,
};
