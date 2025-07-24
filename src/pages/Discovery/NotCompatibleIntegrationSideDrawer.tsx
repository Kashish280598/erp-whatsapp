/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SideDrawer } from '@/components/custom/SideDrawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { closeNotCompatibleIntegrationSideDrawer } from '@/lib/features/discovery/discoverySlice';
import SeverityChip from '@/components/custom/SeverityChip';
import CheckupDiagnostic from '@/assets/icons/Checkup-Diagnostic.svg';
import ArrangeListAscending from '@/assets/icons/Arrange-List-Ascending.svg';
import CloudEndureMigrationAutomatedMass from '@/assets/icons/Cloud-Endure-Migration-Automated-Mass.svg';
import PhoneActionShield from '@/assets/icons/Phone-Action-Shield.svg';

const scanCoverage = [
    {
        name: 'Scan Coverage',
        description: 'Frequency and depth of SAST/SCA scans.',
        icon: CheckupDiagnostic,
    },
    {
        name: 'Vulnerability Backlog',
        description: 'Open critical/high-severity issues.',
        icon: ArrangeListAscending,
    },
    {
        name: 'Compliance Gaps',
        description: 'Deviations from OWASP Top 10, PCI-DSS.',
        icon: CloudEndureMigrationAutomatedMass,
    },
    {
        name: 'Remediation Rate',
        description: 'Time to fix high-risk vulnerabilities.',
        icon: PhoneActionShield,
    },
]

export default function NotCompatibleIntegrationSideDrawer() {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(state => state.discovery.notCompatibleIntegration.isOpen);
    const selectedIntegration = useAppSelector(state => state.discovery.notCompatibleIntegration.selectedIntegration);

    const handleClose = () => {
        dispatch(closeNotCompatibleIntegrationSideDrawer());
    };

    return (
        <SideDrawer
            header={(
                <div className='mr-auto relative flex items-center gap-3 p-2 px-3.5 top-8'>
                    <Avatar className="h-17 w-17 rounded-[10.2px] border-[1.7px] border-neutral-200 p-0 bg-white flex items-center justify-center">
                        <AvatarImage src={selectedIntegration?.logo} className='rounded-[6.8px] h-[57.8px] w-[57.8px]' />
                        <AvatarFallback className="rounded-[0px] bg-white text-gray-600 text-[24px] flex items-center justify-center">
                            {selectedIntegration?.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}
            open={isOpen}
            onClose={handleClose}
            className="!max-w-[90vw] !w-[1000px]  px-0 pt-5 pb-0 bg-white"
            type={"warning"}
            headerClassName="!mb-0 mx-1.5 pl-0"
        >
            <div className='overflow-auto pb-0 custom-scrollbar'>
                <div className='mx-5 mt-4'>
                    <div className='flex items-end justify-between gap-2'>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-[24px] font-[600] leading-7.5 text-neutral font-inter'>{selectedIntegration?.name}</h1>
                            <span className='text-neutral-500 text-sm leading-5 font-inter'>{selectedIntegration?.description}</span>
                        </div>
                        <div className='flex justify-end gap-4'>
                            <SeverityChip title={selectedIntegration?.riskCategory || ''} type={selectedIntegration?.riskCategory as 'critical' | 'high' | 'medium' | 'low'} />
                            <div className={`flex items-center gap-1.5 px-2 pl-1.5 py-0.5 rounded-[8px] transition-colors duration-200 bg-primary-300`}>
                                <div className={`w-2 h-2 rounded-[3px] transition-colors duration-200 bg-error`} />
                                <span className="text-[13px] leading-5 font-[400] text-neutral text-nowrap capitalize">
                                    Not Compatible
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <h2 className='text-neutral text-sm leading-5 font-inter mb-1'>Risk Rating Calculation</h2>
                        <div className='flex items-center gap-1'>
                            <span className='text-neutral-500 text-sm leading-5 font-inter'>{selectedIntegration?.name}'s risk score</span>
                            <SeverityChip title={selectedIntegration?.riskCategory || ''} type={selectedIntegration?.riskCategory as 'critical' | 'high' | 'medium' | 'low'} />
                            <span className='text-neutral-500 text-sm leading-5 font-inter'>is based on:</span>
                        </div>
                    </div>
                    <div className='mt-3 grid grid-cols-4 gap-5'>
                        {scanCoverage.map((item, index) => (
                            <div className="overflow-hidden flex-1 p-3 bg-white rounded-[12px] border border-neutral-200 shadow-[0px_1px_2px_0px_#1018280D] relative" key={index}>
                                <Avatar className="h-8 w-8 rounded-[8.73px] border-[0.73px] border-neutral-200 p-0 flex items-center justify-center">
                                    <AvatarImage src={item.icon} className='rounded-[7.27px] bg-primary-300 h-[26.18px] w-[26.18px]' />
                                    <AvatarFallback className="rounded-[10px] bg-primary-300 text-white">
                                        D
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-1 mt-4">
                                    <h4 className="text-[16px] font-[600] leading-6 text-neutral font-inter">
                                        {item.name}
                                    </h4>
                                    <p className="text-[13px] leading-5 text-[#5E5F6E] font-[400] font-inter">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='mt-7.5'>
                        <h2 className='text-neutral text-sm leading-5 font-inter font-[600] mb-1'>
                            Why Connect to ERP?
                        </h2>
                        <ul className='list-disc list-inside pl-2'>
                            <li className='text-neutral-500 text-sm leading-5 font-inter font-[400]'>
                                <span className='relative -left-2'>
                                    <span className='font-[600] mr-1'>
                                        Unified Risk Visibility:
                                    </span>
                                    Correlate code vulnerabilities (Checkmarx) with misconfigurations (ERP) for full-stack insights.
                                </span>
                            </li>
                            <li className='text-neutral-500 text-sm leading-5 font-inter font-[400]'>
                                <span className='relative -left-2'>
                                    <span className='font-[600] mr-1'>
                                        Prioritize Critical Risks:
                                    </span>
                                    ERP auto-tags Checkmarx findings that impact live SaaS configurations (e.g., exposed APIs).
                                </span>
                            </li>
                            <li className='text-neutral-500 text-sm leading-5 font-inter font-[400]'>
                                <span className='relative -left-2'>
                                    <span className='font-[600] mr-1'>
                                        Automate Compliance:
                                    </span>
                                    Map Checkmarx results to frameworks like SOC 2 or GDPR in ERP’s dashboard.
                                </span>
                            </li>
                            <li className='text-neutral-500 text-sm leading-5 font-inter font-[400]'>
                                <span className='relative -left-2'>
                                    <span className='font-[600] mr-1'>
                                        Accelerate Remediation:
                                    </span>
                                    Trigger ERP workflows to auto-fix misconfigurations linked to Checkmarx findings.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='p-5 mt-4 bg-primary-300 flex flex-col gap-3 mb-5'>
                    <div className='flex items-center gap-3'>
                        <h2 className='text-neutral text-sm leading-5 font-inter font-[600] mb-1'>Compatibility:</h2>
                        <div className={`flex items-center gap-1.5 px-2 pl-1.5 py-0.5 rounded-[8px] transition-colors duration-200 bg-white`}>
                            <div className={`w-2 h-2 rounded-[3px] transition-colors duration-200 bg-error`} />
                            <span className="text-[13px] leading-5 font-[400] text-neutral text-nowrap capitalize">
                                Not Compatible
                            </span>
                        </div>
                    </div>
                    <span className='text-neutral-500 text-sm leading-5 font-inter'>
                        ERP can't directly sync with {selectedIntegration?.name} yet.
                    </span>
                </div>
            </div>
        </SideDrawer >
    );
}