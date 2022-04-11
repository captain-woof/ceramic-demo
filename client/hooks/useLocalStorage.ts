import { useEffect, useState } from "react"

export const useLocalStorage = <T>(key: string) => {
    const [value, setValue] = useState<T | "">("");
    const [initialValueLoaded, setInitialValueLoaded] = useState<boolean>(false);

    // Initial value
    useEffect(() => {
        setValue(localStorage.getItem(key) as unknown as T);
        setInitialValueLoaded(true);
    }, [key])

    useEffect(() => {
        if (initialValueLoaded) {
            localStorage.setItem(key, value as unknown as string);
        }
    }, [value, key, initialValueLoaded])

    return {
        value,
        setValue
    }
}
