import { SeriaProps } from '../../../types/seria.types';

export const sortByIndex = (series: SeriaProps[]): SeriaProps[] => {
    return series.sort((a: SeriaProps, b: SeriaProps) => {
        if (a?.zIndex && b?.zIndex && a?.zIndex > b?.zIndex) {
            return 1;
        }
        return -1;
    });
};
