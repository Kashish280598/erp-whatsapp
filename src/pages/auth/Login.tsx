import { useAppSelector, type RootState } from '@/lib/store';
// import LoginRightSection from '@/components/auth/LoginRightSection';
import LoginForm from '@/components/auth/LoginForm';
import TwoFactorForm from '@/components/auth/TwoFactorForm';
import Logo from '@/assets/logo.svg';
import { API_ENDPOINTS } from '@/lib/api/config';
import { useLoading } from '@/hooks/useAppState';
import Loader from "@/components/Loader";

const Login = () => {
  const activeStep = useAppSelector((state: RootState) => state.auth.login.step);
  const { isLoading: isLoadingForEmail } = useLoading(API_ENDPOINTS.auth.verifyEmailForSSO_OR_PasswordLogin);
  const { isLoading: isLoadingForLogin } = useLoading(API_ENDPOINTS.auth.login);
  const { isLoading: isLoadingFor2FA } = useLoading(API_ENDPOINTS.auth.verify2MFASetup);
  
  return (
    <div className="custom-scrollbar flex flex-col min-h-screen md:flex-row">
      {/* Left Section */}
      <div className="w-full p-4 flex flex-col items-center justify-start lg:p-8">
        <div className="w-full max-w-[480px] space-y-6 md:space-y-7 pt-7">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={Logo}
              alt="ERP Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-25 lg:h-25"
            />
          </div>

          {activeStep === 1 ? <LoginForm /> : <TwoFactorForm />}
        </div>
      </div>

      {/* Right Section */}
      {/* <LoginRightSection /> */}


      {(isLoadingForEmail || isLoadingForLogin || isLoadingFor2FA) && <Loader
        className={`fixed top-0 left-0 z-998 "backdrop-blur-[3px]`}
        title={isLoadingForEmail ? 'Verifying Your Email' : isLoadingForLogin ? 'Loading...' : isLoadingFor2FA ? 'Verifying Your Code' : 'Loading...'}
        description={isLoadingForEmail ? 'We\'re confirming your email. This will just take a moment...' : isLoadingForLogin ? 'We\'re logging you in. This will just take a moment...' : isLoadingFor2FA ? 'We\'re verifying your code. This will just take a moment...' : 'This will just take a moment...'} />}
    </div>
  );
};

export default Login; 