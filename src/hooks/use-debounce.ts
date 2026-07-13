"use client"

import {useEffect, useState} from "react";

export function useDebounce<T>(value: T, dealy: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        },dealy)

        return () => {
            clearTimeout(handler)
        }
    }, [value, dealy]);

    return debouncedValue;
}