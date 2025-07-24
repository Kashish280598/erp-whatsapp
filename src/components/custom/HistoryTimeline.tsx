import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SeverityChip from "./SeverityChip";
import { IconChevronRight } from "@tabler/icons-react";
import FindingChip from "./FindingChip";

interface HistoryItem {
    time: string;
    date: string;
    type:
    | "Severity Changed"
    | "Manual Scan Executed"
    | "Description Updated"
    | "Rule Renamed"
    | "Daily Scan Executed"
    | "Rule Assigned";
    details: any[];
    user: {
        initials: string;
        name: string;
        badge: string;
        image: string;
    };
}

interface HistoryTimelineProps {
    history: HistoryItem[];
}


const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ history }) => {

    const timelineDetailsRender = {
        "Severity Changed": (item: HistoryItem) => {
            return (
                <div className="flex items-center gap-2">
                    <SeverityChip title={item.details[0].title} type={item.details[0].type} />
                    <IconChevronRight size={16} color="#9AA1B1" />
                    <SeverityChip title={item.details[1].title} type={item.details[1].type} />
                </div>
            )
        },
        "Manual Scan Executed": (item: HistoryItem) => {
            return (
                <div className="flex items-center gap-2">
                    <FindingChip title={"Findings"} value={item.details[0].finding} type={"finding"} />
                    <FindingChip title={"Open Issues"} value={item.details[0].open} type={"open"} />
                    <FindingChip title={"Resolved"} value={item.details[0].resolved} type={"resolved"} />
                </div>
            )
        },
        "Description Updated": (item: HistoryItem) => {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-[14px] text-[#5E5F6E]">{item.details[0]}</span>
                </div>
            )
        },
        "Rule Renamed": (item: HistoryItem) => {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-[14px] text-[#5E5F6E]">{item.details[0]}</span>
                </div>
            )
        },
        "Daily Scan Executed": (item: HistoryItem) => {
            return (
                <div className="flex items-center gap-2">
                    <FindingChip title={"Findings"} value={item.details[0].finding} type={"finding"} />
                    <FindingChip title={"Open Issues"} value={item.details[0].open} type={"open"} />
                    <FindingChip title={"Resolved"} value={item.details[0].resolved} type={"resolved"} />
                </div>
            )
        },
        "Rule Assigned": (item: HistoryItem) => {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-[14px] text-[#5E5F6E]">Assigned to:</span>
                    <Badge variant={"default"} className="rounded-[6px] bg-[#F5F5F5] text-[#5E5F6E] text-[14px] leading-5 font-[400]">
                        <Avatar className="h-6 w-6 rounded-[8px] border-1 border-[#E4E4E8] p-0.5">
                            <AvatarImage src={item.details[0].service.logo} className='rounded-[6px]' />
                            <AvatarFallback className="rounded-[6px] bg-gray-100 text-gray-600 text-[12px]">
                                {item.details[0].service.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-[14px] text-neutral">{item.details[0].service.name}</span>
                    </Badge>
                </div>
            )
        }
    };

    return (
        <Card className="p-6 pb-0 rounded-xl border border-[#E4E4E8] overflow-y-auto">
            <h2 className="text-xl font-semibold text-[#111827] mb-1">History</h2>
            <div className="relative h-full flex flex-col">
                {history.map((item, idx) => (
                    <div key={idx} className="relative mb-5 last:flex-1">
                        <div className="flex gap-1 h-full">
                            <div className="text-[14px] text-[#5E5F6E] text-right">
                                {item.date}
                                <br />
                                {item.time}
                            </div>
                            <div className="ml-5 pl-2 flex-1 relative">
                                <div className={`absolute -left-2 top-5 w-[1.5px] h-[100%] bg-[#E4E4E8] rounded-full`} />
                                <div className="absolute -left-[10.5px] top-[9px] bg-primary w-1.5 h-1.5 rounded-[2px]" />
                                <div className="font-medium text-[16px] text-[#111827] flex justify-between">
                                    {item.type}
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[14px] text-[#5E5F6E]">By</span>
                                        <div className="flex items-center gap-1.5">
                                            <Avatar className="h-6 w-6 rounded-[8px] border-1 border-[#E4E4E8] p-0.5">
                                                <AvatarImage src={item.user.image} className='rounded-[6px]' />
                                                <AvatarFallback className="rounded-[6px] bg-gray-100 text-gray-600 text-[12px]">
                                                    {item.user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-[14px] text-[#111827]">{item.user.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex pl-3 mt-2 relative items-center">
                                    <div className="absolute -left-4 w-[23px] -top-0.5 h-[13px] border-[#E4E4E8] border-[2px] border-r-0 border-t-0 rounded-br-none rounded-tl-none rounded-full" />
                                    {timelineDetailsRender[item.type as keyof typeof timelineDetailsRender](item)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default HistoryTimeline;
