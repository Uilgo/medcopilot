import { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

type Theme = "light" | "dark" | "system";

export function ModeToggle() {
  // Inicializar tema do localStorage/system
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) return savedTheme;
    return "system";
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const items = [
    { label: "Light", value: "light" as Theme, icon: Sun },
    { label: "Dark", value: "dark" as Theme, icon: Moon },
    { label: "System", value: "system" as Theme, icon: Monitor },
  ];

  const CurrentIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  const selectTheme = (newTheme: Theme) => {
    setTheme(newTheme);

    // Aplicar tema
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      localStorage.removeItem("theme");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Aplicar tema ao montar
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // system
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <Dropdown
      align="right"
      trigger={
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-(--color-text-primary) transition-colors hover:bg-(--color-bg-secondary) cursor-pointer"
          type="button"
          aria-label="Seletor de tema"
        >
          <CurrentIcon className="h-5 w-5" />
        </button>
      }
    >
      {({ close }) => (
        <>
          {items.map((item) => {
            const ItemIcon = item.icon;
            const isSelected = theme === item.value;
            return (
              <DropdownItem
                key={item.value}
                onClick={() => {
                  selectTheme(item.value);
                  close();
                }}
                className="flex items-center gap-3"
              >
                <ItemIcon className="h-4 w-4" />
                <span>{item.label}</span>
                {isSelected && <Check className="h-4 w-4 ml-auto" />}
              </DropdownItem>
            );
          })}
        </>
      )}
    </Dropdown>
  );
}
