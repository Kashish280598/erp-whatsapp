import { Button } from '@/components/ui/button';
import { Dialog, DialogType } from '@/components/custom/Dialog';
import { Input } from '@/components/ui/input';
import PSWDICON from '@/assets/icons/pswd.svg';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { closeConfirmPasswordModal, openConfirmPasswordModal } from '@/lib/features/settings/settingsSlice';
import { useEffect, useState } from 'react';
import { verifyPassword } from '@/lib/features/auth/authSlice';
import { useLoading } from '@/hooks/useAppState';
import { API_ENDPOINTS } from '@/lib/api/config';

export default function ConfirmCurrentPasswordModal() {
    const dispatch = useAppDispatch();
    const { isOpen } = useAppSelector((state) => state.settings.confirmPasswordModal);
    const [password, setPassword] = useState('');
    const { user } = useAppSelector(state => state.auth);
    const { isLoading } = useLoading(API_ENDPOINTS.auth.verifyPassword);

    useEffect(() => {
        if (!isOpen) {
            setPassword('');
        }
        return () => {
            setPassword('');
        };
    }, [isOpen]);

    const handleVerify = () => {
        if (password) {
            dispatch(verifyPassword({ password, email: user?.email || '' }));
        }
    };

    const handleClose = () => {
        setPassword('');
        dispatch(closeConfirmPasswordModal());
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
            type={DialogType.DEFAULT}
            icon={
                <img src={PSWDICON} alt="pswd" className="h-9 w-9 text-primary" />
            }
            title="Verify your Identity"
            description="To reset your password, please confirm it's you by entering your current password."
            trigger={(
                <Button
                    variant="link"
                    className='w-fit h-fit p-0 text-[13px] leading-5 font-[600] text-primary hover:no-underline'
                    onClick={() => dispatch(openConfirmPasswordModal())}
                >
                    Reset Password
                </Button>
            )}
            actions={[
                {
                    label: "Cancel",
                    variant: "ghost",
                    disabled: isLoading,
                    onClick: handleClose
                },
                {
                    label: isLoading ? "Verifying..." : "Continue",
                    variant: "default",
                    onClick: handleVerify,
                    isLoading: isLoading,
                    disabled: !password || isLoading
                }
            ]}
        >
            <div className="mt-5">
                <Input
                    type="password"
                    label="Current Password"
                    placeholder="Enter your current password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="!h-9"
                />
            </div>
        </Dialog>
    );
}