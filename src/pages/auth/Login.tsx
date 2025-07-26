// import LoginRightSection from '@/components/auth/LoginRightSection';
import LoginForm from '@/components/auth/LoginForm';
import LogoLight from '@/assets/logo-light.svg';
import LogoDark from '@/assets/logo-dark.svg';
import { useTheme } from '@/providers/theme-provider';
import { API_ENDPOINTS } from '@/lib/api/config';
import { useLoading } from '@/hooks/useAppState';
import Loader from "@/components/Loader";

const Login = () => {
  const { isLoading: isLoadingForLogin } = useLoading(API_ENDPOINTS.auth.login);
  const { theme } = useTheme();
  
  return (
    <div className="custom-scrollbar flex flex-col min-h-screen md:flex-row">
      {/* Left Section */}
      <div className="w-full p-4 flex flex-col items-center justify-start lg:p-8">
        <div className="w-full max-w-[480px] space-y-6 md:space-y-7 pt-7">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={theme === 'dark' ? LogoDark : LogoLight}
              alt="Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-25 lg:h-25"
            />
          </div>

          <LoginForm />
        </div>
      </div>

      {/* Right Section */}
      {/* <LoginRightSection /> */}


      {isLoadingForLogin && <Loader
        className={`fixed top-0 left-0 z-998 "backdrop-blur-[3px]`}
        title={isLoadingForLogin ? 'Loading...' : 'Loading...'}
        description={isLoadingForLogin ? 'We\'re logging you in. This will just take a moment...' : 'This will just take a moment...'} />}
    </div>
  );
};

export default Login; 