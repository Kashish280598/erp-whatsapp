import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { openNotCompatibleIntegrationSideDrawer, openSupportedIntegrationSideDrawer, setIsShowAll } from '@/lib/features/discovery/discoverySlice';
import { useAppDispatch } from '@/lib/store';
import type { Integration } from '@/types/integration.types';
import { ChevronDownIcon, ChevronRightIcon, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Integrations: Integration[] = [
    {
        id: '1',
        name: 'Appian',
        logo: 'https://appian.com/etc.clientlibs/appian-aem/clientlibs/clientlib-appianaem-all/resources/icon-192x192.png',
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        sub: []
    },
    {
        id: '2',
        name: 'Confluence',
        logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png',
        riskCategory: "low",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        sub: []
    },
    {
        id: '3',
        name: 'Google Workspace',
        logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png',
        riskCategory: "high",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        sub: []
    },
    {
        id: '4',
        name: 'Microsoft 365',
        logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png',
        riskCategory: "medium",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
    },
    {
        id: '5',
        name: 'Asana',
        logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png',
        sub: [],
        riskCategory: "critical",
        isSupported: false,
        description: "Appian is a low-risk integration that is supported by ERP.",
    },
    {
        id: '6',
        name: 'AppOmni',
        logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png',
        sub: [],
        riskCategory: "critical",
        isSupported: false,
        description: "Appian is a low-risk integration that is supported by ERP.",
    },
    {
        id: '7',
        name: 'CheckMarx',
        logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png',
        sub: [],
        riskCategory: "critical",
        isSupported: false,
        description: "Appian is a low-risk integration that is supported by ERP.",
    },
    {
        id: '8',
        name: 'DataBricks',
        logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png',
        sub: [],
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
    },
    {
        id: '9',
        name: 'Duo',
        logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png',
        sub: [],
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
    },
    {
        id: '10',
        name: 'One Login',
        logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png',
        sub: [],
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
    },
    {
        id: '11',
        name: 'Auth 0',
        logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png',
        sub: [],
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
    },

]

export const Discovery = () => {
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleViewIntegration = (integration: Integration) => {
        if (integration.isSupported) {
            dispatch(openSupportedIntegrationSideDrawer(integration));
            !pathname.includes('/discover') && navigate('/discover');
            return;
        }
        dispatch(openNotCompatibleIntegrationSideDrawer(integration));
        !pathname.includes('/discover') && navigate('/discover');
    };
    
    const handleShowAll = () => {
        dispatch(setIsShowAll(true));
        !pathname.includes('/discover') && navigate('/discover');
    };

    return (
        <div>
            <Button
                onClick={handleShowAll}
                variant={'ghost'}
                className='w-[174px] justify-between items-center p-2 pr-3 font-[400] text-neutral-500 hover:bg-primary-300'>
                All Discoveries
                <ChevronDownIcon className='rotate-270' />
            </Button>
            <div className="my-4 h-[1px] bg-neutral-200" />
            <div className='flex flex-col gap-3'>
                <span className='uppercase text-[10px] font-[600] leading-3.5 text-neutral-500'>By Integrations</span>
                <Input
                    startIcon={<Search className="h-4 w-4" />}
                    placeholder={"Search by name"}
                    className="h-9 w-[174px]"
                />
                <Accordion type="single" collapsible className="flex flex-col gap-1 max-h-[calc(100vh-210px)] h-[476px] overflow-auto custom-scrollbar pr-3">
                    {
                        Integrations.map((integration: Integration) => (
                            <AccordionItem key={integration.name} value={integration.name} className="border-b-0 !cursor-pointer mb-1 w-[174px]">
                                {/* ${checkActiveNav('/settings/manage-account') ? 'bg-[#F4F4F6] text-neutral' : 'bg-transparent text-[#5E5F6E]'} */}
                                <AccordionTrigger
                                    onClick={() => handleViewIntegration(integration)}
                                    className={`!cursor-pointer  text-[13px] leading-[20px] font-[400] px-2 py-2 ${!integration?.sub?.length && '[&[data-state=open]>svg]:rotate-270 [&[data-state=closed]>svg]:rotate-270'} hover:bg-primary-300 [&[data-state=open]]:bg-[#F4F4F6] [&[data-state=open]]:text-neutral gap-0 items-center`}>
                                    <div className='flex items-center gap-1.5'>
                                        <Avatar className="rounded-[4px] w-5 h-5 bg-[#FFFFFF] border-[0.6px] border-neutral-200 flex items-center justify-center">
                                            <AvatarImage src={integration.logo} alt={integration.name} className="rounded-[2px] h-4 w-4" />
                                            <AvatarFallback className="rounded-[2px] text-[13px] uppercase bg-secondary text-primary !h-4 !w-4">
                                                {integration.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>
                                            {integration.name}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                {Boolean(integration.sub && integration.sub.length) && (
                                    <AccordionContent>
                                        <div className="ml-5 pl-2 flex-1 relative">
                                            <div className={`absolute -left-2 top-0 w-[1.5px] h-[100%] bg-[#E4E4E8] rounded-full`} />
                                            {integration?.sub?.map(subItem => (
                                                <div key={subItem.name} className="flex pl-[1px] mt-2 relative items-center">
                                                    <div className="absolute -left-4 w-[23px] top-1.5 h-[13px] border-[#E4E4E8] border-[2px] border-r-0 border-t-0 rounded-br-none rounded-tl-none rounded-full" />
                                                    {/* ${tab === 'all-user' ? 'bg-[#F4F4F6] hover:bg-[#F4F4F6] text-neutral' : 'bg-transparent text-[#5E5F6E]'} */}
                                                    <Button variant="ghost" className={`bg-white hover:bg-white !cursor-pointer w-full flex justify-between items-center text-[13px] text-neutral font-[400] leading-[20px]`}>
                                                        {subItem.name}
                                                        <ChevronRightIcon className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                )}
                            </AccordionItem>
                        ))
                    }
                </Accordion>
            </div>
        </div>
    )
}
