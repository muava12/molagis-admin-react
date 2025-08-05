import { Button } from "@/components/base/buttons/button";
import { ButtonGroup } from "@/components/base/button-group/button-group";
import { Moon01, Monitor01, Sun } from "@untitledui/icons";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggleGroup() {
    const { theme, setTheme } = useTheme();

    return (
        <ButtonGroup>
            <Button
                aria-label="Light mode"
                color={theme === 'light' ? 'primary' : 'secondary'}
                size="sm"
                iconLeading={Sun}
                onClick={() => setTheme('light')}
            />
            <Button
                aria-label="Dark mode"
                color={theme === 'dark' ? 'primary' : 'secondary'}
                size="sm"
                iconLeading={Moon01}
                onClick={() => setTheme('dark')}
            />
            <Button
                aria-label="System mode"
                color={theme === 'system' ? 'primary' : 'secondary'}
                size="sm"
                iconLeading={Monitor01}
                onClick={() => setTheme('system')}
            />
        </ButtonGroup>
    );
}
