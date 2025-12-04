import { useCallback } from 'react';

export const useHaptic = () => {
    const trigger = useCallback(() => {
        // Check if navigator.vibrate is supported
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            // 10ms is a very subtle "tick" feeling
            navigator.vibrate(10);
        }
    }, []);

    return trigger;
};
