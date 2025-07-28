import { Layout } from "@/components/layout";
import Sidebar from "@/components/layout/sidebar";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router-dom";
// import useCheckActiveNav from "./hooks/use-check-active-nav";
import { NavgationBreadcrumb } from "@/components/custom/NavgationBreadcrumb";
// import { Notifications } from "@/components/custom/Notifications";
import ThemeSwitch from "@/components/ThemeSwitch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { logout, setAuthToken } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { parseFullName } from "@/lib/utils";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { IconLogout2 } from "@tabler/icons-react";
import { setTourCompleted } from '@/lib/features/app/appSlice';
// import FeedbackButton from "@/components/custom/FeedbackButton";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { firstName, lastName } = parseFullName(user?.name || '');
  const userInitials = `${firstName?.charAt(0)?.toUpperCase()}${lastName?.charAt(0)?.toUpperCase()}`;

  const handleLogout = () => {
    dispatch(logout());
    // @ts-ignore
    dispatch(setAuthToken(null));
    dispatch(setTourCompleted(false)); // Reset the tour flag on logout
  };

  return (
    <ProtectedRoute>
      <div className="relative h-full overflow-hidden bg-background">
        <Sidebar />
        <main
          id="content"
          className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 md:ml-18.5 h-[100svh]`}
        >
          <Layout className="overflow-hidden !overflow-y-auto">
            {/* ===== Top Heading ===== */}
            <Layout.Header className="hidden md:flex sticky top-0 z-10">
              {/* ===== Dynamic Navigation Breadcrumb ===== */}
              <NavgationBreadcrumb />
              {/* ===== Top Navigation ===== */}
              <div className="ml-auto flex items-center space-x-4">
                {/* <Notifications /> */}
                {/* <FeedbackButton size="sm" variant="ghost" className="hidden md:flex">
                  Feedback
                </FeedbackButton> */}
                <ThemeSwitch />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <Avatar className="rounded w-6 h-6 md:h-8 md:w-8 bg-secondary">
                      {/* <AvatarImage src={UserProfilePic} alt="@profile_pic" /> */}
                      <AvatarFallback className="rounded-md text-sm uppercase bg-secondary text-primary">
                        {userInitials || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="space-y-1">
                    <DropdownMenuItem onClick={handleLogout} className={`cursor-pointer text-[13px] font-[600] leading-5 text-neutral `}>
                      <IconLogout2 className={`h-3.5 w-3.5 "text-[#5E5F6E]`} />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Layout.Header>
            <Separator className="p-[1px] sticky top-0 md:top-[56px] z-10" />

            {/* ===== Main ===== */}
            <Layout.Body className="custom-scrollbar h-[calc(100svh-70px)] md:h-[calc(100svh-58px)] !overflow-y-auto pb-0 flex flex-wrap content-start">
              <Outlet />
            </Layout.Body>
          </Layout>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default App;
