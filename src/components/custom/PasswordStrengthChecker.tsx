import React from "react";
import { cn } from "@/lib/utils";
import { CircleCheck, X as CircleX } from "lucide-react";

type StrengthLevel = "Too Short" | "Weak" | "Medium" | "Strong" | "Ultimate" | "";

const getPasswordStrength = (score: number): StrengthLevel => {
    switch (score) {
        case 1: return "Weak";
        case 2: return "Medium";
        case 3: return "Strong";
        case 4: return "Ultimate";
        default: return "Too Short";
    }
};

const getStrengthColor = (strength: StrengthLevel): string => {
    switch (strength) {
        case "Too Short": return "bg-gray-300";
        case "Weak": return "bg-red-500";
        case "Medium": return "bg-yellow-500";
        case "Strong": return "bg-blue-500";
        case "Ultimate": return "bg-[#079456]";
        default: return "bg-gray-300";
    }
};
const getStrengthTextColor = (strength: StrengthLevel): string => {
    switch (strength) {
        case "Too Short": return "text-neutral-500";
        case "Weak": return "text-red-500";
        case "Medium": return "text-yellow-500";
        case "Strong": return "text-blue-500";
        case "Ultimate": return "text-[#077D48]";
        default: return "text-neutral-500";
    }
};

const getProgressValue = (strength: StrengthLevel): number => {
    switch (strength) {
        case "Too Short": return 0;
        case "Weak": return 25;
        case "Medium": return 50;
        case "Strong": return 75;
        case "Ultimate": return 100;
        default: return 0;
    }
};


const PasswordStrengthChecker: React.FC<{ password: string, className?: string }> = ({ password, className }) => {
    // Compute strength directly from password
    const strength = getPasswordStrength(
        password.length < 8 ? 0 :
        [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].reduce((acc, regex) => acc + Number(regex.test(password)), 0)
    );

    const progress = getProgressValue(strength);
    const strengthColor = getStrengthColor(strength);
    const strengthTextColor = getStrengthTextColor(strength);

    return (
        <div className={cn("w-[480px] p-6 bg-white shadow-lg rounded-xl", className)}>
            <div className="">
                {/* Progress Bar */}
                <div className="w-full h-2 bg-primary-100 rounded overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${strengthColor}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                {/* <PasswordStrengthBar
                    className="!hidden"
                    scoreWords={["Too Short", "Weak", "Medium", "Strong", "Ultimate"]}
                    password={password}
                    minLength={5}
                    onChangeScore={handlePasswordStrengthChange}
                /> */}
                <p className="font-[600] text-[#5E5F6E] text-[13px] leading-5 mt-2">
                    Strength:{" "}
                    <span className={`font-[400] ${strengthTextColor}`}>
                        {strength}
                    </span>
                </p>

            </div>

            {/* Password Rule Checklist */}
            <ul className="mt-4 space-y-1 text-[13px] leading-5">
                <li className={`flex items-center text-neutral`}>
                    {password.length >= 8 ? <CircleCheck size={16} className="mr-2 text-white" fill="green" /> : <span className="bg-[#F4F4F6] rounded-full mr-2 h-4 w-4 flex items-center justify-center"><CircleX size={10} className={`text-[#5E5F6E]`} fill={!password.length ? '#F4F4F6' : 'red'} /></span>} Minimum 8 characters
                </li>
                <li className={`flex items-center text-neutral`}>
                    {/[a-z]/.test(password) ? <CircleCheck size={16} className="mr-2 text-white" fill="green" /> : <span className="bg-[#F4F4F6] rounded-full mr-2 h-4 w-4 flex items-center justify-center"><CircleX size={10} className={`text-[#5E5F6E]`} fill={!password.length ? '#F4F4F6' : 'red'} /></span>} Atleast one lowercase letter
                </li>
                <li className={`flex items-center text-neutral`}>
                    {/[A-Z]/.test(password) ? <CircleCheck size={16} className="mr-2 text-white" fill="green" /> : <span className="bg-[#F4F4F6] rounded-full mr-2 h-4 w-4 flex items-center justify-center"><CircleX size={10} className={`text-[#5E5F6E]`} fill={!password.length ? '#F4F4F6' : 'red'} /></span>} Atleast one uppercase letter
                </li>
                <li className={`flex items-center text-neutral`}>
                    {/\d/.test(password) ? <CircleCheck size={16} className="mr-2 text-white" fill="green" /> : <span className="bg-[#F4F4F6] rounded-full mr-2 h-4 w-4 flex items-center justify-center"><CircleX size={10} className={`text-[#5E5F6E]`} fill={!password.length ? '#F4F4F6' : 'red'} /></span>} Atleast one number
                </li>
                <li className={`flex items-center text-neutral`}>
                    {/[^A-Za-z0-9]/.test(password) ? <CircleCheck size={16} className="mr-2 text-white" fill="green" /> : <span className="bg-[#F4F4F6] rounded-full mr-2 h-4 w-4 flex items-center justify-center"><CircleX size={10} className={`text-[#5E5F6E]`} fill={!password.length ? '#F4F4F6' : 'red'} /></span>} Atleast one special character
                </li>
            </ul>
        </div>
    );
};

export default PasswordStrengthChecker;
