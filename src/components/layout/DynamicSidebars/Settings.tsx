import { Accordion, AccordionTrigger, AccordionItem } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';

export default function Settings() {

    return (
        <div>
            <Accordion type="single" collapsible className="w-[178px] dark:bg-neutral-900">
                <AccordionItem value="manage-account" className="border-b-0 !cursor-pointer mb-1">
                    <Link to="settings/manage-account" className="underline-0 hover:underline-0 !cursor-pointer">
                        <AccordionTrigger disabled className={`!cursor-not-allowed bg-[#F4F4F6] dark:bg-neutral-800 text-neutral dark:text-neutral-500 text-[13px] leading-[20px] font-[400] px-2 py-2 rounded-xl border-none shadow-none`}>
                            Manage Account
                        </AccordionTrigger>
                    </Link>
                </AccordionItem>
            </Accordion>
        </div>
    )
}