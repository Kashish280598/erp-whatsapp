import { Toaster } from "@/components/ui/sonner";
import { IconChecks, IconAlertCircle, IconInfoCircle, IconAlertHexagon } from "@tabler/icons-react"
import { useEffect } from "react";
import { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
export const Toster = () => {
    const location = window.location;
    const [isAuthPath, setIsAuthPath] = useState(location.pathname.includes('/login') || location.pathname.includes('/forgot-password'));
    const { theme } = useTheme();

    useEffect(() => {
        setIsAuthPath(location.pathname.includes('/login') || location.pathname.includes('/forgot-password'));
    }, []);

    return (
        <Toaster
            position="bottom-center"
            richColors
            theme={theme}
            className={isAuthPath ? "custom-position-toaster" : ""}
            icons={{
                success: <IconChecks size={24} />,
                error: <IconAlertHexagon size={20} />,
                warning: <IconAlertCircle size={24} />,
                info: <IconInfoCircle size={24} />,
            }}
            toastOptions={{
                classNames: {
                    default: "border-background/40",
                    error: "bg-error text-white",
                    success: "bg-success text-white",
                    warning: "bg-warning text-white",
                    info: "bg-info text-white",
                },
            }}
        />
    )
}

