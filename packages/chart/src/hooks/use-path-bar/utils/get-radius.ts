export const getRadius = (height: number, radius: number): number => {
    const result = radius && height / 2 < radius ? Math.ceil(height / 2) : radius || 0;
    return result;
};
