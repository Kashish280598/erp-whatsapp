import { DialogType } from "@/components/custom/Dialog";
import { Dialog } from "@/components/custom/Dialog";
import { useAppSelector } from "@/lib/store";
import DialogIcon from "@/assets/icons/party-confetti.svg";
import { isAdminUser } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
export default function GetStartedDialog() {
    const { user } = useAppSelector(s => s.auth);
    const isAdmin = isAdminUser()
    const navigate = useNavigate();

    const handleClose = () => {
        // Remove all usage of toggleDiscoveryAllSet and related logic. Remove any imports, dispatches, or UI related to this endpoint.
    }

    const handleExploreDashboard = () => {
        navigate('/dashboard');
        // Remove all usage of toggleDiscoveryAllSet and related logic. Remove any imports, dispatches, or UI related to this endpoint.
    };

    const handleGetStarted = () => {
        // Remove all usage of toggleDiscoveryAllSet and related logic. Remove any imports, dispatches, or UI related to this endpoint.
    };

    const icon = <img src={DialogIcon} alt="Dialog Icon" className="!min-w-11 !min-h-11" />;

    return (
        <Dialog
            open={user?.showGuide}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
            isShowConfetti={true}
            type={DialogType.SUCCESS}
            icon={icon}
            title={`You're All Set!`}
            description={''}
            className="sm:max-w-[600px]"
            iconClassName="!min-w-11 !min-h-11"
            actions={[
                ...(isAdmin ? [{
                    label: "Explore Dashboard",
                    variant: "outline" as 'outline',
                    className: "border-1 border-primary text-primary",
                    onClick: handleExploreDashboard
                }] : []),
                {
                    label: "Get Started",
                    variant: "default",
                    onClick: handleGetStarted,
                    className: "border-1 border-primary"
                }
            ]}
        >
            <div className="flex flex-col gap-4 mt-4">
                <p className="text-[13px] font-[400] leading-5 text-neutral whi">
                    Welcome to <span className="font-[600]">ERP</span>! Your account is ready to secure your SaaS ecosystem.
                </p>
                {isAdmin && <div>
                    <p className="text-[13px] font-[600] leading-5 text-neutral-500">
                        Next Steps
                    </p>
                    <ol className="list-decimal list-inside mt-1 pl-2">
                        <li className="text-[13px] font-[400] leading-5 text-neutral">
                            Add your first integration (e.g., Appian, Salesforce)
                        </li>
                        <li className="text-[13px] font-[400] leading-5 text-neutral">
                            Configure scan
                        </li>
                        <li className="text-[13px] font-[400] leading-5 text-neutral">
                            Get findings
                        </li>
                    </ol>
                </div>}
            </div>
        </Dialog>
    )
}
