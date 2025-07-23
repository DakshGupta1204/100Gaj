"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import "./search-dropdown.css";
export default function SearchDropdown({ placeholder = "Search...", options, value, onChangeAction, name, required = false, className, icon, }) {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const suggestionRef = useRef(null);
    const containerRef = useRef(null);
    // Update component state when prop value changes
    useEffect(() => {
        setQuery(value);
    }, [value]);
    // Filter suggestions based on input
    useEffect(() => {
        if (query.trim() === "") {
            setSuggestions(options.slice(0, 15));
            return;
        }
        const normalizedQuery = query.toLowerCase().trim();
        const filtered = options
            .filter(option => option.toLowerCase().includes(normalizedQuery))
            .sort((a, b) => {
            // Sort exact matches and startsWith matches higher
            const aLower = a.toLowerCase();
            const bLower = b.toLowerCase();
            const aStartsWith = aLower.startsWith(normalizedQuery);
            const bStartsWith = bLower.startsWith(normalizedQuery);
            if (aStartsWith && !bStartsWith)
                return -1;
            if (!aStartsWith && bStartsWith)
                return 1;
            return a.localeCompare(b);
        })
            .slice(0, 15);
        setSuggestions(filtered);
    }, [query, options]);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    // Helper function to highlight matching parts
    const highlightMatch = (text, searchQuery) => {
        if (!searchQuery.trim())
            return text;
        const normalizedText = text;
        const normalizedQuery = searchQuery.toLowerCase();
        const index = normalizedText.toLowerCase().indexOf(normalizedQuery);
        if (index === -1)
            return text;
        return (<>
        {text.substring(0, index)}
        <span className="bg-orange-500/20 text-orange-500 font-medium">
          {text.substring(index, index + searchQuery.length)}
        </span>
        {text.substring(index + searchQuery.length)}
      </>);
    };
    const handleInputChange = (_e) => {
        setQuery(_e.target.value);
        setIsOpen(true);
    };
    const handleKeyDown = (_e) => {
        if (_e.key === "Enter" && suggestions.length > 0) {
            _e.preventDefault();
            onChangeAction(suggestions[0]);
            setIsOpen(false);
        }
        else if (_e.key === "Escape") {
            setIsOpen(false);
        }
        else if (_e.key === "ArrowDown" && suggestions.length > 0) {
            _e.preventDefault();
            const firstSuggestion = document.querySelector('.dropdown-item');
            if (firstSuggestion) {
                firstSuggestion.focus();
            }
        }
    };
    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        onChangeAction(suggestion);
        setIsOpen(false);
    };
    // Calculate dropdown position
    const getDropdownPosition = () => {
        if (!containerRef.current)
            return {};
        return {
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            maxHeight: "200px",
            overflow: "auto",
            zIndex: 50
        };
    };
    return (<div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Input ref={inputRef} id={name} name={name} type="text" placeholder={placeholder} value={query} onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={() => setIsOpen(true)} required={required} className="bg-neutral-800 border-neutral-700 focus:border-orange-500 focus:ring-orange-500/20 transition-all pl-10"/>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
          {icon || <Search className="h-4 w-4"/>}
        </div>
      </div>
      
      {isOpen && (<motion.div ref={suggestionRef} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="absolute z-50 mt-1 shadow-lg rounded-md border border-neutral-700 text-left bg-neutral-800 w-full scrollbar-thin" style={getDropdownPosition()}>
          <div className="w-full">
            {suggestions.length > 0 ? (<>
                {suggestions.map((suggestion, index) => (<div key={index} className="px-4 py-2 hover:bg-neutral-700 cursor-pointer text-white text-sm dropdown-item transition-colors duration-150 flex items-center justify-between" onClick={() => handleSuggestionClick(suggestion)} tabIndex={0} onKeyDown={(_e) => {
                        if (_e.key === "Enter") {
                            handleSuggestionClick(suggestion);
                        }
                    }}>
                    <div>
                      {query.trim() !== "" && suggestion.toLowerCase().includes(query.toLowerCase()) ? (highlightMatch(suggestion, query)) : (suggestion)}
                    </div>
                    {suggestion === value && (<Check size={16} className="text-orange-500"/>)}
                  </div>))}
                {suggestions.length >= 15 && (<div className="text-center py-1 text-xs text-neutral-500 border-t border-neutral-700">Scroll for more</div>)}
              </>) : (<div className="px-4 py-2 text-neutral-400 text-sm">No options found</div>)}
          </div>
        </motion.div>)}
    </div>);
}
