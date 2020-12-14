import * as React from 'react';
import { Direction, SpaceContext } from './utils';

export interface ItemProps {
    className: string;
    children: React.ReactNode;
    index: number;
    direction?: Direction;
    split?: string | React.ReactNode;
    wrap?: boolean;
}

const Item = (props: ItemProps) => {
    const { className, direction, index, children, split, wrap } = props;
    const { horizontalSize, verticalSize, length } = React.useContext(SpaceContext);

    let style: React.CSSProperties = {};

    if (direction === 'vertical') {
        if (index < length) {
            style = { marginBottom: horizontalSize / (split ? 2 : 1) };
        }
    } else {
        style = {
            ...(index < length && { marginRight: horizontalSize / (split ? 2 : 1) }),
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
            {index < length - 1 && split && (
                <span
                    style={{
                        width: '100%',
                        ...style,
                    }}
                >
                    {split}
                </span>
            )}
        </React.Fragment>
    );
};

export default Item;
