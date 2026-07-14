import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Goes back in history if there is any, else to a fallback path.
export default function useSmartBack(fallbackPath) {
    const navigate = useNavigate();
    const location = useLocation();

    return useCallback(() => {
        if (location.key !== 'default') {
            navigate(-1);
        } else {
            navigate(fallbackPath);
        }
    }, [navigate, location.key, fallbackPath]);
}
