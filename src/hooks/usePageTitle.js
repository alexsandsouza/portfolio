import { useEffect } from 'react';

export const usePageTitle = (title) => {
    useEffect(() => {
        if (!title) return undefined;
        const previous = document.title;
        document.title = title;
        return () => {
            document.title = previous;
        };
    }, [title]);
};
