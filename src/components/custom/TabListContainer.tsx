import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface TabListContainerProps {
    tabsListClassName?: string;
    tabs: {
        label: string;
        value: string;
        showBadge?: boolean;
        badgeCount?: number;
        badgeClassName?: string;
        tabClassName?: string;
        isLoading?: boolean;
    }[];
}

const TabListContainer: React.FC<TabListContainerProps> = ({ tabs, tabsListClassName }) => {
    return (
        <TabsList className={cn("w-full h-auto p-0 bg-transparent border-b border-[#E4E4E8] gap-5 rounded-none justify-start", tabsListClassName)}>
            {tabs.map((tab) => (
                <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn("group cursor-pointer relative max-w-fit h-auto px-4 pb-2 text-[13px] font-[400] leading-4 bg-transparent rounded-none border-0 hover:bg-transparent data-[state=active]:font-[600] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=inactive]:text-neutral-500 after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-primary data-[state=active]:after:block after:hidden data-[state=active]:opacity-100 transition-all duration-200 after:transition-all after:duration-200 after:ease-in-out after:transform after:scale-x-0 data-[state=active]:after:scale-x-100 !shadow-none border-none ring-0 outline-none focus:ring-0 focus:ring-offset-0", tab.tabClassName)}
                >
                    {tab.label}
                    {tab.showBadge && (
                        <Badge
                            variant="secondary"
                            className={cn("py-0.5 px-2 ml-2 bg-neutral-200 text-neutral-500 group-data-[state=active]:bg-[#565ADD] group-data-[state=active]:text-white", tab.badgeClassName)}
                        >
                            {tab.isLoading ? <Loader2  className='!h-3.5 !w-3.5 animate-spin' /> : tab.badgeCount ? tab.badgeCount?.toString().padStart(2, '0') : tab.badgeCount}
                        </Badge>
                    )}
                </TabsTrigger>
            ))}
        </TabsList>
    );
};

export default TabListContainer;
