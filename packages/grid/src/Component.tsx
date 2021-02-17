import { FC } from 'react';

import { Row, RowProps } from './row';
import { Col, ColProps } from './col';

export const Grid: {
    Row: FC<RowProps>;
    Col: FC<ColProps>;
} = {
    Row,
    Col,
};
