import React, { FC, ReactNode, useContext, useEffect } from "react";
import cn from 'classnames';
import { Typography } from "@alfalab/core-components-typography";
import { CrossMIcon } from "@alfalab/icons-glyph/CrossMIcon";
import { ArrowBackMIcon } from "@alfalab/icons-glyph/ArrowBackMIcon";

import { BottomSheetTitleAlign } from "src/component";

import styles from './index.module.css';
import { BaseModalContext } from "@alfalab/core-components-base-modal";

export type HeaderProps = {
  /**
   * Заголовок
   */
  title?: ReactNode;

  /**
   * Дополнительный класс
   */
  headerClassName?: string;

  /**
   * Дополнительный класс
   */
  addonClassName?: string;

  /**
   * Слот слева
   */
  leftAddons?: ReactNode;

  /**
   * Слот справа
   */
  rightAddons?: ReactNode;

  /**
   * Выравнивание заголовка
   */
  titleAlign?: BottomSheetTitleAlign;

  /**
   * Фиксирует шапку
   */
  sticky?: boolean;

  /**
   * Обработчик закрытия
   */
  onClose: () => void;
}

const DefaultCloser = (
    <span className={cn(styles.iconContainer)}>
        <CrossMIcon />
    </span>
)

const DefaultBacker = (
    <span className={cn(styles.iconContainer)}>
        <ArrowBackMIcon />
    </span>
)

const HEADER_OFFSET = 24;

export const Header: FC<HeaderProps> = ({
    title, 
    headerClassName,
    addonClassName,
    leftAddons = DefaultBacker,
    rightAddons = DefaultCloser,
    titleAlign,
    sticky,
    onClose
}) => {
    const { headerHighlighted, setHasHeader, setHeaderOffset } = useContext(BaseModalContext);

    useEffect(() => {
      setHasHeader(true);
    }, [setHasHeader]);

    useEffect(() => {
        setHeaderOffset(HEADER_OFFSET);
    }, [setHeaderOffset])

    return (
        <div
            className={cn(styles.header, headerClassName, {
                [styles.justifyEnd]: !title,
                [styles.highlighted]: headerHighlighted && sticky,
                [styles.sticky]: sticky
            })}
        >
            {(leftAddons || titleAlign === 'center') && <div className={cn(styles.addon, addonClassName)}>{leftAddons}</div>}

            {title && (
                <Typography.Title
                    view='xsmall'
                    font='system'
                    tag='h1'
                    className={cn(styles.title, {
                        [styles.titleCenter]: titleAlign === 'center',
                        [styles.titleLeft]: titleAlign === 'left',
                        [styles.titleRight]: titleAlign === 'right',
                    })}
                    color='primary'
                >
                    {title}
                </Typography.Title>
            )}

            {(rightAddons || titleAlign === 'center') && <div onClick={onClose} className={cn(styles.addon, addonClassName)}>{rightAddons}</div>}
        </div>
    )
}