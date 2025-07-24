import { useEffect, useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Nav from "./nav";
import { cn } from "@/lib/utils";
import { Layout } from ".";
import { Button } from "../ui/button";
import { sidebarlinks } from "@/data/sidebar-links";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LOGO from "@/assets/icons/SSPM_LOGO.svg";
import { Separator } from "../ui/separator";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
}

export default function Sidebar({
    className,
}: SidebarProps) {
    const [navOpened, setNavOpened] = useState(false);


    /* Make body not scrollable when navBar is opened */
    useEffect(() => {
        if (navOpened) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [navOpened]);

    return (
        <aside
            className={cn(
                `fixed left-0 right-0 top-0 z-49 w-full border-r-[2px] transition-[width] md:bottom-0 md:right-auto md:h-svh md:w-[74px]`,
                className
            )}
        >
            {/* Overlay in mobile */}
            <div
                onClick={() => setNavOpened(false)}
                className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? "h-svh opacity-100" : "h-0 opacity-0"} w-full bg-background md:hidden`}
            />

            <Layout
                fixed
                className={`${navOpened ? "h-svh" : ""} overflow-hidden bg-background`}
            >
                {/* Header */}
                <Layout.Header
                    sticky
                    className="z-50 flex justify-center items-center px-4 py-3 md:px-3"
                >
                    <div
                        className={`flex w-full md:justify-center items-center`}
                    >
                        <div className={`block w-auto`}>
                            <Avatar className="w-6 h-6 md:h-8 md:w-8">
                                <AvatarImage src={LOGO} alt="@erp" />
                                <AvatarFallback className="text-sm uppercase">
                                    SP
                                </AvatarFallback>
                            </Avatar>
                            <Separator className="max-md:hidden mt-3 p-[1px]" />
                        </div>
                    </div>
                    <div className="flex md:hidden items-center space-x-2">
                        {/* Toggle Button in mobile */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            aria-label="Toggle Navigation"
                            aria-controls="sidebar-menu"
                            aria-expanded={navOpened}
                            onClick={() => setNavOpened((prev) => !prev)}
                        >
                            {navOpened ? <IconX /> : <IconMenu2 />}
                        </Button>
                    </div>
                </Layout.Header>

                {/* Navigation links */}
                {<ScrollArea className="h-[100%] pb-[80px] pt-1 max-md:hidden">
                    <Nav
                        id="sidebar-menu"
                        className={`z-40 h-full flex-1 ${navOpened ? "max-h-screen" : "max-h-0 py-0 md:max-h-screen md:py-2"}`}
                        closeNav={() => setNavOpened(false)}
                        links={sidebarlinks}
                    />
                </ScrollArea>}

                {navOpened && <ScrollArea className="h-[100%] pb-[80px] pt-1 md:hidden">
                    <Nav
                        id="sidebar-menu"
                        className={`z-40 h-full flex-1 ${navOpened ? "max-h-screen" : "max-h-0 py-0 md:max-h-screen md:py-2"}`}
                        closeNav={() => setNavOpened(false)}
                        links={sidebarlinks}
                    />
                </ScrollArea>}
            </Layout>
        </aside>
    );
}
