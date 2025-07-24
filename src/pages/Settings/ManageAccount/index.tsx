import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import CardOverlayVisual from '@/assets/icons/rounded-visual.svg';
import ConfirmCurrentPasswordModal from './ConfirmCurrentPasswordModal';
import SetPasswordModal from './SetPasswordModal';
import { Dialog, DialogType } from '@/components/custom/Dialog';
import PSWDICON from '@/assets/icons/success-pswd.svg';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { closeSuccessModal } from '@/lib/features/settings/settingsSlice';
import { parseFullName, USERS_ENUMS } from '@/lib/utils';
import { AUTH_METHODS } from '@/utils/constant';
import moment from 'moment';
export default function ManageAccount() {
    const dispatch = useAppDispatch();
    const { isOpenSuccessModal } = useAppSelector((state) => state.settings.setPasswordModal);
    const user = useAppSelector((state) => state.auth.user);
    const { firstName, lastName } = parseFullName(user?.name || '');
    const userInitials = `${firstName?.charAt(0)?.toUpperCase()}${lastName?.charAt(0)?.toUpperCase()}`;

    const handleClose = () => {
        dispatch(closeSuccessModal());
    };

    return (
        <div className="h-full pb-10">
            {/* Hero Section */}
            <div className="relative gap-5 bg-neutral-300 bg-opacity-50 rounded-[12px] h-21 mb-15 border-b-1 border-primary-100 dark:bg-neutral-800 dark:border-primary-700">
                <Avatar className="absolute left-7 top-7 h-25 w-25 rounded-[8px] border-2 border-primary-100 p-0 bg-neutral-300 overflow-hidden">
                    <AvatarFallback className="rounded-[8px] text-primary text-[36px] font-[400] leading-[52px] bg-neutral-300">
                        {userInitials || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className='relative flex items-center justify-center h-full w-full overflow-hidden rounded-[12px] '>
                    <img src={CardOverlayVisual} alt="Download" className="absolute top-0 right-0" />
                </div>
            </div>

            <div className="mt-5 px-7">
                <div className="flex flex-col gap-2 mb-4">
                    <h1 className="text-[24px] font-[600] leading-7.5 text-neutral dark:text-neutral-100 font-inter">
                        {user?.name || 'User Name'}
                    </h1>
                    <Badge variant="secondary" className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 px-4 py-1 rounded-[8px] m-0 border-none shadow-none">
                        {user?.role ? USERS_ENUMS[user?.role] : 'User Role'}
                    </Badge>
                </div>

                {/* Todo: Enable after BE Blocker resolved */}
                {/* MFA Error Alert */}
                {/* {user?.authMethod === AUTH_METHODS.Password && (
                    <div className="flex items-center gap-1 bg-warning-500 border border-warning-200 rounded-[8px] px-3 py-2 mb-5">
                        <IconExclamationCircle stroke={1} className="w-4 h-4 text-warning" />
                        <div className="flex-1 flex items-center justify-between gap-2">
                            <div className="flex flex-col gap-1">
                                <h4 className="text-[13px] font-[600] leading-5 text-warning font-inter">MFA Error</h4>
                                <p className="text-[13px] font-[400] leading-5 text-neutral-500 font-inter">
                                    This may be because your authenticator app was reset or unlinked. To secure your account, please complete MFA verification again.
                                </p>
                            </div>
                            <Button variant="outline" className="shrink-0 px-3 py-2 text-[13px] leading-5 font-[600] text-neutral bg-white border-[#E4E4E8] hover:bg-[#E4E4E8]/80 cursor-pointer" onClick={handleReconnectMFA}>
                                Re-connect MFA
                            </Button>
                        </div>
                    </div>
                )} */}

                {/* Form Fields */}
                <div className="flex flex-col gap-7">
                    <div className="grid grid-cols-6 gap-2">
                        <div className="col-span-2 flex items-center">
                            <label className="text-[12px] font-[600] leading-4 text-neutral-500 font-inter">First Name</label>
                        </div>
                        <div className="col-span-4 flex items-center text-[13px] font-[400] leading-5 text-neutral dark:text-neutral-100 font-inter">{firstName || '-'}</div>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                        <div className="col-span-2 flex items-center">
                            <label className="text-[12px] font-[600] leading-4 text-neutral-500 font-inter">Last Name</label>
                        </div>
                        <div className="col-span-4 flex items-center text-[13px] font-[400] leading-5 text-neutral dark:text-neutral-100 font-inter">{lastName || '-'}</div>
                    </div>

                    {user?.authMethod === AUTH_METHODS.Password && <div className="grid grid-cols-6 gap-2">
                        <div className="col-span-2 flex items-center">
                            <label className="text-[12px] font-[600] leading-4 text-neutral-500 font-inter">Password</label>
                        </div>
                        <div className="col-span-4">
                            <ConfirmCurrentPasswordModal />
                        </div>
                    </div>}
                    <div className="grid grid-cols-6 gap-2">
                        <div className="col-span-2 flex items-center">
                            <label className="text-[12px] font-[600] leading-4 text-neutral-500 font-inter">Email</label>
                        </div>
                        <div className="col-span-4 flex items-center text-[13px] font-[400] leading-5 text-neutral dark:text-neutral-100 font-inter">{user?.email || '-'}</div>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                        <div className="col-span-2 flex items-center">
                            <label className="text-[12px] font-[600] leading-4 text-neutral-500 font-inter">Role</label>
                        </div>
                        <div className="col-span-4 flex items-center text-[13px] font-[400] leading-5 text-neutral dark:text-neutral-100 font-inter">
                            <Badge variant="secondary" className="bg-[#F4F4F6] text-[13px] leading-5 font-[400] px-2 rounded-[8px] text-neutral dark:bg-neutral-900 dark:text-neutral-200">
                                {user?.role ? USERS_ENUMS[user?.role] : 'User Role'}
                            </Badge></div>
                    </div>

                    {user?.authMethod === AUTH_METHODS.Password && (<div className="grid grid-cols-6 gap-2">
                        <div className="col-span-2 flex items-center">
                            <label className="text-[12px] font-[600] leading-4 text-neutral-500 font-inter">Multi Factor Authentication</label>
                        </div>
                        <div className="col-span-4 flex items-center gap-1 text-[13px] font-[600] leading-5 text-neutral-500 font-inter">
                            <Switch checked className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary-600 !opacity-100" disabled /> Enabled
                        </div>
                    </div>)}

                    <div className="grid grid-cols-6 gap-2">
                        <div className="col-span-2 flex items-center">
                            <label className="text-[12px] font-[600] leading-4 text-neutral-500 font-inter">Last Activity</label>
                        </div>
                        <div className="col-span-4 flex items-center text-[13px] font-[400] leading-5 text-neutral dark:text-neutral-100 font-inter">{user?.lastActivity ? moment(user.lastActivity).format('hh:mm A DD/MM/YYYY') : '-'}</div>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                        <div className="col-span-2 flex items-center">
                            <label className="text-[12px] font-[600] leading-4 text-neutral-500 font-inter">Created On</label>
                        </div>
                        <div className="col-span-4 flex items-center text-[13px] font-[400] leading-5 text-neutral dark:text-neutral-100 font-inter">{user?.createdAt ? moment(user.createdAt).format('hh:mm A DD/MM/YYYY') : '-'}</div>
                    </div>
                </div>
            </div>

            {user?.authMethod === AUTH_METHODS.Password && <SetPasswordModal />}
            {user?.authMethod === AUTH_METHODS.Password && <Dialog
                open={isOpenSuccessModal}
                onOpenChange={(open) => {
                    if (!open) {
                        handleClose();
                    }
                }}
                type={DialogType.SUCCESS}
                icon={
                    <img src={PSWDICON} alt="pswd" className="h-9 w-9 text-success" />
                }
                title="Password Updated!"
                description="Your password has been successfully reset!"
                actions={[
                    {
                        label: "Close",
                        variant: "ghost",
                        onClick: handleClose
                    },

                ]}
            />}
        </div>
    );
} 