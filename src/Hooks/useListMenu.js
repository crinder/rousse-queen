import { useState, useMemo } from "react";

export const useListFilter = (items) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [expandedCombo, setExpandedCombo] = useState(null);

    const filteredMenu = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === "ALL" || item.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [items, searchTerm, filterType]);

    const toggleCombo = (id) => setExpandedCombo(expandedCombo === id ? null : id);

    return {
        searchTerm, setSearchTerm,
        filterType, setFilterType,
        expandedCombo, toggleCombo,
        filteredMenu
    };
};