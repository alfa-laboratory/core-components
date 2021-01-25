export type BreakpointObjectType = {
    s?: string | number;
    m?: string | number;
    l?: string | number;
    xl?: string | number;
};

export type BreakpointObjectKeysType = keyof BreakpointObjectType;

export type BreakpointType = string | number | BreakpointObjectType;

export type BreakpointsType = {
    mobile?: BreakpointType;
    tablet?: BreakpointType;
    desktop?: BreakpointType;
};

export type BreakpointsKeysType = keyof BreakpointsType;

export type ResponsivePropertyType = string | number | BreakpointsType;
