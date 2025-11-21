/**
 * SelectMenu Component
 * Select robusto com pesquisa (similar ao da imagem)
 */

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectMenuOption {
  value: string;
  label: string;
}

export interface SelectMenuProps {
  options: SelectMenuOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  id?: string;
  name?: string;
}

export const SelectMenu = ({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  searchPlaceholder = "Pesquisar...",
  emptyMessage = "Nenhum resultado encontrado",
  disabled = false,
  className,
  label,
  error,
  id,
  name,
}: SelectMenuProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 300,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectId = id || name || label?.toLowerCase().replace(/\s+/g, "-") || "select-menu";

  // Filtrar opções baseado na pesquisa
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  // Encontrar label da opção selecionada
  const selectedOption = options.find((opt) => opt.value === value);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  // Focar no input de pesquisa quando abrir e calcular posição
  useEffect(() => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 16; // 16px de margem
      const maxHeight = Math.min(300, spaceBelow);

      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
        maxHeight: maxHeight,
      });

      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, [open]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="w-full">
      {label && (
        <div
          id={`${selectId}-label`}
          className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
        >
          {label}
        </div>
      )}
      <div ref={containerRef} className={cn("relative w-full", className)}>
        {/* Hidden input for form submission */}
        <input type="hidden" id={selectId} name={name} value={value || ""} />

        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-label={!label ? placeholder : undefined}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border-2 cursor-pointer",
            "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
            "text-gray-900 dark:text-white",
            "px-3 py-2 text-sm",
            "hover:bg-gray-50 dark:hover:bg-gray-700",
            "focus:outline-none focus:border-medical-500 dark:focus:border-medical-400 focus:ring-4 focus:ring-medical-500/10",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all",
            error && "border-critical-500 focus:border-critical-600 focus:ring-critical-500/10",
            open &&
              !error &&
              "border-medical-500 dark:border-medical-400 ring-4 ring-medical-500/10"
          )}
        >
          <span className={cn(!selectedOption && "text-gray-500 dark:text-gray-400")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown */}
        {open &&
          createPortal(
            <div
              style={{
                position: "fixed",
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                maxHeight: `${dropdownPosition.maxHeight}px`,
              }}
              className={cn(
                "z-1000",
                "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600",
                "rounded-md shadow-lg",
                "overflow-hidden"
              )}
            >
              {/* Search Input */}
              <div className="p-2 border-b-2 border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    ref={searchInputRef}
                    id={`${selectId}-search`}
                    name={`${selectId}-search`}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    className={cn(
                      "w-full h-9 pl-9 pr-3 rounded-md text-sm border-0",
                      "bg-gray-50 dark:bg-gray-700",
                      "text-gray-900 dark:text-white",
                      "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                      "focus:outline-none",
                      "focus:bg-white dark:focus:bg-gray-800",
                      "transition-colors"
                    )}
                  />
                </div>
              </div>

              {/* Options List */}
              <div
                style={{ maxHeight: `${dropdownPosition.maxHeight - 60}px` }}
                className="overflow-y-auto p-1"
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {emptyMessage}
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelect(option.value);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer",
                          "text-left transition-colors",
                          "text-gray-900 dark:text-white",
                          isSelected
                            ? "bg-medical-50 text-medical-700 dark:bg-medical-900/20 dark:text-medical-300"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>,
            document.body
          )}
      </div>

      <div className="h-6 mt-1">
        {error && <p className="text-sm text-critical-600 dark:text-critical-400">{error}</p>}
      </div>
    </div>
  );
};
