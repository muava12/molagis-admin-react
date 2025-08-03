import { Button } from "@/components/base/buttons/button";
import { Moon01, Sun } from "@untitledui/icons";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    return (
        <Button
            aria-label="Toggle theme"
            color="tertiary"
            size="sm"
            iconLeading={theme === "light" ? Moon01 : Sun}
            onClick={toggleTheme}
        />
    );
}