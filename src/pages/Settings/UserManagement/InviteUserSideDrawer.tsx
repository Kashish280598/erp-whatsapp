/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { closeInviteUserDrawer, inviteUsers, setAlreadyInvitedUsers } from '@/lib/features/settings/settingsSlice';
import { useEffect } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { DialogClose } from '@/components/ui/dialog';
import { SideDrawer } from '@/components/custom/SideDrawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import InviteUserIcon from '@/assets/icons/invite-user.svg';
import type { InviteUserRequestPayload } from '@/types/user.type';
import { useLoading } from '@/hooks/useAppState';
import { API_ENDPOINTS } from '@/lib/api/config';
import { Loader2 } from "lucide-react";

const validationSchema = Yup.object({
    users: Yup.array().of(
        Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            role: Yup.string().required('Role is required'),
        })
    ).max(5, 'You can only add up to 5 users'),
});

interface UserForm {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

const initialUser: UserForm = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
};

export default function InviteUserSideDrawer() {
    const dispatch = useAppDispatch();
    const { isOpen } = useAppSelector((state) => state.settings.inviteUser);
    const { isLoading } = useLoading(API_ENDPOINTS.users.inviteUsers);
    const { alreadyInvitedUsers } = useAppSelector(state => state.settings);

    const formik = useFormik({
        initialValues: {
            users: [initialUser],
        },
        validationSchema,
        onSubmit: async (values) => {
            const payload: InviteUserRequestPayload = {
                invitations: values.users.filter(a => a).map(user => ({
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    role: user.role,
                }))
            };
            dispatch(inviteUsers({ payload }));
        },
    });

    useEffect(() => {
        return () => {
            dispatch(closeInviteUserDrawer());
        };
    }, [dispatch]);

    useEffect(() => {
        if (!isOpen) formik.resetForm();
    }, [isOpen]);

    useEffect(() => {
        if (alreadyInvitedUsers?.length) {
            alreadyInvitedUsers.map(user => {
                const ind = formik.values.users?.findIndex(a => a?.email === user?.email);
                if (ind >= 0)
                    delete formik.values?.users?.[ind];
            });
            dispatch(setAlreadyInvitedUsers([]));
        }
    }, [alreadyInvitedUsers]);

    return (
        <SideDrawer
            header={(
                <div className='mr-auto relative flex items-center gap-3 p-2'>
                    <Avatar className="h-11.5 w-11.5 rounded-[12px] border-2 border-[#E4E4E8] p-0 bg-white flex items-center justify-center">
                        <AvatarImage src={InviteUserIcon} className='rounded-[0px] h-5.5 w-5.5' />
                        <AvatarFallback className="rounded-[0px] bg-white text-gray-600 text-[24px] flex items-center justify-center">
                            {"I"}
                        </AvatarFallback>
                    </Avatar>
                    <span className='text-[24px] font-[600] leading-9 text-neutral font-inter'>Invite New User</span>
                </div>
            )}
            open={isOpen}
            onClose={() => dispatch(closeInviteUserDrawer())}
            className="!max-w-[802px] px-0 pt-5 pb-0"
            type={"info"}
            headerClassName="!mb-0 mx-5"
        >
            <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit} className="flex flex-col pt-3 relative h-full overflow-auto pb-0 custom-scrollbar">
                    <FieldArray
                        name="users"
                        render={arrayHelpers => (
                            <div className="flex flex-col gap-5 px-5 mb-5">
                                {formik.values.users.map((user, index) => (
                                    <div key={index} className={`relative border border-neutral-200 rounded-[10px] p-3 ${formik.values.users.length !== (index + 1) ? 'bg-neutral-300' : ''}`}>
                                        {formik.values.users?.filter(a => a)?.length > 1 && (
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant={'destructive'}
                                                className="h-8 w-8 !shadow-none bg-error-100 absolute -right-3 -top-3 hover:bg-error-200"
                                                onClick={() => arrayHelpers.remove(index)}
                                            >
                                                <IconTrash className="h-4 w-4 text-error" />
                                            </Button>
                                        )}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <Input
                                                    label="First Name"
                                                    id={`users.${index}.firstName`}
                                                    name={`users.${index}.firstName`}
                                                    placeholder="Enter first name"
                                                    value={user.firstName}
                                                    onChange={(e) => {
                                                        e.target.value = e.target.value?.trimStart();
                                                        formik.handleChange(e);
                                                    }}
                                                    className="!h-8 w-full"
                                                    onBlur={formik.handleBlur}
                                                    // @ts-ignore
                                                    error={formik.touched.users?.[index]?.firstName && formik.errors.users?.[index]?.firstName}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <Input
                                                    label="Last Name"
                                                    id={`users.${index}.lastName`}
                                                    name={`users.${index}.lastName`}
                                                    placeholder="Enter last name"
                                                    value={user.lastName}
                                                    onChange={(e) => {
                                                        e.target.value = e.target.value?.trimStart();
                                                        formik.handleChange(e);
                                                    }}
                                                    className="!h-8 w-full"
                                                    onBlur={formik.handleBlur}
                                                    // @ts-ignore
                                                    error={formik.touched.users?.[index]?.lastName && formik.errors.users?.[index]?.lastName}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <Input
                                                    label="Email"
                                                    id={`users.${index}.email`}
                                                    name={`users.${index}.email`}
                                                    placeholder="Enter email address"
                                                    value={user.email}
                                                    onChange={(e) => {
                                                        e.target.value = e.target.value?.trimStart();
                                                        formik.handleChange(e);
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    className="!h-8 w-full"
                                                    // @ts-ignore
                                                    error={formik.touched.users?.[index]?.email && formik.errors.users?.[index]?.email}
                                                />
                                            </div>
                                            <div className="flex flex-col pt-1">
                                                <label htmlFor={`users.${index}.role`} className="block text-[13px] font-[600] text-neutral-500 leading-4 mb-2">
                                                    Role
                                                </label>
                                                <Select
                                                    onValueChange={(value) => formik.setFieldValue(`users.${index}.role`, value)}
                                                    defaultValue={user.role}
                                                >
                                                    <SelectTrigger
                                                        // @ts-ignore
                                                        className={`bg-white !h-8 w-full border border-gray-300 font-[400] ${formik.touched.users?.[index]?.role && formik.errors.users?.[index]?.role ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent align='end' className='w-50'>
                                                        <SelectItem className={`cursor-pointer w-full ${user.role === 'read-only' ? 'bg-secondary focus:bg-secondary' : ''}`} value="read-only">Read Only</SelectItem>
                                                        <SelectItem className={`cursor-pointer w-full ${user.role === 'admin' ? 'bg-secondary focus:bg-secondary' : ''}`} value="admin">Administrator</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {/* @ts-ignore */}
                                                {formik.touched.users?.[index]?.role && formik.errors.users?.[index]?.role && (
                                                    <p className="text-red-500 text-[12px] font-[400] leading-4 mt-1">
                                                        {/* @ts-ignore */}
                                                        {formik.errors.users?.[index]?.role}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {formik.values.users.length < 5 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-fit text-[13px] font-[600] text-primary leading-5 border-primary py-2 px-3 rounded-[8px]"
                                        onClick={() => arrayHelpers.push(initialUser)}
                                    >
                                        + Add
                                    </Button>
                                )}
                            </div>
                        )}
                    />
                    <div className="flex justify-end gap-3 bg-[#F4F4F6] sticky bottom-0 py-5 px-5 mt-auto">
                        <DialogClose>
                            <Button
                                disabled={isLoading}
                                type="button"
                                variant="outline"
                                className="w-fit text-[13px] font-[600] text-primary leading-5 border-primary py-2 px-3 rounded-[8px]"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant="default"
                            disabled={!formik.dirty || isLoading}
                            className="w-fit text-[13px] font-[600] text-white leading-5 py-2 px-3 rounded-[8px]"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>Send Invites</span>
                        </Button>
                    </div>
                </form>
            </FormikProvider>
        </SideDrawer>
    );
}