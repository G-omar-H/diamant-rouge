// components/ProductFilters.tsx
import { useState } from "react";

type ProductFiltersProps = {
    onSortChange: (sortOption: string) => void;
    onFilterChange?: (filterOption: string) => void;
};

export default function ProductFilters({
    onSortChange,
    onFilterChange,
}: ProductFiltersProps) {
    const [sortOption, setSortOption] = useState("default");

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSortOption(value);
        onSortChange(value);
    };

    return (
        <div className="w-full overflow-x-visible pb-1 px-1 md:px-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 w-full">
                {/* Sorting Dropdown */}
                <div className="flex items-center w-full sm:w-auto">
                    <label className="text-richEbony mr-2 text-sm md:text-lg whitespace-nowrap">Sort by:</label>
                    <select
                        className="bg-burgundy/20 border border-brandGold text-richEbony px-3 py-2 rounded-md
                         focus:ring focus:ring-brandGold transition duration-300 text-sm w-full sm:w-auto min-w-[150px]"
                        value={sortOption}
                        onChange={handleSortChange}
                    >
                        <option value="default">Default</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="latest">Newest Arrivals</option>
                    </select>
                </div>

                {/* Future-proofed Filter Section */}
                {onFilterChange && (
                    <div className="flex items-center w-full sm:w-auto">
                        <label className="text-richEbony mr-2 text-sm md:text-lg whitespace-nowrap">Filter:</label>
                        <select
                            className="bg-burgundy/20 border border-brandGold text-richEbony px-3 py-2 rounded-md
                             focus:ring focus:ring-brandGold transition duration-300 text-sm w-full sm:w-auto min-w-[150px]"
                            onChange={(e) => onFilterChange(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="limited">Limited Edition</option>
                            <option value="bespoke">Bespoke Creations</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}
