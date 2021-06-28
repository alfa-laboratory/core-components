import * as React from 'react';
import { Direction } from './utils';

export interface ItemProps {
    className: string;
    horizontalSize: number;
    verticalSize: number;
    length: number;
    children: React.ReactNode;
    index: number;
    direction?: Direction;
    divider?: string | React.ReactNode;
    wrap?: boolean;
}

const Item = (props: ItemProps) => {
    const {
        className,
        horizontalSize,
        verticalSize,
        length,
        direction,
        index,
        children,
        divider,
        wrap,
    } = props;

    let style: React.CSSProperties = {};

    if (direction === 'vertical') {
        if (index < length - 1) {
            style = { marginBottom: horizontalSize / (divider ? 2 : 1) };
        }
    } else {
        style = {
            ...(index < length - 1 && { marginRight: horizontalSize / (divider ? 2 : 1) }),
            ...(wrap && { paddingBottom: verticalSize }),
        };
    }

    if (children === null || children === undefined) {
        return null;
    }

    return (
        <React.Fragment>
            <div className={className} style={style}>
                {children}
            </div>
            {index < length - 1 && divider && (
                <span
                    style={{
                        width: '100%',
                        ...style,
                    }}
                >
                    {divider}
                </span>
            )}
        </React.Fragment>
    );
};

export default Item;
