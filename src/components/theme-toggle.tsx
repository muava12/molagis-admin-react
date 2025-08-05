import { Moon01, Sun } from "@untitledui/icons";
import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/base/buttons/button";

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      color="tertiary"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon01 className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
};