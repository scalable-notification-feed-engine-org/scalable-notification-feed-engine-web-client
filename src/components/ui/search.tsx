"use client";
import { Search, Loader2} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import apiClient from "@/lib/api-client";

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}

interface UserSearchResult {
    id: string;
    firstName: string;
}

const AVATAR_HUES = [262, 210, 340, 25, 160, 285];

function hueForName(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_HUES[Math.abs(hash) % AVATAR_HUES.length];
}

export function SearchInput({
                                placeholder = "Search...",
                                value,
                                onChange
                            }: SearchInputProps) {
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedSearchQuery = useDebounce(value, 400);

    useEffect(() => {
        const fetchUser = async () => {
            if (!debouncedSearchQuery || debouncedSearchQuery.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            setQuery(value)
            try {
                const response = await apiClient.get(`/users/visitors/get-all-user-details?searchText=${debouncedSearchQuery}`);
                console.log("Response", response.data.data);
                setSearchResults(response.data.data || []);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsSearching(false);
            }
        };
        fetchUser();
    }, [debouncedSearchQuery, value]);

    useEffect(() => {
        setHighlightedIndex(-1);
    }, [searchResults]);

    useEffect(() => {
        const onGlobalKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
            if (e.key === "/" && !typing) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener("keydown", onGlobalKey);
        return () => document.removeEventListener("keydown", onGlobalKey);
    }, []);

    const isOpen = query.length >= 2 && (searchResults.length > 0 || isSearching);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            if (isOpen) { setSearchResults([]); return; }
            inputRef.current?.blur();
            return;
        }
        if (!isOpen || searchResults.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((i) => (i + 1) % searchResults.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((i) => (i <= 0 ? searchResults.length - 1 : i - 1));
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
            e.preventDefault();
            const selected = searchResults[highlightedIndex];
            setQuery(selected.firstName);
            setSearchResults([]);
        }
    };

    return (
        <div className="relative w-full">
            <div
                className={`flex items-center gap-2 h-9 rounded-full px-3 transition-all duration-150 ${
                    isFocused
                        ? "bg-white border border-brand shadow-[0_0_0_4px_rgba(124,92,252,0.12)]"
                        : "bg-background border border-transparent hover:bg-border-subtle/60"
                }`}
            >
                <Search size={14} className="text-muted shrink-0" aria-hidden="true" />
                <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls="search-results-list"
                    aria-autocomplete="list"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="flex-1 min-w-0 bg-transparent outline-none text-sm text-foreground placeholder:text-muted"
                />
                    <button
                        type="button"
                        aria-label="Clear search"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { onChange?.(""); setSearchResults([]); }}
                        className="shrink-0 w-4 h-4 flex items-center justify-center rounded-full text-muted hover:text-foreground"
                    >

                    </button>
            </div>

            {isOpen && (
                <div
                    id="search-results-list"
                    role="listbox"
                    className="absolute left-0 right-0 top-full w-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-border-subtle bg-white p-1.5 shadow-[0_12px_32px_-8px_rgba(21,18,33,0.18)]"
                >
                    {isSearching ? (
                        <div className="flex items-center justify-center gap-2 p-4 text-xs text-muted">
                            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                            Searching
                        </div>
                    ) : (
                        <>
                            <p className="px-2.5 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                                People
                            </p>
                            {searchResults.map((user, i) => {
                                const hue = hueForName(user.firstName);
                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        role="option"
                                        aria-selected={i === highlightedIndex}
                                        onMouseEnter={() => setHighlightedIndex(i)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        className={`w-full text-left px-2 py-2 rounded-xl transition-colors flex items-center gap-3 ${
                                            i === highlightedIndex ? "bg-background" : "hover:bg-background"
                                        }`}
                                        onClick={() => {
                                            setQuery(user.firstName)
                                            setSearchResults([]);
                                        }}
                                    >
                                        <span
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                                            style={{ backgroundColor: `hsl(${hue}, 65%, 55%)` }}
                                        >
                                            {user.firstName.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="text-sm font-medium text-foreground truncate">
                                            {user.firstName}
                                        </span>
                                    </button>
                                );
                            })}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}