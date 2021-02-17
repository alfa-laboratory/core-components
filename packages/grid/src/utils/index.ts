import {
    BreakpointObjectKeysType,
    BreakpointsKeysType,
    BreakpointObjectType,
    ResponsivePropertyType,
} from '../typings';

export function createClassNames(
    props: Record<string, ResponsivePropertyType | undefined>,
    styles: Record<string, string>,
) {
    const classNames: string[] = [];

    Object.keys(props).forEach(name => {
        const prop = props[name];

        if (!prop) {
            return;
        }
        if (typeof prop !== 'object') {
            classNames.push(styles[`${name}-${prop}`]);
            return;
        }
        (Object.keys(prop) as BreakpointsKeysType[]).forEach(breakpoint => {
            if (prop[breakpoint] === null) {
                return;
            }
            if (typeof prop[breakpoint] === 'object') {
                const propBreakpointObject = prop[breakpoint] as BreakpointObjectType;
                (Object.keys(propBreakpointObject) as BreakpointObjectKeysType[]).forEach(size => {
                    const value = propBreakpointObject[size];
                    if (value === null) {
                        return;
                    }
                    classNames.push(styles[`${name}-${breakpoint}-${size}-${value}`]);
                });
            } else {
                const value = prop[breakpoint];
                classNames.push(styles[`${name}-${breakpoint}-${value}`]);
            }
        });
    });

    return classNames;
}
