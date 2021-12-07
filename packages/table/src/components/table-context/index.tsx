import React from 'react';
import { TextAlignProperty } from '../../typings';

export type ColumnConfiguration = {
    width?: string | number;
    textAlign?: TextAlignProperty;
    hidden?: boolean;
    index: number;
};

export type TableContextType = {
    columnsConfiguration: ColumnConfiguration[];
    compactView: boolean;
};

export const DEFAULT_TABLE_CONTEXT: TableContextType = {
    columnsConfiguration: [],
    compactView: false,
};

export const TableContext = React.createContext<TableContextType>(DEFAULT_TABLE_CONTEXT);
