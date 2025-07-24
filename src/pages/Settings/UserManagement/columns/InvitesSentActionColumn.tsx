import { Button } from '@/components/ui/button'
import type { User } from '@/types/user.type'
import { IconDotsVertical } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch } from '@/lib/store'
import { openEditDrawer, resendInvitation } from '@/lib/features/settings/settingsSlice'
import { isAdminUser } from '@/lib/utils'

export default function InvitesSentActionColumn({ row }: { row: Row<User> }) {
    const dispatch = useAppDispatch();
    const user = row.original;
    const isAdmin = isAdminUser();

    const handleEdit = () => {
        dispatch(openEditDrawer({ ...user, isInviteTab: true }));
    };

    const handleResendInvitation = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        dispatch(resendInvitation(user.id));
    };

    return (
        <div className="flex items-center justify-cnter w-full">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-primary-300 h-8 w-8 mx-auto">
                        <IconDotsVertical className="h-4 w-4 text-gray-500" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem className="py-2.5 text-sm cursor-pointer" onClick={handleEdit}>
                        {isAdmin ? 'Edit' : 'View Detail'}
                    </DropdownMenuItem>
                    {isAdmin && (
                        <DropdownMenuItem className="py-2.5 text-sm cursor-pointer" onClick={handleResendInvitation}>
                            Resend Invitation
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
};