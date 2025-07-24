// components/IntegrationCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Link2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface IntegrationCardProps {
    name: string;
    description: string;
    logo: string; // URL or base64 image
    className?: string;
}

export function IntegrationCard({ name, description, logo, className }: IntegrationCardProps) {
    return (
        <Card className={cn("rounded-2xl px-0 py-0 border w-full max-w-md shadow-none", className)}>
            <CardContent className="p-0">
                <div className="px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10 rounded-[6px] border-1 border-[#E4E4E8] p-0.5">
                            <AvatarImage src={logo} className='rounded-[4px]' />
                            <AvatarFallback className="rounded-[4px] bg-gray-100 text-gray-600">
                                {name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className="text-sm font-semibold text-black">{name}</h3>
                    </div>
                    <p className="text-[13px] text-[#5E5F6E] leading-5 font-[400] mt-1">
                        {description}
                    </p>
                </div>
                <hr className="my-3" />
                <div className="px-4 pb-4 flex items-center gap-2 text-sm text-muted-foreground font-medium cursor-pointer hover:underline">
                    <Link2 className="w-4 h-4" />
                    Connect
                </div>
            </CardContent>
        </Card>
    );
}
