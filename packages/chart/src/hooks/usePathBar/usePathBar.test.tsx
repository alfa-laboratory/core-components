import React from 'react';
import { render } from '@testing-library/react';
import { renderHook, cleanup } from '@testing-library/react-hooks';
import { usePathBar, usePathBarProps } from '.';

describe('usePathBar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('should have result with height 0, without radius', () => {
        const data = {
            height: 0,
        };
        const { result } = renderHook(() => usePathBar(data));
        expect(result.current).toEqual([0, 0, 0, 0]);
    });

    it('should have result with small height, without radius', () => {
        const data = {
            height: 0.08,
        };
        const { result } = renderHook(() => usePathBar(data));
        expect(result.current).toEqual([2, 0, 0, 0]);
    });

    it('should have result with height', () => {
        const data = {
            height: 10,
        };
        const { result } = renderHook(() => usePathBar(data));
        expect(result.current).toEqual([10, 0, 0, 0]);
    });

    it('should have result with top radius, small height', () => {
        const data = {
            radius: {
                top: 0,
            },
            height: 0.08,
        };
        const { result } = renderHook(() => usePathBar(data));
        expect(result.current).toEqual([2, 0, 0, 0]);
    });

    it('should have result with bottom radius, small height', () => {
        const data = {
            radius: {
                bottom: 0,
            },
            height: 0.08,
        };
        const { result } = renderHook(() => usePathBar(data));
        expect(result.current).toEqual([2, 0, 0, 0]);
    });

    it('should have result with radius 0, small height', () => {
        const data = {
            radius: {
                top: 0,
                bottom: 0,
            },
            height: 0.08,
        };
        const { result } = renderHook(() => usePathBar(data));
        expect(result.current).toEqual([2, 0, 0, 0]);
    });

    it('should have result with radius, height 0', () => {
        const data = {
            radius: {
                top: 0,
                bottom: 0,
            },
            height: 0,
        };
        const { result } = renderHook(() => usePathBar(data));
        expect(result.current).toEqual([0, 0, 0, 0]);
    });

    it('should have result with radius 0, height', () => {
        const data = {
            radius: {
                top: 0,
                bottom: 0,
            },
            height: 50,
            background: {
                x: 472,
                y: 40,
                height: 500,
                width: 64,
            },
            y: 490,
        };
        const { result } = renderHook(() => usePathBar(data));
        expect(result.current).toEqual([50, 0, 0, 490]);
    });

    it('should have result with radius, height 0', () => {
        const data = {
            radius: {
                top: 10,
                bottom: 10,
            },
            height: 0,
        };
        const { result } = renderHook(() => usePathBar(data));
        expect(result.current).toEqual([0, 0, 0, 0]);
    });

    it('should have result with radius, small height', () => {
        const data = {
            radius: {
                top: 10,
                bottom: 10,
            },
            height: 0.08,
        };
        const { result } = renderHook(() => usePathBar(data));
        expect(result.current).toEqual([2, 1, 1, 0]);
    });

    it('should have result with radius, height', () => {
        const data = {
            radius: {
                top: 10,
                bottom: 10,
            },
            height: 50,
        };
        const { result } = renderHook(() => usePathBar(data));
        expect(result.current).toEqual([50, 10, 10, 0]);
    });

    it('should call one time', () => {
        jest.spyOn(React, 'useEffect').mockImplementation(jest.fn());

        const Example = ({ radius, height }: usePathBarProps) => {
            const test = usePathBar({ radius, height });
            return <React.Fragment>{test}</React.Fragment>;
        };

        render(<Example radius={{ top: 10, bottom: 10 }} height={0.08} />);

        expect(React.useEffect).toHaveBeenCalledTimes(1);
    });
});
