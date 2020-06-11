export type TabsHeaderProps = {
    className?: string;

    titles: Array<{
        title: string;
        id: string | number;
    }>;

    selected?: string | number;

    scrollable?: boolean;

    onChange?: (event: MouseEvent, payload: { selected?: string | number }) => void;
};
