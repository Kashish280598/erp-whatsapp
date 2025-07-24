import React from "react";
import { cn } from "@/lib/utils";
import loader from "@/assets/loader.gif";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
}

const Loader: React.FC<LoaderProps> = ({
    className = "",
    title = "",
    description = ""
}) => {
    return (
        <div
            className={cn(
                "flex items-center flex-col gap-3 justify-center bg-[#FFFFFFB2] backdrop-blur-[3px] w-full h-svh",
                className
            )}
        >
            <div className="w-20 h-20 flex items-center justify-center bg-[#F2F3FC] rounded-full">
                <img fetchPriority="high" loading="eager" src={loader} alt="loader" className="" />
            </div>
            <div className="">
                {title && <p className="text-neutral text-[20px] leading-[28px] font-[600] text-center">{title}</p>}
                {description && <p className="text-[#495057] text-[13px] leading-[18px] font-[400] text-center">{description}</p>}
            </div>
        </div>
    );
};

export default Loader;
