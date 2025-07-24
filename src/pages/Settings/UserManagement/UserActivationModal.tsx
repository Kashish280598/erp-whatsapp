import { DialogType } from "@/components/custom/Dialog";
import { Dialog } from "@/components/custom/Dialog";
import { closeUserActivationModal, toggleActiveUser } from "@/lib/features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useLoading } from "@/hooks/useAppState";
import { parseFullName } from "@/lib/utils";
import { API_ENDPOINTS } from "@/lib/api/config";

export default function UserActivationModal() {
    const dispatch = useAppDispatch();
    const { isOpen, selectedUser } = useAppSelector((state) => state.settings.userActivation);
    const { isLoading } = useLoading(API_ENDPOINTS.users.toggleActiveUser);

    const handleClose = () => {
        dispatch(closeUserActivationModal());
    };

    if (!selectedUser) return null;
    const { firstName, lastName } = parseFullName(selectedUser.name);
    const userInitials = `${firstName?.charAt(0)?.toUpperCase()}${lastName?.charAt(0)?.toUpperCase()}`;
    const isActive = selectedUser.active;

    const handleToggleStatus = () => {
        dispatch(toggleActiveUser(selectedUser.id));
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
            type={isActive ? DialogType.ERROR : DialogType.SUCCESS}
            iconInitials={userInitials}
            title={`${isActive ? 'Deactivate' : 'Activate'} ${selectedUser.name} user?`}
            description={`Are you sure you want to ${isActive ? 'deactivate' : 'activate'} ${selectedUser.name} (${selectedUser.email})?`}
            actions={[
                {
                    label: "Cancel",
                    variant: "ghost",
                    disabled: isLoading,
                    onClick: () => handleClose()
                },
                {
                    label: isActive ? "Deactivate" : "Activate",
                    variant: isActive ? "destructive" : "default",
                    disabled: isLoading,
                    isLoading: isLoading,
                    onClick: () => {
                        // TODO: Add activation/deactivation logic here
                        handleToggleStatus();
                    }
                }
            ]}
        />
    )
}
