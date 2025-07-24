import { Button } from "@/components/ui/button"
import {
    Dialog as CoreDialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconX } from "@tabler/icons-react";
import Confetti from 'react-confetti';
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export const DialogType = {
    DEFAULT: 'default',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info',
} as const;

type DialogTypeValue = typeof DialogType[keyof typeof DialogType];

interface DialogAction {
    label: string;
    onClick?: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;
}

interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    type?: DialogTypeValue;
    icon?: React.ReactNode;
    title: string;
    description?: string;
    children?: React.ReactNode;
    actions?: DialogAction[];
    trigger?: React.ReactNode;
    className?: string;
    onClose?: () => void;
    iconInitials?: string;
    isShowConfetti?: boolean;
    iconClassName?: string;
}

const getDialogHeaderClass = (type: DialogTypeValue = DialogType.DEFAULT) => {
    switch (type) {
        case DialogType.SUCCESS:
            return "bg-success-300 text-success";
        case DialogType.WARNING:
            return "bg-warning-500 text-warning";
        case DialogType.ERROR:
            return "bg-error-100 text-error";
        case DialogType.INFO:
            return "bg-[#E9E9FD] text-primary";
        default:
            return "bg-primary-300 text-neutral";
    }
};

export function Dialog({
    open,
    onOpenChange,
    type = DialogType.DEFAULT,
    icon,
    title,
    description,
    children,
    actions = [],
    trigger,
    className,
    iconInitials,
    isShowConfetti = false,
    iconClassName,
}: DialogProps) {
    const dialogHeaderRef = useRef<HTMLDivElement>(null);
    const confettiRef = useRef<HTMLCanvasElement>(null);
    const [hideConfetti, setHideConfetti] = useState(false);

    useEffect(() => {
        if (open && isShowConfetti) {
            setTimeout(() => {
                if (dialogHeaderRef.current && confettiRef.current) {
                    confettiRef.current.height = dialogHeaderRef.current.clientHeight + 8;
                    confettiRef.current.width = dialogHeaderRef.current.clientWidth;
                }
            }, 100);
        }
    }, [open, isShowConfetti, hideConfetti]);

    useEffect(() => {
        if (hideConfetti) {
            setTimeout(() => {
                setHideConfetti(false);
            }, 1000);
        };
    }, [hideConfetti]);

    return (
        <CoreDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className={cn("sm:max-w-[425px] gap-1", className)} showCloseButton={false}>
                <DialogHeader ref={dialogHeaderRef} className={cn("relative p-1 pr-5 rounded-[12px] -mt-4 -mx-4 mb-10", getDialogHeaderClass(type))}>
                    {!hideConfetti && isShowConfetti && (
                        <Confetti
                            ref={confettiRef}
                            numberOfPieces={500}
                            gravity={0.1}
                            drawShape={ctx => {
                                // Random size for each particle
                                const size = Math.random() * 10;

                                // Random number of points (3-6)
                                const points = Math.floor(Math.random() * 4) + 2;

                                ctx.beginPath();
                                for (let i = 0; i < points; i++) {
                                    const angle = (Math.PI * 2 * i) / points;
                                    const x = Math.cos(angle) * size;
                                    const y = Math.sin(angle) * size;

                                    if (i === 0) {
                                        ctx.moveTo(x, y);
                                    } else {
                                        ctx.lineTo(x, y);
                                    }
                                }
                                ctx.closePath();
                                ctx.fill();
                            }}
                            recycle={false}
                            onConfettiComplete={(confetti) => {
                                if (confetti && open) {
                                    setHideConfetti(true);
                                };
                            }}
                            className="absolute !-top-2 !left-1" />
                    )}
                    <div className={cn("flex items-center gap-3 z-2")}>
                        <Avatar className="relative left-3 top-8 h-17 w-17 rounded-[12px] border-1 border-neutral-200 p-0.5 bg-white flex items-center justify-center">
                            {icon && <div className={cn("w-9 h-9 flex items-center justify-center", iconClassName)}>{icon}</div>}
                            {iconInitials && (
                                <AvatarFallback className={`text-2xl font-bold rounded-[10px] text-neutral bg-white`}>{iconInitials}</AvatarFallback>
                            )}
                        </Avatar>
                        <DialogClose className="p-0 h-7 w-7 rounded-full bg-white cursor-pointer hover:bg-red-100 ml-auto flex items-center justify-center">
                            <IconX className="h-5 w-5 text-gray-500" />
                        </DialogClose>
                    </div>
                </DialogHeader>
                <div className="p-1 pt-0 pb-2 w-full">
                    {title && <DialogTitle className="text-[18px] font-[600] text-neutral">{title}</DialogTitle>}
                    {description && (
                        <DialogDescription className="text-[13px] mt-2 font-[400] leading-5 text-neutral-500">
                            {description}
                        </DialogDescription>
                    )}
                    {children}
                </div>

                {actions.length > 0 && (
                    <DialogFooter className="gap-2 mt-3">
                        {actions.map((action, index) => (
                            <Button
                                key={index}
                                variant={action.variant || "default"}
                                onClick={action.onClick}
                                className={action.className}
                                disabled={action.disabled}
                            >
                                {action.isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                <span>{action.label}</span>
                            </Button>
                        ))}
                    </DialogFooter>
                )}
            </DialogContent>
        </CoreDialog>
    );
}
