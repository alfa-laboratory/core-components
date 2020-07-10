declare module 'text-mask-core' {
    export type Mask = Array<string | RegExp>;

    export type TextMaskConfig = {
        currentCaretPosition: number;
        rawValue: string;
        previousConformedValue: string;
        mask?: Mask | ((rawValue: string) => Mask);
        guide?: boolean;
        showMask?: boolean;
        placeholderChar?: string;
        keepCharPositions?: boolean;
        pipe?: (
            conformedValue: string,
            config: TextMaskConfig,
        ) => false | string | { value: string; indexesOfPipedChars: number[] };
    };

    export type TextMaskInputElement = {
        state: { previousConformedValue: string; previousPlaceholder: string };
        update: (
            rawValue?: string,
            textMaskConfig?: TextMaskConfig & { inputElement: HTMLInputElement },
        ) => void;
    };

    export function createTextMaskInputElement(
        config: TextMaskConfig & { inputElement: HTMLInputElement },
    ): TextMaskInputElement;

    export function conformToMask(
        text: string,
        mask: Mask | ((rawValue: string) => Mask),
        config?: TextMaskConfig,
    ): conformToMaskResult;

    export type conformToMaskResult = {
        conformedValue: string;
        meta: {
            someCharsRejected: boolean;
        };
    };
}
