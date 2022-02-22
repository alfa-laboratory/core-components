import { ReactElement, ReactText, SVGProps } from 'react';
import { TextProps } from '@alfalab/core-components-typography';
import { AnimationTiming } from 'recharts/types/util/types';
import { AmountProps } from '@alfalab/core-components-amount';

export enum ArrangeData {
    ICON = 'ICON',
    NAME = 'NAME',
    VALUE = 'VALUE',
}

export interface TooltipProps {
    /**
     * Разделитель между именем и значением.
     */
    separator?: string;

    /**
     * Размер смещения между положением всплывающей подсказки и активной позицией.
     */
    offset?: number;

    /**
     * Когда элемент полезной нагрузки имеет значение null или undefined, этот элемент не отображается.
     */
    filterNull?: boolean;

    /**
     * Если установлено false, курсор не будет отображаться, когда всплывающая подсказка активна.
     * Если установлен объект, опция - это конфигурация курсора.
     * Если установлен элемент React, опция является настраиваемым элементом реакции курсора рисования.
     */
    cursor?: boolean | ReactElement | SVGProps<SVGElement>;

    /**
     * Если это поле установлено, положение всплывающей подсказки будет фиксированным и больше не будет перемещаться.
     */
    position?: {
        x: number;
        y: number;
    };

    /**
     * Если установлено false, анимация всплывающей подсказки будет отключена.
     */
    isAnimationActive?: boolean;

    /**
     * Указывает, когда должна начинаться анимация, единица измерения этого параметра - мс.
     */
    animationBegin?: number;

    /**
     * Определяет продолжительность анимации, единица измерения этого параметра - мс.
     */
    animationDuration?: number;

    /**
     * Тип функции плавности.
     */
    animationEasing?: AnimationTiming;

    /**
     * Отображение стрелки тултипа
     */
    arrow: boolean;

    /**
     * Высчитывается автоматичекси, направление стрелки
     */
    tooltipArrowSide?: boolean;

    /**
     * Функция форматирования метки во всплывающей подсказке.
     */
    labelFormatter?: (value: any) => ReactText;

    /**
     * Стиль метки всплывающей подсказки по умолчанию, которая является элементом p.
     */
    labelStyle?: {};

    /**
     * Значение метки, которое сейчас активно, обычно рассчитывается внутри компании.
     */
    label?: string | number;

    /**
     * Контент для тултипа
     */
    content?: any;

    /**
     * Контент для тултипа
     */
    amount?: AmountProps;

    /**
     * Пропсы для Typography.Text в тултипе
     */
    typography?: {
        title: TextProps;
        text: TextProps;
    };

    /**
     * Порядок элементов в тултипе
     */
    arrangeData: ArrangeData[];
}
