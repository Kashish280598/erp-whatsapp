import { SideDrawer } from '@/components/custom/SideDrawer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { closeDeleteUserModal, closeEditDrawer, deleteUser, editUserById, openDeleteUserModal, openUserActivationModal, updateInvitationById } from '@/lib/features/settings/settingsSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { Switch } from '@/components/ui/switch';
import type { UpdateUserByIdRequestPayload } from '@/types/user.type';
import { toast } from 'sonner';
import { isAdminUser, parseFullName } from '@/lib/utils';
import { useLoading } from '@/hooks/useAppState';
import { API_ENDPOINTS } from '@/lib/api/config';
import { Loader2 } from 'lucide-react';
import { AUTH_METHODS } from '@/utils/constant';

const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    role: Yup.string().required('Role is required'),
});

export default function EditUserDetailsSideDrawer() {
    const dispatch = useAppDispatch();
    const { user: AdminUser } = useAppSelector((state) => state.auth);
    const { isOpen, selectedUser, isDelete } = useAppSelector((state) => state.settings.editUser);
    const { isLoading: editLoading } = useLoading(API_ENDPOINTS.users.editUserById);
    const { isLoading: inviteEditLoading } = useLoading(API_ENDPOINTS.users.updateInvitationById);
    const { isLoading: isDeleteLoading } = useLoading(API_ENDPOINTS.users.deleteUser);
    const isInviteTab = selectedUser?.isInviteTab || false;
    const isLoading = editLoading || inviteEditLoading;
    const canPerformActions = isAdminUser() //&& AdminUser?.id !== selectedUser?.id;

    const formik = useFormik({
        initialValues: {
            firstName: selectedUser?.firstName || '',
            lastName: selectedUser?.lastName || '',
            email: selectedUser?.email || '',
            role: selectedUser?.role || '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (canPerformActions) {
                const payload: UpdateUserByIdRequestPayload = {
                    name: `${values.firstName} ${values.lastName}`,
                    role: values.role,
                    ...(isInviteTab ? { email: values.email } : {})
                };
                if (selectedUser?.id) {
                    if (isInviteTab)
                        dispatch(updateInvitationById({ userId: selectedUser.id, payload }));
                    else
                        dispatch(editUserById({ userId: selectedUser.id, payload }));
                }
                else
                    toast.error('User ID is not available for editing.');
            }
        },
    });

    const handleOpenDeleteUserModal = () => {
        dispatch(openDeleteUserModal());
    };

    const handleCloseDeleteUserModal = () => {
        dispatch(closeDeleteUserModal());
    };

    const handleDeleteUser = () => {
        dispatch(deleteUser(selectedUser?.id || ''));
    };

    const changeActivationStatus = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        dispatch(openUserActivationModal(selectedUser));
    };

    const { firstName: invitedByFirstName, lastName: invitedByLastName } = parseFullName(isInviteTab ? selectedUser?.inviterName || '' : selectedUser?.invitedBy?.name || '');

    return (
        <SideDrawer
            header={(
                <div className='w-full relative flex items-center gap-2 p-3'>
                    <Avatar className="h-11.5 w-11.5 rounded-[8px] border-2 border-[#E4E4E8] p-0 bg-white flex items-center justify-center">
                        <AvatarFallback className="rounded-[0px] bg-white text-primary text-[16px] font-[400] leading-7 flex items-center justify-center">
                            {`${selectedUser?.firstName?.[0] || ''}${selectedUser?.lastName?.[0] || ''}`.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {isDelete ? (
                        <div>
                            <span className='text-[24px] font-[600] leading-9 text-neutral font-inter'>Delete user {selectedUser?.name}?</span>
                        </div>
                    ) : (
                        <div>
                            <span className='text-[24px] font-[600] leading-9 text-neutral font-inter'>{selectedUser?.name}</span>
                            {isInviteTab ? (
                                <div className='flex items-center gap-1'>
                                    <span className='text-[12px] font-[600] leading-4 text-neutral-500'>Invited At: </span>
                                    <span className='text-[13px] font-[400] leading-4 text-neutral flex items-center gap-2'>
                                        {moment(selectedUser?.createdAt).format('hh:mm A')}
                                        <span className="h-[4px] w-[4px] bg-neutral rounded-full" />
                                        {moment(selectedUser?.createdAt).format('DD/MM/YYYY')}
                                    </span>
                                </div>
                            ) : (<div className='flex items-center gap-1'>
                                <span className='text-[12px] font-[600] leading-4 text-neutral-500'>Last Active: </span>
                                <span className='text-[13px] font-[400] leading-4 text-neutral flex items-center gap-2'>
                                    {moment(selectedUser?.lastActivity).format('hh:mm A')}
                                    <span className="h-[4px] w-[4px] bg-neutral rounded-full" />
                                    {moment(selectedUser?.lastActivity).format('DD/MM/YYYY')}
                                </span>
                            </div>)}
                        </div>
                    )}
                    {canPerformActions && AdminUser?.id !== selectedUser?.id && (!isDelete && !isInviteTab) && <div className='ml-auto flex items-center gap-4'>
                        <Switch
                            className="data-[state=checked]:bg-success data-[state=unchecked]:bg-neutral-400 !opacity-100 cursor-pointer"
                            checked={selectedUser?.active}
                            onClick={changeActivationStatus}
                        /> <span className={`text-[13px] font-[600] leading-5 ${selectedUser?.active ? 'text-success' : 'text-neutral-500'}`}>{selectedUser?.active ? 'Active' : 'In-Active'}</span>
                        <Button variant="outline-destructive" className="h-9 w-24.5" onClick={handleOpenDeleteUserModal}>
                            Delete User
                        </Button>
                    </div>}
                </div>
            )}
            open={isOpen}
            onClose={() => dispatch(closeEditDrawer())}
            className="!max-w-[648px] px-0 pt-5 pb-0"
            type={isDelete ? 'error' : 'info'}
            headerClassName="!mb-0 mx-5"
            isVisibleBackButton={isDelete}
            backButtonText='Back to User Details'
            onBackButtonClick={handleCloseDeleteUserModal}
        >
            {isDelete ? (
                <div className='flex flex-col pt-3 relative h-full overflow-auto pb-0 custom-scrollbar'>
                    <div className="flex flex-col px-5 mb-5">
                        <span className='text-[13px] font-[400] leading-5 text-neutral'>
                            You're about to permanently remove {selectedUser?.name} ({selectedUser?.email}) from the platform.
                        </span>
                        <span className='text-[13px] font-[400] leading-5 text-neutral'>
                            What happens next?
                        </span>
                        <ul className='list-disc  mt-1 pl-5 text-[13px] font-[400] leading-5 text-neutral'>
                            <li>User loses all access immediately.</li>
                            <li>Comments/activity remain but will show as "Deleted User".</li>
                            <li>Audit logs preserve actions taken by this user.</li>
                        </ul>
                    </div>
                    <p className='px-5 text-[13px] font-[400] leading-5 text-neutral'>
                        {`To restore access later, simply re-invite the user via User Management > Invite Users using their original email address. Note that all permissions will need to be reassigned, and a new activation link will be sent. Audit logs will preserve both the deletion and re-invitation events.`}
                    </p>

                    <div className="flex justify-end gap-3 bg-error-100 sticky bottom-0 py-5 px-5 mt-auto">
                        <Button
                            disabled={isDeleteLoading}
                            type="button"
                            variant="outline"
                            className="w-fit text-[13px] font-[600] text-primary leading-5 border-primary py-2 px-3 rounded-[8px]"
                            onClick={handleCloseDeleteUserModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={isDeleteLoading}
                            className="w-fit text-[13px] font-[600] text-white leading-5 py-2 px-3 rounded-[8px]"
                            onClick={handleDeleteUser}
                        >
                            {isDeleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>Delete User</span>
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={formik.handleSubmit} className="flex flex-col pt-3 relative h-full overflow-auto pb-0 custom-scrollbar">
                    <div className="flex flex-col gap-5 px-5 mb-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <Input
                                    label="First Name"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    value={formik.values.firstName}
                                    onChange={(e) => {
                                        e.target.value = e.target.value?.trimStart();
                                        formik.handleChange(e);
                                    }}
                                    onBlur={formik.handleBlur}
                                    className="!h-8 w-full"
                                    disabled={!canPerformActions}
                                    // @ts-ignore
                                    error={formik.touched.firstName && formik.errors.firstName}
                                />
                            </div>
                            <div className="flex flex-col">
                                <Input
                                    label="Last Name"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    value={formik.values.lastName}
                                    onChange={(e) => {
                                        e.target.value = e.target.value?.trimStart();
                                        formik.handleChange(e);
                                    }}
                                    onBlur={formik.handleBlur}
                                    className="!h-8 w-full"
                                    // @ts-ignore
                                    error={formik.touched.lastName && formik.errors.lastName}
                                    disabled={!canPerformActions}
                                />
                            </div>
                            <div className="flex flex-col">
                                <Input
                                    label="Email"
                                    id="email"
                                    disabled={!isInviteTab || !canPerformActions}
                                    name="email"
                                    placeholder="Enter email address"
                                    value={formik.values.email}
                                    onChange={(e) => {
                                        e.target.value = e.target.value?.trimStart();
                                        formik.handleChange(e);
                                    }}
                                    onBlur={formik.handleBlur}
                                    className="!h-8 w-full"
                                    // @ts-ignore
                                    error={formik.touched.email && formik.errors.email}
                                />
                            </div>
                            <div className="flex flex-col pt-1">
                                <label htmlFor="role" className="block text-[13px] font-[600] text-neutral-500 leading-4 mb-2">
                                    Role
                                </label>
                                <Select
                                    disabled={!canPerformActions || AdminUser?.id === selectedUser?.id}
                                    onValueChange={(value) => formik.setFieldValue('role', value)}
                                    defaultValue={formik.values.role}
                                >
                                    <SelectTrigger
                                        className={`!h-8 w-full border border-gray-300 font-[400] ${formik.touched.role && formik.errors.role
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                            : ''
                                            }`}
                                    >
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent align='end' className='w-50'>
                                        <SelectItem className={`cursor-pointer w-full ${formik.values.role === 'read-only' ? 'bg-secondary focus:bg-secondary' : ''}`} value="read-only">Read Only</SelectItem>
                                        <SelectItem className={`cursor-pointer w-full ${formik.values.role === 'admin' ? 'bg-secondary focus:bg-secondary' : ''}`} value="admin">Administrator</SelectItem>
                                    </SelectContent>
                                </Select>
                                {/* @ts-ignore */}
                                {formik.touched.role && formik.errors.role && (
                                    <p className="text-red-500 text-[12px] font-[400] leading-4 mt-1">
                                        {/* @ts-ignore */}
                                        {formik.errors.role}
                                    </p>
                                )}
                            </div>
                        </div>
                        {(!isInviteTab && selectedUser?.authMethod && selectedUser.authMethod === AUTH_METHODS.Password) && (
                            <div className='flex p-3 bg-success-100 rounded-[8px] items-center gap-2'>
                                <span className='h-[8px] w-[8px] bg-success rounded-[2px]' />
                                <span className='text-[12px] font-[600] leading-4 text-success'>
                                    2-FA Enabled
                                </span>
                                {/* Todo: Enable after BE Blocker resolved */}
                                {/* {canPerformActions && AdminUser?.id !== selectedUser?.id && (
                                    <Button variant="outline" className="h-9 w-15 px-3 py-2 text-primary text-[13px] font-[600] leading-5 border-primary rounded-[8px] ml-auto">
                                        Reset
                                    </Button>
                                )} */}
                            </div>
                        )}
                        <div className='flex flex-col gap-3'>
                            <span className='text-[12px] font-[600] leading-4 text-neutral-500'>Invited By</span>
                            {(selectedUser?.inviterName || selectedUser?.invitedBy?.name) ? (<div className='flex items-center gap-2'>
                                <Avatar className="h-6 w-6 rounded-[8px] border-none p-0 bg-primary-200 flex items-center justify-center">
                                    <AvatarFallback className="rounded-[0px] bg-primary-200 text-primary text-[12px] font-[400] leading-4 flex items-center justify-center">
                                        {`${invitedByFirstName?.[0]?.toUpperCase() || ''}${invitedByLastName?.[0]?.toUpperCase() || ''}` || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className='text-[13px] font-[400] leading-5 text-neutral'>
                                    {(isInviteTab ? selectedUser?.inviterName : selectedUser?.invitedBy?.name) || '-'}
                                </span>
                            </div>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <Avatar className="h-6 w-6 rounded-[8px] border-none p-0 bg-primary-200 flex items-center justify-center">
                                        <AvatarFallback className="rounded-[0px] bg-primary-200 text-primary text-[12px] font-[400] leading-4 flex items-center justify-center">
                                            DU
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className='text-[13px] font-[400] leading-5 text-neutral'>
                                        Deleted User
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {canPerformActions && (
                        <div className="flex justify-end gap-3 bg-[#F4F4F6] sticky bottom-0 py-5 px-5 mt-auto">
                            <Button
                                type="button"
                                disabled={isLoading}
                                variant="outline"
                                className="w-fit text-[13px] font-[600] text-primary leading-5 border-primary py-2 px-3 rounded-[8px] disabled:border-none disabled:text-white"
                                onClick={() => dispatch(closeEditDrawer())}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="default"
                                disabled={!formik.dirty || isLoading}
                                className="w-fit text-[13px] font-[600] text-white leading-5 py-2 px-3 rounded-[8px]"
                            >
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                <span>Save Changes</span>
                            </Button>
                        </div>
                    )}
                </form>)}
        </SideDrawer>
    );
}