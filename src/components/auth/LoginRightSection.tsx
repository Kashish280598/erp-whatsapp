import { InfiniteAutoSwiper } from '@/components/custom/InfiniteAutoSwiper';
import asana from '@/assets/icons/asana-logo.svg';
import slack from '@/assets/icons/slack-logo.svg';
import confluence from '@/assets/icons/confluence-logo.svg';
import bitbucket from '@/assets/icons/bitbucket-logo.svg';
import zapier from '@/assets/icons/zapier-logo.svg';
import amazon from '@/assets/icons/amazon-logo.svg';
import appian from '@/assets/icons/appian-logo.svg';
import LoginVector from '@/assets/login-vector.svg';

const images = [
  { id: 'asana', image: asana },
  { id: 'slack', image: slack },
  { id: 'confluence', image: confluence },
  { id: 'bitbucket', image: bitbucket },
  { id: 'zapier', image: zapier },
  { id: 'amazon', image: amazon },
  { id: 'appian', image: appian },
];


const LoginRightSection = () => {
    return (
        <div id="login-right-section" className="max-md:hidden w-full bg-gradient-to-l from-[#FFFFFF] to-[#F2F3FC] p-0 flex flex-col items-center justify-center flex-1 lg:p-0 md:max-w-[440px] lg:max-w-[550px] py-5">
            <div className="max-w-[85%] w-[85%] text-center">
                <div className="mb-6 lg:mb-8">
                    <img
                        src={LoginVector}
                        alt="Security Illustration"
                        className="w-full max-w-[280px] mx-auto sm:max-w-sm md:max-w-[300px]"
                    />
                </div>
                <h2 className="font-[600] text-neutral text-[20px] leading-7">
                    SaaS Security So Smooth,
                    <br />
                    It's <span className="text-primary">Almost Unfair</span>
                </h2>
                <p className="mt-3 font-[400] text-[13px] leading-5 text-[#5E5F6E]">
                    Get started in minutes and uncover hidden risks
                    <br className="hidden sm:block" />
                    across your SaaS stack.
                </p>
                <div className="mt-6 lg:mt-8 flex justify-center items-center gap-5 mb-3 sm:mb-4">
                    <div className="h-[1px] bg-[#E4E4E8] flex-1" />
                    <p className="font-[400] text-[13px] leading-5 text-[#5E5F6E]">Over 50+ integrations secured</p>
                    <div className="h-[1px] bg-[#E4E4E8] flex-1" />
                </div>
            </div>
            <div className="w-full">
                <InfiniteAutoSwiper images={images} />
            </div>
        </div>
    )
};

export default LoginRightSection;