import React, { ReactNode, Children, forwardRef } from 'react';
import classNames from 'classnames';
import Item from './Item';
import styles from './index.module.css';
import { Direction, Align, Size, SpaceContext } from './utils';

export type SpaceProps = {
    /**
     * Выравнивание
     */
    align?: Align;

    /**
     * Направление
     */
    direction?: Direction;

    /**
     * Размер отступов
     */
    size?: Size | [Size, Size];

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дочерние компоненты
     */
    children: ReactNode;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Автоматический перенос строк, полезно при direction = 'horizontal'
     */
    wrap?: boolean;

    /**
     * Компонент разделителя
     */
    split?: boolean;

    /**
     * Растягивать ли компонент на всю ширину
     */
    fullWidth?: boolean;
};

const SpaceSizes: { [key in Size]: number } = {
    s: 12,
    m: 16,
    l: 20,
};

const getNumberSize = (size: Size) => {
    return typeof size === 'string' ? SpaceSizes[size] : size || 0;
};

/**
 * Позаимствовано с благодарностью из Ant Design
 */

export const Space = forwardRef<HTMLDivElement, SpaceProps>((props, ref) => {
    const {
        children,
        className,
        align = 'start',
        direction = 'vertical',
        size = 'm',
        wrap = false,
        split = false,
        fullWidth = false,
    } = props;

    const [horizontalSize, verticalSize] = React.useMemo(
        () =>
            ((Array.isArray(size) ? size : [size, size]) as [Size, Size]).map(item =>
                getNumberSize(item),
            ),
        [size],
    );

    const childNodes = Children.toArray(children);

    if (childNodes.length === 0) {
        return null;
    }

    const directionCls = styles[direction];

    const alignCls = styles[`align_${align}`];

    const containerCls = classNames(
        styles.spaceContainer,
        directionCls,
        {
            [alignCls]: align,
            [styles.spaceContainerFullWidth]: fullWidth,
        },
        className,
    );

    const itemCls = classNames(styles.spaceItem, {
        [styles.spaceItemFullWidth]: fullWidth,
    });

    const nodes = childNodes.map((child, i) => (
        /* eslint-disable react/no-array-index-key */
        <Item
            className={itemCls}
            key={`${itemCls}-${i}`}
            direction={direction}
            index={i}
            wrap={wrap}
            split={split}
        >
            {child}
        </Item>
        /* eslint-enable */
    ));

    const componentCls = classNames({
        [styles.spaceFullWidth]: fullWidth,
    });

    return (
        <div className={componentCls}>
            <div
                className={containerCls}
                style={{
                    ...(wrap && { flexWrap: 'wrap', marginBottom: -verticalSize }),
                }}
                ref={ref}
            >
                <SpaceContext.Provider
                    value={{ horizontalSize, verticalSize, length: childNodes.length }}
                >
                    {nodes}
                </SpaceContext.Provider>
            </div>
        </div>
    );
});
