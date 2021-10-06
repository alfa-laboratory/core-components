import React, {
    FC,
    useState,
    useMemo,
    useCallback,
    ReactNode,
    isValidElement,
    ReactElement,
} from 'react';
import { TabsResponsive, Tab, TabsResponsiveProps } from '@alfalab/core-components-tabs';
import { Changelog } from '../changelog';

enum TabName {
    DESCRIPTION = 'DESCRIPTION',
    PROPS = 'PROPS',
    CSS_VARS = 'CSS_VARS',
    CHANGELOG = 'CHANGELOG',
}

const TabTitle = {
    [TabName.DESCRIPTION]: 'Описание',
    [TabName.PROPS]: 'Свойства',
    [TabName.CSS_VARS]: 'CSS-переменные',
    [TabName.CHANGELOG]: 'Что нового',
};

type Props = {
    description: ReactNode;
    props: ReactNode;
    cssVars?: ReactNode;
    changelog?: string;
    defaultSelected?: TabName;
};

export const Tabs: FC<Props> = ({
    description,
    props,
    cssVars,
    changelog,
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
        return [
            <Tab title={TabTitle[TabName.DESCRIPTION]} id={TabName.DESCRIPTION} key='description'>
                <div style={{ marginTop: '40px' }}>{description}</div>
            </Tab>,
            props ? (
                <Tab title={TabTitle[TabName.PROPS]} id={TabName.PROPS} key='props'>
                    {props}
                </Tab>
            ) : null,
            cssVars ? (
                <Tab title={TabTitle[TabName.CSS_VARS]} id={TabName.CSS_VARS} key='css-vars'>
                    <div style={{ marginTop: '40px' }}>{cssVars}</div>
                </Tab>
            ) : null,
            changelog ? (
                <Tab title={TabTitle[TabName.CHANGELOG]} id={TabName.CHANGELOG} key='changelog'>
                    <div style={{ marginTop: '40px' }}>
                        <Changelog content={changelog} />
                    </div>
                </Tab>
            ) : null,
        ].filter(isValidElement) as ReactElement[];
    };

    const tabs = useMemo(() => renderTabs(), [description, props, cssVars]);

    return (
        <TabsResponsive selectedId={selected} onChange={handleChange}>
            {tabs}
        </TabsResponsive>
    );
};
