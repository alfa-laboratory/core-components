export type TabsHeaderProps = {
    className?: string;

    titles: Array<{
        title: string;
        id: string | number;
    }>;

    selectedId?: string | number;

    scrollable?: boolean;

    onChange?: (event: MouseEvent, payload: { selectedId?: string | number }) => void;
};
