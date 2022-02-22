export const addStr = (str: string, index: number, stringToAdd: string) =>
    str.substring(0, index) + stringToAdd + str.substring(index, str.length);
