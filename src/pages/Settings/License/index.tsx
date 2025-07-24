import React from 'react';
import { Button } from '@/components/ui/button';
import DownloadIcon from '@/assets/icons/license-term-icon.svg';
import QuestionIcon from '@/assets/icons/user-contact-icon.svg';
import CardOverlayVisual from '@/assets/icons/license-visual.svg';
import CardOverlayVisual1 from '@/assets/icons/license-visual-1.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function License() {
    return (
        <div className="h-full pb-10">
            <div className="flex items-center justify-between pb-5">
                <div>
                    <h2 className="text-[20px] font-[600] leading-7 text-neutral font-inter">License Agreement</h2>
                    {/* Last Updated */}
                    <div className="text-[13px] leading-5 text-[#5E5F6E] font-[600] font-inter mt-1">
                        Last Updated: <span className="text-neutral font-[400]">10:30 AM 19/03/2025</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* License Grant */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-[13px] font-[600] leading-5 text-neutral font-inter">License Grant</h3>
                    <p className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                        [Your Company Name] grants you a non-exclusive, non-transferable license to use the ERP software, solely for your internal business purposes under the terms below.
                    </p>
                </div>

                {/* Restrictions */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-[13px] font-[600] leading-5 text-neutral font-inter">Restrictions</h3>
                    <p className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">You may not:</p>
                    <ul className="list-disc pl-6 flex flex-col">
                        <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                            Modify, reverse-engineer, or create derivative works
                        </li>
                        <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                            Resell, sublicense, or share access outside your organization
                        </li>
                        <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                            Use the platform in violation of applicable laws
                        </li>
                    </ul>
                </div>

                {/* Term & Termination */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-[13px] font-[600] leading-5 text-neutral font-inter">Term & Termination</h3>
                    <p className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">This agreement remains effective until:</p>
                    <ul className="list-disc pl-6 flex flex-col">
                        <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                            Your subscription ends, or
                        </li>
                        <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                            Either party terminates for material breach (with 30 days' notice)
                        </li>
                    </ul>
                </div>

                {/* Compliance */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-[13px] font-[600] leading-5 text-neutral font-inter">Compliance</h3>
                    <p className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">You agree to:</p>
                    <ul className="list-disc pl-6 flex flex-col">
                        <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                            Use only purchased licenses
                        </li>
                        <li className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                            Promptly report misuse or unauthorized access
                        </li>
                    </ul>
                </div>

                {/* Updates */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-[13px] font-[600] leading-5 text-neutral font-inter">Updates</h3>
                    <p className="text-[13px] font-[400] leading-5 text-[#5E5F6E] font-inter">
                        We may update terms with 30 days' notice via email or in-app alerts. Continued use constitutes acceptance.
                    </p>
                </div>

                {/* Action Cards */}
                <div className="flex gap-5 mt-3">
                    {/* Full License Terms */}
                    <div className="overflow-hidden flex-1 p-5 bg-white rounded-[12px] border border-[#E4E4E8] shadow-[0px_1px_2px_0px_#1018280D] relative">
                        <img src={CardOverlayVisual} alt="Download" className="absolute top-0 right-0" />
                        <Avatar className="h-11 w-11 rounded-[12px] border-1 border-[#E4E4E8] p-1 z-1">
                            <AvatarImage src={DownloadIcon} className='rounded-[10px] bg-[#F4F4F6] p-2' />
                            <AvatarFallback className="rounded-[10px] bg-[#F4F4F6] text-white">
                                D
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center justify-between gap-5 mt-7 z-1">
                            <div className="flex flex-col gap-1">
                                <h4 className="text-[16px] font-[600] leading-6 text-neutral font-inter">Full License Terms</h4>
                                <p className="text-[13px] leading-5 text-[#5E5F6E] font-[400] font-inter">
                                    Download the complete license agreement PDF for your records, including all terms and conditions.
                                </p>
                            </div>
                            <Button variant="outline" className="px-3 py-2 text-[13px] leading-5 font-inter font-[600] text-neutral bg-white z-1">
                                Download Now
                            </Button>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="overflow-hidden flex-1 p-5 bg-white rounded-[12px] border border-[#E4E4E8] shadow-[0px_1px_2px_0px_#1018280D] relative">
                        <img src={CardOverlayVisual1} alt="Download" className="absolute top-0 right-0 h-full" />
                        <Avatar className="h-11 w-11 rounded-[12px] border-1 border-[#E4E4E8] p-1 z-1">
                            <AvatarImage src={QuestionIcon} className='rounded-[10px] bg-[#F4F4F6] p-2' />
                            <AvatarFallback className="rounded-[10px] bg-[#F4F4F6] text-white">
                                Q
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center justify-between gap-5 mt-7 z-1">
                            <div className="flex flex-col gap-1">
                                <h4 className="text-[16px] font-[600] leading-6 text-neutral font-inter">Questions</h4>
                                <p className="text-[13px] leading-5 text-[#5E5F6E] font-[400] font-inter">
                                    Reach out to our legal team for clarifications or custom license needs.
                                </p>
                            </div>
                            <Button variant="outline" className="px-3 py-2 text-[13px] leading-5 font-inter font-[600] text-neutral bg-white z-1">
                                Contact Us
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 