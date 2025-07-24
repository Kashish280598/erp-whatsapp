import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
import type { FormField } from "@/types/integration.types";
import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
    form_data: FormField[];
};

export default function DynamicIntegrationForm({ form_data }: Props) {
    return (
        <form className="grid grid-cols-12 gap-5">
            {form_data.map((field) => {
                return (
                    <div
                        key={field.uuid}
                        className={clsx({
                            "col-span-1": field.grid === 1,
                            "col-span-2": field.grid === 2,
                            "col-span-3": field.grid === 3,
                            "col-span-4": field.grid === 4,
                            "col-span-5": field.grid === 5,
                            "col-span-6": field.grid === 6,
                            "col-span-7": field.grid === 7,
                            "col-span-8": field.grid === 8,
                            "col-span-9": field.grid === 9,
                            "col-span-10": field.grid === 10,
                            "col-span-11": field.grid === 11,
                            "col-span-12": !field.grid || field.grid === 12,
                        })}
                    >
                        {field.label && (
                            <div className="flex items-center mb-2">
                                <Label
                                    htmlFor={field.name}
                                    className="text-[11px] font-[600] leading-3.5 text-neutral-500"
                                >
                                    {field.label}
                                </Label>
                                {field.required && (
                                    <span className="text-[11px] font-[600] leading-3.5 text-error">
                                        *
                                    </span>
                                )}
                                {field.notes && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-2.5 w-2.5 cursor-help text-neutral-500 ml-0.5" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-white px-4 py-3 text-sm text-gray-600 border border-gray-100 shadow-lg rounded-lg">
                                            {field.notes}
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        )}

                        {field.type === "textBox" && (
                            <Input
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                required={field.required}
                                className="py-1.5 px-3 !h-8 text-[13px] font-[400] leading-5"
                            />
                        )}

                        {field.type === "textArea" && (
                            <Textarea
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                required={field.required}
                            />
                        )}

                        {field.type === "checkBox" && (
                            <div className="flex flex-col gap-1">
                                {field.options?.map((opt, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${field.name}-${idx}`}
                                            className="mb-0 cursor-pointer"
                                        />
                                        <Label
                                            className="text-[13px] font-[400] leading-5 text-neutral cursor-pointer"
                                            htmlFor={`${field.name}-${idx}`}
                                        >
                                            {opt.option}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {field.type === "toggle" && (
                            <div className="flex items-center space-x-2 mt-1">
                                <Switch id={field.name} />
                                <Label
                                    htmlFor={field.name}
                                    className="text-[13px] font-[400] leading-5 text-neutral"
                                >
                                    {field.placeholder || "Toggle"}
                                </Label>
                            </div>
                        )}

                        {field.type === "radio" && (
                            <RadioGroup>
                                {field.options?.map((opt, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            id={`${field.name}-${idx}`}
                                            value={opt.option}
                                        />
                                        <Label
                                            htmlFor={`${field.name}-${idx}`}
                                            className="text-[13px] font-[400] leading-5 text-neutral cursor-pointer"
                                        >
                                            {opt.option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}

                        {field.type === "dropdown" && (
                            <Select
                                name={field.name}
                                required={field.required}
                            >
                                <SelectTrigger
                                    className={`!h-8 w-full border border-gray-300 font-[400]`}
                                >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent align='end' className='w-50'>
                                    {field.options?.map((opt, idx) => (
                                        <SelectItem
                                            className={`cursor-pointer w-full bg-secondary focus:bg-secondary`}
                                            key={idx}
                                            value={opt.option}>
                                            {opt.option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                );
            })}
        </form>
    );
}
