import { Accordion, AccordionContent, AccordionTrigger, AccordionItem } from '@/components/ui/accordion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from 'lucide-react';

export default function Settings() {
    const { pathname } = useLocation();
    const params = new URLSearchParams(window.location.search);
    const tab = params?.get?.('tab');
    const checkActiveNav = (nav: string) => pathname.includes(nav);

    return (
        <div>
            <Accordion type="single" collapsible className="w-[178px]">
                <AccordionItem value="manage-account" className="border-b-0 !cursor-pointer mb-1">
                    <Link to="settings/manage-account" className="underline-0 hover:underline-0 !cursor-pointer">
                        <AccordionTrigger className={`!cursor-pointer ${checkActiveNav('/settings/manage-account') ? 'bg-[#F4F4F6] text-neutral' : 'bg-transparent text-[#5E5F6E]'} text-[13px] leading-[20px] font-[400] px-2 py-2 [&[data-state=open]>svg]:rotate-270 [&[data-state=closed]>svg]:rotate-270`}>
                            Manage Account
                        </AccordionTrigger>
                    </Link>
                </AccordionItem>
                <AccordionItem value="user-management" className="border-b-0 !cursor-pointer mb-1">
                    <AccordionTrigger className={`!cursor-pointer ${checkActiveNav('/settings/user-management') ? 'bg-[#F4F4F6] text-neutral' : 'bg-transparent text-[#5E5F6E]'} text-[13px] leading-[20px] font-[400] px-2 py-2 !underline-0 `}>
                        User Management
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="ml-5 pl-2 flex-1 relative">
                            <div className={`absolute -left-2 top-0 w-[1.5px] h-[100%] bg-[#E4E4E8] rounded-full`} />
                            <Link to="settings/user-management?tab=all-user" className="underline-0 hover:underline-0 !cursor-pointer">
                                <div className="flex pl-[1px] mt-2 relative items-center">
                                    <div className="absolute -left-4 w-[23px] top-1.5 h-[13px] border-[#E4E4E8] border-[2px] border-r-0 border-t-0 rounded-br-none rounded-tl-none rounded-full" />
                                    <Button variant="ghost" className={`bg-white hover:bg-white !cursor-pointer w-full flex justify-between items-center text-[13px] text-neutral font-[400] leading-[20px] ${tab === 'all-user' ? 'bg-[#F4F4F6] hover:bg-[#F4F4F6] text-neutral' : 'bg-transparent text-[#5E5F6E]'}`}>
                                        Users Directory
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Link>
                            <Link to="settings/user-management?tab=invites-sent" className="underline-0 hover:underline-0 !cursor-pointer">
                                <div className="flex pl-[1px] mt-2 relative items-center">
                                    <div className="absolute -left-4 w-[23px] top-1.5 h-[13px] border-[#E4E4E8] border-[2px] border-r-0 border-t-0 rounded-br-none rounded-tl-none rounded-full" />
                                    <Button variant="ghost" className={`bg-white hover:bg-white !cursor-pointer w-full flex justify-between items-center text-[13px] text-neutral font-[400] leading-[20px] ${tab === 'invites-sent' ? 'bg-[#F4F4F6] hover:bg-[#F4F4F6] text-neutral' : 'bg-transparent text-[#5E5F6E]'}`}>
                                        Invites Sent
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Link>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}