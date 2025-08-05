import { Laptop01, Moon01, Sun } from "@untitledui/icons";
import { useTheme } from "@/providers/theme-provider";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="p-2">
            <ButtonGroup value={theme} onChange={(value) => setTheme(value as "light" | "dark" | "system")}>
                <ButtonGroupItem
                    value="light"
                    aria-label="Set light theme"
                    iconLeading={Sun}
                />
                <ButtonGroupItem
                    value="dark"
                    aria-label="Set dark theme"
                    iconLeading={Moon01}
                />
                <ButtonGroupItem
                    value="system"
                    aria-label="Set system theme"
                    iconLeading={Laptop01}
                />
            </ButtonGroup>
        </div>
    );
}