import React, { ReactNode, Children, forwardRef } from 'react';
import classNames from 'classnames';
import Item from './Item';
import styles from './index.module.css';
import { Direction, Align, Size } from './utils';

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
    divider?: string | ReactNode;

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
        divider = false,
        fullWidth = false,
        dataTestId,
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

    const directionClassName = styles[direction];
    const alignClassName = styles[align];

    const containerClassName = classNames(
        styles.spaceContainer,
        directionClassName,
        {
            [alignClassName]: align,
            [styles.spaceContainerFullWidth]: fullWidth,
        },
        className,
    );

    const itemClassName = classNames(styles.spaceItem, {
        [styles.spaceItemFullWidth]: fullWidth,
    });

    const nodes = childNodes.map((child, i) => (
        /* eslint-disable react/no-array-index-key */
        <Item
            className={itemClassName}
            key={`${itemClassName}-${i}`}
            direction={direction}
            horizontalSize={horizontalSize}
            verticalSize={verticalSize}
            length={childNodes.length}
            index={i}
            wrap={wrap}
            divider={divider}
        >
            {child}
        </Item>
        /* eslint-enable */
    ));

    return (
        <div
            data-test-id={dataTestId}
            className={containerClassName}
            style={{
                ...(wrap && { flexWrap: 'wrap', marginBottom: -verticalSize }),
            }}
            ref={ref}
        >
            {nodes}
        </div>
    );
});
