import { Button } from '@/components/ui/button'
import { Switch } from "@/components/ui/switch"
import type { User } from '@/types/user.type'
import { IconDotsVertical } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from '@/lib/store'
import { openEditDrawer, openUserActivationModal, resetPasswordForUser } from '@/lib/features/settings/settingsSlice'
import { toast } from 'sonner'
import { isAdminUser } from '@/lib/utils'
import { AUTH_METHODS } from '@/utils/constant'

interface UserDirectoryActionColumnProps {
    row: Row<User>;
}

const UserDirectoryActionColumn: React.FC<UserDirectoryActionColumnProps> = ({ row }) => {
    const dispatch = useAppDispatch();
    const { user: AdminUser } = useAppSelector(state => state.auth);
    const user = row.original;
    const active = user.active;
    const isAdmin = isAdminUser();

    const handleEdit = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        dispatch(openEditDrawer(user));
    };

    const handleActivationToggle = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (AdminUser?.id === user?.id) return
        dispatch(openUserActivationModal(user));
    };

    const changeActivationStatus = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (AdminUser?.id === user?.id) return
        dispatch(openUserActivationModal(user));
    };

    const handleResetPassword = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (AdminUser && AdminUser.tenantId)
            dispatch(resetPasswordForUser({ userId: user.id, tenantId: AdminUser?.tenantId }));
        else
            toast.error('TanentId is missing.');
    };

    const handleResetMFA = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (AdminUser?.id === user?.id) return
        // TODO: Implement MFA reset email
        toast.success('MFA reset email sent successfully.');
    };

    return (
        <div className={`flex items-center gap-2 ${!isAdmin && 'justify-center'}`}>
            {isAdmin && <Switch disabled={AdminUser?.id === user?.id} className="w-8 h-4.5 data-[state=checked]:bg-success cursor-pointer" checked={active} onClick={changeActivationStatus} />}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-primary-300">
                        <IconDotsVertical className="h-4 w-4 text-gray-500" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`w-[160px] ${AdminUser?.id === user?.id ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation()
                }}>
                    <DropdownMenuItem className={`py-2.5 text-sm cursor-pointer`} onClick={handleEdit}>
                        {isAdmin ? 'Edit' : 'View Detial'}
                    </DropdownMenuItem>
                    {isAdmin && (
                        <>
                            <DropdownMenuItem disabled={AdminUser?.id === user?.id} className='cursor-pointer' onClick={handleActivationToggle}>
                                {active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            {user?.authMethod?.toLowerCase() === AUTH_METHODS.Password.toLowerCase() && (
                                <>
                                    <DropdownMenuItem className={`py-2.5 text-sm cursor-pointer`} onClick={handleResetPassword}>
                                        Reset Password
                                    </DropdownMenuItem>
                                    {/* Todo: Enable after BE blocker resolved */}
                                    {/* <DropdownMenuItem disabled={AdminUser?.id === user?.id} className={`py-2.5 text-sm ${AdminUser?.id === user?.id?'cursor-not-allowed':'cursor-pointer'}`} onClick={handleResetMFA}>
                                        Reset MFA
                                    </DropdownMenuItem> */}
                                </>
                            )}
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    )
};

export default UserDirectoryActionColumn;