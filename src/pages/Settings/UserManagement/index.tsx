import TabListContainer from '@/components/custom/TabListContainer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import UserDirectory from './UserDirectory';
import { IconPlus } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import InviteUserSideDrawer from './InviteUserSideDrawer';
import EditUserDetailsSideDrawer from './EditUserDetailsSideDrawer';
import InvitesSentTable from './InvitesSentTable';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { openInviteUserDrawer } from '@/lib/features/settings/settingsSlice';
import UserActivationModal from './UserActivationModal';
import { useLoading } from '@/hooks/useAppState';
import { API_ENDPOINTS } from '@/lib/api/config';
import { isAdminUser } from '@/lib/utils';
export default function UserManagement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'all-user';
    const dispatch = useAppDispatch();
    const { metadata } = useAppSelector(state => state.settings.users);
    const { metadata: invitationsMetadata } = useAppSelector(state => state.settings.invitations);
    const { isLoading: isLoadingAllUser } = useLoading(API_ENDPOINTS.users.all);
    const { isLoading: isLoadingInvitations } = useLoading(API_ENDPOINTS.users.allInvitations);

    useEffect(() => {
        if (!searchParams.get('tab') || !['all-user', 'invites-sent'].includes(searchParams.get('tab') || '')) {
            setSearchParams({ tab: 'all-user' });
        }
    }, [searchParams, setSearchParams]);

    const handleTabChange = (value: string) => {
        setSearchParams({ tab: value });
    };

    const handleInviteUser = () => {
        dispatch(openInviteUserDrawer());
    };

    return (
        <div className="h-full">
            <div className="flex items-center justify-between pb-5">
                <h2 className="text-[18px] font-[600] leading-6.5 text-neutral font-inter">User Management</h2>
                {isAdminUser() && (
                    <Button variant="default" size="sm" className="text-[13px] leading-5 font-inter font-[600] gap-0.5" onClick={handleInviteUser}>
                        <IconPlus className="!w-3 !h-3" strokeWidth={2} />
                        Invite New User
                    </Button>
                )}
            </div>

            {/* Content */}
            <Tabs
                className="w-full h-full"
                value={activeTab}
                onValueChange={handleTabChange}
            >
                <TabListContainer
                    tabs={[
                        {
                            label: 'User Directory',
                            value: 'all-user',
                            showBadge: activeTab === 'all-user',
                            badgeCount: metadata?.total || 0,
                            isLoading: isLoadingAllUser,
                            badgeClassName: 'text-[12px] leading-4 font-inter font-[600] text-neutral-500 group-data-[state=active]:bg-primary-100 group-data-[state=active]:text-primary'
                        },
                        {
                            label: 'Invites Sent',
                            value: 'invites-sent',
                            showBadge: activeTab === 'invites-sent',
                            isLoading: isLoadingInvitations,
                            badgeCount: invitationsMetadata?.total || 0,
                            badgeClassName: 'text-[12px] leading-4 font-inter font-[600] text-neutral-500 group-data-[state=active]:bg-primary-100 group-data-[state=active]:text-primary'
                        }
                    ]}
                />
                <TabsContent value="all-user" className="pt-3 max-h-[calc(100%-35px)] overflow-unset">
                    <UserDirectory />
                </TabsContent>
                <TabsContent value="invites-sent" className="pt-3 max-h-[calc(100%-35px)] overflow-unset">
                    <InvitesSentTable />
                </TabsContent>
            </Tabs>

            {isAdminUser() && <InviteUserSideDrawer />}
            <EditUserDetailsSideDrawer />
            {isAdminUser() && <UserActivationModal />}
        </div>
    );
} 