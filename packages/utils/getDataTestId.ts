export const getDataTestId = (dataTestId?: string, element?: string) => {
    const elementPart = element ? `-${element.toLowerCase()}` : '';

    return dataTestId ? `${dataTestId}${elementPart}` : undefined;
};
