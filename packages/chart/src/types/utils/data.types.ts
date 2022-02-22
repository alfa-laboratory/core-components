export interface DataProps {
    /**
     * Метка
     */
    label: string | number;

    /**
     * Значение
     */
    value: number;
}

export interface DataDynamicProps {
    [key: string]: number | string;
}

export interface DataDynamicBooleanProps {
    [key: string]: boolean;
}
