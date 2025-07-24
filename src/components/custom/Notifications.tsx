import { DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import BellIcon from "@/assets/icons/Alert-Bell-Notification.svg";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TabListContainer from "./TabListContainer";

export const Notifications = () => {
    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative w-8 h-8 rounded-lg hover:bg-neutral-50 bg-[#FFFFFF] shadow-[0px_1px_0px_0px_#E3E3E3_inset,1px_0px_0px_0px_#E3E3E3_inset,-1px_0px_0px_0px_#E3E3E3_inset,0px_-1px_0px_0px_#B5B5B5_inset] cursor-pointer p-0">
                        <img src={BellIcon} alt="Bell Icon" className="w-4 h-4 text-neutral-500" />
                        <span className="absolute -top-0.5 -right-2.5 flex items-center justify-center px-1 py-0.5 text-[12px] font-[600] leading-4 text-white bg-[#B1241A] rounded-full">
                            02
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[445px]">
                    <div className="flex items-center justify-between p-5">
                        <p className="text-[20px] font-[600] leading-7 text-neutral">Notifications</p>
                        <Button variant="ghost" className={"p-0 h-5 underline bg-white hover:bg-white text-primary text-[13px] font-[600] leading-5"}>
                            Mark all as read
                        </Button>
                    </div>
                    <div>
                        <Tabs className="w-full" defaultValue="all">
                            <TabListContainer tabs={[{ label: 'All', value: 'all', showBadge: true, badgeCount: 2 }, { label: 'Critical', value: 'critical', showBadge: true, badgeCount: 0 }]} />
                            <TabsContent value="all" className="">
                                <p className="text-sm p-4 text-neutral-500 text-center">No notifications</p>
                            </TabsContent>
                            <TabsContent value="critical" className="">
                                <p className="text-sm p-4 text-neutral-500 text-center">No notifications</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

