/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SideDrawer } from '@/components/custom/SideDrawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { closeSupportedIntegrationSideDrawer } from '@/lib/features/discovery/discoverySlice';
import { useImageColor } from '@/hooks/useImageColor';
import { lightenHex } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import TabListContainer from '@/components/custom/TabListContainer';
import CloudLink from '@/assets/icons/cloud-link.svg';
import CheckupDiagnostic from '@/assets/icons/Checkup-Diagnostic.svg';
import ArrangeListAscending from '@/assets/icons/Arrange-List-Ascending.svg';
import CloudEndureMigrationAutomatedMass from '@/assets/icons/Cloud-Endure-Migration-Automated-Mass.svg';
import DynamicIntegrationForm from './DynamicIntegrationForm';
import type { FormDataPayload } from '@/types/integration.types';

const whyConnectCards = [
    {
        name: 'Continuous Security Monitoring',
        description: 'ERP automates misconfiguration detection in SaaS apps, spotting risks like public access and excessive permissions.',
        icon: CheckupDiagnostic,
    },
    {
        name: 'Unified Risk Visibility',
        description: 'Gain a consolidated view of security risks across all connected integrations, prioritized by severity and business impact.',
        icon: ArrangeListAscending,
    },
    {
        name: 'Streamlined Compliance',
        description: 'ERP simplifies compliance with standards by automatically mapping your configurations to regulatory requirements.',
        icon: CloudEndureMigrationAutomatedMass,
    },
    {
        name: 'Automated Remediation',
        description: 'Resolve common issues instantly with one-click fixes, such as restricting public access or enforcing MFA.',
        icon: CheckupDiagnostic,
    },
    {
        name: 'Sensitive Data Protection',
        description: 'Proactively secure critical assets, customer data, financial records, or intellectual property by identifying exposed data.',
        icon: ArrangeListAscending,
    }
];

const installationsSteps = {
    "data": {
        "heading": "Prerequisites",
        "prerequisites_steps": [
            {
                "title": "GitHub Enterprise Account",
                "description": "Enterprise account with Owner-level access."
            },
            {
                "title": "Permission to Create GitHub App",
                "description": "Ability to register a GitHub App in Enterprise Settings."
            }
        ],
        "installation_steps": {
            "heading": "Setup",
            "steps": [
                {
                    "step": "1",
                    "title": "Identify Enterprise Account",
                    "description": "Log in, open “Your enterprises,” choose the target Enterprise, and verify Owner privileges.",
                    "additional_steps": []
                },
                {
                    "step": "2",
                    "title": "Create GitHub App",
                    "description": "In Enterprise Settings → GitHub Apps, click “New GitHub App.” Supply the required fields, then click “Create GitHub App.”",
                    "additional_steps": [
                        {
                            "title": "GitHub App Name",
                            "description": "Unique integration name (e.g., Ashva GHApp Connection)."
                        },
                        {
                            "title": "Homepage URL",
                            "description": "Base URL for the application initiating the integration (e.g., http://127.0.0.1)."
                        }
                    ]
                },
                {
                    "step": "3",
                    "title": "Configure Permissions",
                    "description": "Disable webhooks if unused and set required scopes to read-only.",
                    "additional_steps": [
                        {
                            "title": "Repository Permissions",
                            "description": "Actions → Read-only, Administration → Read-only"
                        },
                        {
                            "title": "Organization Permissions",
                            "description": "Administration, Members, Personal Access Tokens, Secrets → Read-only"
                        }
                    ]
                },
                {
                    "step": "4",
                    "title": "Generate Credentials",
                    "description": "Copy the Client ID and generate a private-key (.pem) file; store it securely.",
                    "additional_steps": [
                        {
                            "title": "Client ID",
                            "description": "Used as the issuer (iss) claim in JWT generation."
                        },
                        {
                            "title": "Private Key (.pem)",
                            "description": "Used to sign the JWT with RS256."
                        }
                    ]
                },
                {
                    "step": "5",
                    "title": "Install the GitHub App",
                    "description": "Select “Install App” and complete installation for each organisation to be monitored.",
                    "additional_steps": []
                }
            ]
        },
        "resources": {
            "heading": "Media",
            "media_resources": []
        },
        "additional_content": {
            "heading": "Tips & Tricks",
            "content": []
        }
    }
};

const integrationFormData: FormDataPayload = {
    form_data: [
        {
            type: "textBox",
            label: "Integration Name",
            required: true,
            comment_required: false,
            image_required: false,
            action_required: false,
            is_new_row: false,
            min_length: 0,
            max_length: 0,
            placeholder: "Enter the integration display name",
            name: "integration_name",
            default_value: "",
            notes: "This is shown to users when configuring the tool.",
            grid: 6,
            is_options_available: false,
            is_placeholder_required: true,
            is_single_option: false,
            options: [],
            uuid: "f001"
        },
        {
            type: "textBox",
            label: "Integration Name",
            required: true,
            comment_required: false,
            image_required: false,
            action_required: false,
            is_new_row: false,
            min_length: 0,
            max_length: 0,
            placeholder: "Enter the integration display name",
            name: "integration_name",
            default_value: "",
            notes: "This is shown to users when configuring the tool.",
            grid: 6,
            is_options_available: false,
            is_placeholder_required: true,
            is_single_option: false,
            options: [],
            uuid: "f002"
        },
        {
            type: "textArea",
            label: "Integration Description",
            required: false,
            comment_required: false,
            image_required: false,
            action_required: false,
            is_new_row: false,
            min_length: 0,
            max_length: 500,
            placeholder: "Describe what this integration does",
            name: "integration_description",
            default_value: "",
            notes: "Optional: max 500 characters.",
            grid: 12,
            is_options_available: false,
            is_placeholder_required: true,
            is_single_option: false,
            options: [],
            uuid: "f003"
        },
        // --- New Field: Dropdown ---
        {
            type: "dropdown",
            label: "Region",
            required: true,
            comment_required: false,
            image_required: false,
            action_required: false,
            is_new_row: false,
            min_length: 0,
            max_length: 0,
            placeholder: "",
            name: "region",
            default_value: "",
            notes: "Select the regional data center",
            grid: 12,
            is_options_available: true,
            is_placeholder_required: false,
            is_single_option: true,
            options: [
                { option: "US" },
                { option: "EU" },
                { option: "APAC" }
            ],
            uuid: "f007"
        },
        {
            type: "checkBox",
            label: "Available Options",
            required: false,
            comment_required: false,
            image_required: false,
            action_required: false,
            is_new_row: false,
            min_length: 0,
            max_length: 0,
            placeholder: "",
            name: "integration_features",
            default_value: "",
            notes: "Check all that apply",
            grid: 12,
            is_options_available: true,
            is_placeholder_required: false,
            is_single_option: false,
            options: [
                { option: "Enable Auto Sync" },
                { option: "Notify on Changes" },
                { option: "Allow Admin Configuration" }
            ],
            uuid: "f004"
        },

        // --- New Field: Toggle ---
        {
            type: "toggle",
            label: "Enable Integration",
            required: false,
            comment_required: false,
            image_required: false,
            action_required: false,
            is_new_row: false,
            min_length: 0,
            max_length: 0,
            placeholder: "Toggle to activate or deactivate integration",
            name: "enable_integration",
            default_value: "",
            notes: "Turns integration on or off",
            grid: 12,
            is_options_available: false,
            is_placeholder_required: false,
            is_single_option: false,
            options: [],
            uuid: "f005"
        },

        // --- New Field: Radio ---
        {
            type: "radio",
            label: "Environment",
            required: true,
            comment_required: false,
            image_required: false,
            action_required: false,
            is_new_row: false,
            min_length: 0,
            max_length: 0,
            placeholder: "",
            name: "environment",
            default_value: "",
            notes: "Choose where the integration will run",
            grid: 12,
            is_options_available: true,
            is_placeholder_required: false,
            is_single_option: true,
            options: [
                { option: "Development" },
                { option: "Staging" },
                { option: "Production" }
            ],
            uuid: "f006"
        },
    ]
};

export default function SupportedIntegrationSideDrawer() {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(state => state.discovery.supportedIntegration.isOpen);
    const selectedIntegration = useAppSelector(state => state.discovery.supportedIntegration.selectedIntegration);
    const palette = useImageColor(selectedIntegration?.logo || '');
    const vibrant = palette?.Vibrant;
    const bgColor = vibrant?.hex ? lightenHex(vibrant.hex, 80) : '';

    const handleClose = () => {
        dispatch(closeSupportedIntegrationSideDrawer());
    };

    return (
        <SideDrawer
            header={(
                <div className='mr-auto relative flex items-center gap-3 p-0 px-0 top-8'>
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
            className="!w-[1000px] !max-w-[90vw] px-0 pt-5 pb-0 bg-white"
            type={"warning"}
            headerClassName={`!mb-0 mx-1.5 pl-0 transition-colors duration-300 p-0 pl-3.5 pt-0.5 pr-5`}
            headerStyle={{ backgroundColor: bgColor }}
        >
            <div className='pb-0 h-[calc(100%-120px)] flex flex-col overflow-auto custom-scrollbar mt-5'>
                <div className='mx-5 mt-4'>
                    <div className='flex items-end justify-between gap-2'>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-[24px] font-[600] leading-7.5 text-neutral font-inter'>{selectedIntegration?.name}</h1>
                            <span className='text-neutral-500 text-sm leading-4.5 font-inter'>{selectedIntegration?.description}</span>
                        </div>
                        <Button variant={'link'} className='flex items-center gap-1 !px-1.5 py-1 h-7'>
                            Instructions
                            <ExternalLink className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
                <div className='mt-5 flex-1'>
                    <Tabs
                        className="w-full h-full"
                        defaultValue='installations'
                    >
                        <div className='mx-5'>
                            <TabListContainer
                                tabsListClassName="gap-0"
                                tabs={[
                                    {
                                        label: 'Installations',
                                        value: 'installations',
                                        tabClassName: '!p-3'
                                    },
                                    {
                                        label: 'Why Connect?',
                                        value: 'why-connect',
                                        tabClassName: '!p-3'
                                    }
                                ]}
                            />
                        </div>
                        <TabsContent value="installations" className="pt-3 overflow-unset h-full">
                            <div className="flex pt-5 gap-5 px-5">
                                <div className='flex-1 pt-2.5'>
                                    <div className="flex flex-col gap-3">
                                        <div className='w-[61px] h-[61px] rounded-[50px] bg-primary-200 flex items-center justify-center'>
                                            <img src={CloudLink} alt="cloud-link" className="w-[25px] h-[25px]" />
                                        </div>
                                        <h1 className="text-[20px] font-[600] leading-6.5 text-neutral">Connect Integration</h1>
                                        <p className="text-[13px] font-[400] leading-4.5 text-neutral-500">Enter the required credentials to integrate ERP to your Asana workspace.</p>
                                        <div className='mt-5 pb-5'>
                                            <DynamicIntegrationForm form_data={integrationFormData.form_data} />
                                        </div>
                                    </div>
                                </div>

                                {/* Installation Guide */}
                                <div className='sticky top-0 flex-1 p-6 pr-2 pb-0 border-1 border-neutral-200 rounded-[10px] shadow-[0px_1px_2px_0px_#1018280D] max-h-[calc(100vh-320px)]'>
                                    <div className="custom-scrollbar-1 flex flex-col gap-4 max-h-[calc(100vh-350px)] overflow-auto pr-4">
                                        <h1 className="text-[20px] font-[600] leading-7 text-neutral">Installation Guide</h1>
                                        <h2 className="text-[16px] font-[600] leading-5 text-neutral">{installationsSteps.data.heading}</h2>

                                        {/* Prerequisites Steps */}
                                        {installationsSteps.data.prerequisites_steps.map((step) => {
                                            return (
                                                <div key={step.title} className="flex flex-col gap-1.5 pt-1.5">
                                                    <h1 className="text-[12px] font-[600] leading-4 text-neutral">{step.title}</h1>
                                                    <p className="text-[13px] font-[400] leading-4.5 text-neutral-500">{step.description}</p>
                                                </div>
                                            )
                                        })}

                                        {/* Installations Steps */}
                                        <div>
                                            <h1 className='text-[16px] font-[600] leading-5 text-neutral'>{installationsSteps.data.installation_steps.heading}</h1>
                                            <div className='relative mt-3'>
                                                {installationsSteps.data.installation_steps.steps.map((step, index) => (
                                                    <div key={index} className="relative flex items-start gap-3 pb-4">
                                                        {index !== (installationsSteps.data.installation_steps.steps.length - 1) && <div className='absolute top-0 left-[13px] h-full border-1 border-primary-300' />}
                                                        <div className="relative flex items-center justify-center w-7 h-7 bg-primary-200 rounded-[8px]">
                                                            <span className="text-primary font-[400] text-[13px] leading-5">{step.step}</span>
                                                        </div>
                                                        <div className="relative flex-1 mt-1.5">
                                                            <h2 className="text-[13px] font-[600] leading-5 text-neutral">{step.title}</h2>
                                                            <p className="text-[13px] font-[400] leading-5 mt-1.5 text-neutral-500">{step.description}</p>
                                                            {step.additional_steps.length > 0 && (
                                                                <ul className="list-disc pl-5 mt-2">
                                                                    {step.additional_steps.map((additionalStep, idx) => (
                                                                        <li key={idx} className="text-[13px] font-[400] leading-5 text-neutral-500">
                                                                            <span className="font-[600]">{additionalStep.title}:</span> {additionalStep.description}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="why-connect" className="pt-3 overflow-hidden h-full">
                            <div className="flex flex-col gap-5 h-full overflow-auto custom-scrollbar px-5">
                                <h1 className="text-[20px] font-[600] leading-7 text-neutral">
                                    Why Connect?
                                </h1>
                                <div className="grid grid-cols-3 gap-5">
                                    {whyConnectCards.map((item, index) => (
                                        <div className="overflow-hidden flex-1 p-3 bg-white rounded-[12px] border border-neutral-200 shadow-[0px_1px_2px_0px_#1018280D] relative" key={`${item.name}-${index}`}>
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
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </SideDrawer >
    );
}