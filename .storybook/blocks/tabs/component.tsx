import React, { FC, useState, useMemo, useCallback, ReactNode } from 'react';
import { TabsResponsive, Tab, TabsResponsiveProps } from '@alfalab/core-components-tabs';

enum TabName {
    DESCRIPTION = 'DESCRIPTION',
    PROPS = 'PROPS',
    CSS_VARS = 'CSS_VARS',
}

const TabTitle = {
    [TabName.DESCRIPTION]: 'Описание',
    [TabName.PROPS]: 'Свойства',
    [TabName.CSS_VARS]: 'CSS-переменные',
};

type Props = {
    description: ReactNode;
    props: ReactNode;
    cssVars?: ReactNode;
    defaultSelected?: TabName;
};

export const Tabs: FC<Props> = ({
    description,
    props,
    cssVars,
    defaultSelected = TabName.DESCRIPTION,
}) => {
    const [selected, setSelected] = useState(defaultSelected);

    const handleChange = useCallback<Required<TabsResponsiveProps>['onChange']>(
        (_, { selectedId }) => {
            setSelected(selectedId as TabName);
        },
        [],
    );

    const renderTabs = (): TabsResponsiveProps['children'] => {
        const result = [
            <Tab title={TabTitle[TabName.DESCRIPTION]} id={TabName.DESCRIPTION}>
                <div style={{ marginTop: '40px' }}>{description}</div>
            </Tab>,
            <Tab title={TabTitle[TabName.PROPS]} id={TabName.PROPS}>
                {props}
            </Tab>,
        ];

        if (cssVars) {
            result.push(
                <Tab title={TabTitle[TabName.CSS_VARS]} id={TabName.CSS_VARS}>
                    <div style={{ marginTop: '40px' }}>{cssVars}</div>
                </Tab>,
            );
        }

        return result;
    };

    const tabs = useMemo(() => renderTabs(), [description, props, cssVars]);

    return (
        <TabsResponsive selectedId={selected} onChange={handleChange}>
            {tabs}
        </TabsResponsive>
    );
};
