import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ERPLogo from '@/assets/icons/about-sspm-logo.svg';
import MonitoringIcon from '@/assets/icons/continuous-monitoring-icon.svg';
import RiskIcon from '@/assets/icons/risk-prioritization-icon.svg';
import RemediationIcon from '@/assets/icons/automated-remediation-icon.svg';
import VisibilityIcon from '@/assets/icons/cross-app-visibility-icon.svg';
import CardOverlayVisual from '@/assets/icons/rounded-visual.svg';

export default function About() {
    return (
        <div className="h-full pb-10">

            {/* Hero Section */}
            <div className="relative gap-5 bg-neutral-300 bg-opacity-50 rounded-[12px] h-21 mb-15 border-b-1 border-primary-100">
                <Avatar className="absolute left-7 top-7 h-25 w-25 rounded-[8px] border-2 border-[#E1E2F9] p-1 bg-white">
                    <AvatarImage src={ERPLogo} className="p-0" />
                    <AvatarFallback className="rounded-xl bg-primary text-white">SS</AvatarFallback>
                </Avatar>
                <div className='relative flex items-center justify-center h-full w-full overflow-hidden rounded-[12px]'>
                    <img src={CardOverlayVisual} alt="Download" className="absolute top-0 right-0" />
                    <div className="flex items-center gap-1">
                        <span className="text-[16px] leading-5 font-[600] text-neutral font-inter">SaaS Security So Smooth, It's </span>
                        <span className="text-[16px] leading-5 font-[600] text-primary font-inter">Almost Unfair</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mt-5 pl-7">
                <div className="flex items-center gap-2 mb-3.5">
                    <h1 className="text-[20px] font-[600] leading-7 text-neutral font-inter">ERP v1.7.3</h1>
                </div>
                <p className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                    ERP is a <span className="font-[600]">SaaS Security Posture Management (ERP)</span> platform that helps businesses securely adopt and manage cloud applications. We continuously monitor your SaaS ecosystem (like Appian, Google Workspace, Microsoft 365 etc.) to:
                </p>
                <ul className="list-disc pl-6 mt-1 flex flex-col">
                    <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                        <span className="font-[600]">Find and fix misconfigurations</span> before they become breaches
                    </li>
                    <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                        <span className="font-[600]">Enforce compliance</span> with standards like GDPR, HIPAA, and SOC 2
                    </li>
                    <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                        <span className="font-[600]">Automate security checks</span> so your team can focus on strategic work
                    </li>
                </ul>
                <p className="mt-4 text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                    Unlike traditional tools, we specialize in <span className="font-[600]">SaaS-native risks</span>—overprivileged users, exposed data, shadow IT, and more—giving you visibility where traditional security tools fall short.
                </p>
            </div>

            {/* Why It Matters */}
            <div className="mt-5 pl-7">
                <h3 className="text-[13px] font-[600] leading-5 text-neutral font-inter mb-1">Why It Matters</h3>
                <p className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                    With teams using 100+ cloud apps, manual security reviews can't keep up. ERP acts as your 24/7 SaaS security guard, detecting risks in real time and guiding you to remediate them fast.
                </p>
            </div>

            {/* Key Features */}
            <div className="mt-5 pl-7">
                <h3 className="text-[13px] font-[600] leading-5 text-neutral font-inter mb-1">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="p-5 bg-white rounded-[12px] border border-[#E4E4E8] shadow-[0px_1px_2px_0px_#1018280D]">
                        <Avatar className="h-8 w-8 rounded-[9px] border-1 border-[#E4E4E8] p-0.5">
                            <AvatarImage src={MonitoringIcon} className='rounded-[7px] bg-[#F4F4F6] p-1' />
                            <AvatarFallback className="rounded-[10px] bg-[#F4F4F6]">M</AvatarFallback>
                        </Avatar>
                        <div className="mt-4">
                            <h4 className="text-[16px] font-[600] leading-6 text-neutral font-inter mb-1">Continuous Monitoring</h4>
                            <p className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                                Always-on checks for configurations, permissions, and access.
                            </p>
                        </div>
                    </div>

                    <div className="p-5 bg-white rounded-[12px] border border-[#E4E4E8] shadow-[0px_1px_2px_0px_#1018280D]">
                        <Avatar className="h-8 w-8 rounded-[9px] border-1 border-[#E4E4E8] p-0.5">
                            <AvatarImage src={RiskIcon} className='rounded-[7px] bg-[#F4F4F6] p-1' />
                            <AvatarFallback className="rounded-[10px] bg-[#F4F4F6]">R</AvatarFallback>
                        </Avatar>
                        <div className="mt-4">
                            <h4 className="text-[16px] font-[600] leading-6 text-neutral font-inter mb-1">Risk Prioritization</h4>
                            <p className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                                Focus on critical issues with severity scoring.
                            </p>
                        </div>
                    </div>

                    <div className="p-5 bg-white rounded-[12px] border border-[#E4E4E8] shadow-[0px_1px_2px_0px_#1018280D]">
                        <Avatar className="h-8 w-8 rounded-[9px] border-1 border-[#E4E4E8] p-0.5">
                            <AvatarImage src={RemediationIcon} className='rounded-[7px] bg-[#F4F4F6] p-1' />
                            <AvatarFallback className="rounded-[10px] bg-[#F4F4F6]">A</AvatarFallback>
                        </Avatar>
                        <div className="mt-4">
                            <h4 className="text-[16px] font-[600] leading-6 text-neutral font-inter mb-1">Automated Remediation</h4>
                            <p className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                                One-click fixes for common problems.
                            </p>
                        </div>
                    </div>

                    <div className="p-5 bg-white rounded-[12px] border border-[#E4E4E8] shadow-[0px_1px_2px_0px_#1018280D]">
                        <Avatar className="h-8 w-8 rounded-[9px] border-1 border-[#E4E4E8] p-0.5">
                            <AvatarImage src={VisibilityIcon} className='rounded-[7px] bg-[#F4F4F6] p-1' />
                            <AvatarFallback className="rounded-[10px] bg-[#F4F4F6]">V</AvatarFallback>
                        </Avatar>
                        <div className="mt-4">
                            <h4 className="text-[16px] font-[600] leading-6 text-neutral font-inter mb-1">Cross-App Visibility</h4>
                            <p className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                                Unified dashboard for all integrated SaaS tools.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Who It's For */}
            <div className="mt-5 pl-7">
                <h3 className="text-[13px] font-[600] leading-5 text-neutral font-inter mb-1">Who It's For</h3>
                <ul className="list-disc pl-6 flex flex-col gap-1">
                    <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                        <span className="font-[600]">Security Teams:</span> Replace spreadsheets with automated audits
                    </li>
                    <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                        <span className="font-[600]">IT Admins:</span> Simplify compliance across cloud apps
                    </li>
                    <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                        <span className="font-[600]">Executives:</span> Get a clear picture of SaaS risks
                    </li>
                </ul>
            </div>
        </div>
    );
} 