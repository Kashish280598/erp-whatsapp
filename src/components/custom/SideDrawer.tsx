import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
} from "@/components/ui/drawer";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { IconChevronLeft, IconX } from "@tabler/icons-react";

export const SideDrawerType = {
    DEFAULT: 'default',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info',
} as const;

type SideDrawerTypeValue = typeof SideDrawerType[keyof typeof SideDrawerType];

const getSideDrawerHeaderClass = (type: SideDrawerTypeValue = SideDrawerType.DEFAULT) => {
    switch (type) {
        case SideDrawerType.SUCCESS:
            return "bg-[#E6F4EE] text-green-700";
        case SideDrawerType.WARNING:
            return "bg-warning-500 text-yellow-700";
        case SideDrawerType.ERROR:
            return "bg-error-100 text-error-700";
        case SideDrawerType.INFO:
            return "bg-[#E1E2F9] text-blue-700";
        default:
            return "bg-[#F4F4F6] text-gray-700";
    }
};

interface SideDrawerProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    open: boolean;
    onClose: () => void;
    className?: string;
    type?: SideDrawerTypeValue;
    headerClassName?: string;
    backButtonText?: string;
    isVisibleBackButton?: boolean;
    onBackButtonClick?: () => void;
    headerStyle?: React.CSSProperties;
}

export function SideDrawer({ header, children, open, onClose, className, type = SideDrawerType.DEFAULT, headerClassName, backButtonText, isVisibleBackButton = false, onBackButtonClick, headerStyle }: SideDrawerProps) {
    return (
        <Drawer open={open} onClose={onClose} direction="right">
            <DrawerContent className={cn("!w-[65vw] !max-w-[80vw] p-1.5", className)}>
                <div className="mx-auto w-full h-full flex flex-col gap-3">
                    {isVisibleBackButton && (
                        <Button
                            onClick={onBackButtonClick}
                            variant="link"
                            className="w-fit text-[13px] font-[600] text-primary leading-5 py-2 !px-0 ml-5 rounded-[8px] hover:no-underline">
                            <IconChevronLeft className='h-4 w-4' /> {backButtonText || 'Go Back'}
                        </Button>
                    )}
                    <DrawerHeader
                        className={cn("relative p-1 pr-5 rounded-[12px]  mb-12", getSideDrawerHeaderClass(type), headerClassName)}
                        style={headerStyle}
                    >
                        <div className={cn("flex items-center gap-3")}>
                            {header || <div className="mr-auto" />}
                            <DialogClose className="p-0 min-h-7 min-w-7 rounded-full bg-white cursor-pointer hover:bg-red-100 flex items-center justify-center border-1 border-neutral-200">
                                <IconX className="h-5 w-5 text-gray-500" />
                            </DialogClose>
                        </div>
                    </DrawerHeader>
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
};
