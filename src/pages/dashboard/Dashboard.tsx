import DoughnutChart from '@/components/charts/DoughnutChart';
import Gauge from '@/components/charts/Gauge'
import OpenResolvedLineChart from '@/components/charts/OpenResolvedLineChart'
import SeverityChartExample from '@/components/charts/SeverityChartExample';
import { DataTable } from '@/components/custom/table/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { TableToolbar } from '@/types/table.types';
import { IconDotsVertical, IconLockCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { CircularProgress } from '@/components/custom/CircularProgress';
import { useState } from 'react';
import { DataTableColumnHeader } from '@/components/custom/table/data-table/data-table-column-header';
import PasswordStrengthChecker from '@/components/custom/PasswordStrengthChecker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TabListContainer from '@/components/custom/TabListContainer';
import { IntegrationCard } from '@/components/custom/IntegrationCard';
import { toast } from "sonner";
import ComplianceCardExample from '@/components/charts/ComplianceCardExample';
import HoursChart from '@/components/charts/HoursChart';
import ComplianceScoreCard from '@/components/charts/ComplianceScoreCard ';
import HistoryTimeline from '@/components/custom/HistoryTimeline';
import CommentSection from '@/components/custom/Comments';
import { Dialog, DialogType } from '@/components/custom/Dialog';
import { SideDrawer } from '@/components/custom/SideDrawer';
import { Calendar } from '@/components/ui/calendar';

const data = {
  labels: ['', "24' Nov", '', "24' Dec", '', "Jan", '', "Feb", '', "Mar", '', "Apr", ''],
  datasets: [
    {
      label: 'Open',
      data: [0, 2, 5, 7, 8, 12, 16, 20, 22, 25, 26, 27, 30],
      borderColor: '#B1241A',
      fill: true,
      tension: 0.3,
      pointBorderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 0,
      borderWidth: 1.5,
      backgroundColor: function (context: any) {
        const chart = context.chart;
        const { ctx } = chart;
        const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
        gradient.addColorStop(0, '#b1241a26');
        gradient.addColorStop(1, 'rgba(253, 237, 237, 0)');
        return gradient;
      },
    },
    {
      label: 'Resolved',
      data: [0, 1, 5, 5, 15, 15, 15, 15, 22, 24, 24, 24, 29],
      borderColor: '#077D48',
      fill: true,
      tension: 0.3,
      pointBorderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 0,
      borderWidth: 1.5,
      backgroundColor: function (context: any) {
        const chart = context.chart;
        const { ctx } = chart;
        const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
        gradient.addColorStop(0, '#077d4826');
        gradient.addColorStop(1, 'rgba(230, 244, 238, 0)');
        return gradient;
      },
    }
  ]
};
export default function Dashboard() {
  const tableToolbar: TableToolbar = {
    enableSearch: true,
    enableFilter: true,
    searchPlaceholder: 'Search by Name...',
    filterOptions: [
      {
        field: 'integration',
        title: 'Integration',
        options: [
          { label: 'Appian India', value: 'Appian India' },
          { label: 'Auth0 Prod', value: 'Auth0 Prod' },
          { label: 'OneLogin Prod', value: 'OneLogin Prod' },
          { label: 'Box - Prod', value: 'Box - Prod' },
        ],
      },
      {
        field: 'status',
        title: 'Status',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
      },
      {
        field: 'scanFrequency',
        title: 'Scan Frequency',
        options: [
          { label: 'Daily', value: 'Daily' },
          { label: 'Weekly', value: 'Weekly' },
        ],
      },
    ],
  };

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className='pb-5 w-full'>
      <div className='w-full h-full flex flex-col gap-4'>
        <Gauge totalSegments={20} filledSegments={10} className='w-[200px]' />
        <Calendar
          mode="range"
        />
        <Tabs defaultValue="chart" className="w-full">
          <TabsList>
            <TabsTrigger onClick={() => {
              toast.success('Hello')
            }} value="chart">Doughnut Chart <Badge variant="secondary" className="ml-1 mr-2">01</Badge></TabsTrigger>
            <TabsTrigger value="password">Password Strength Checker</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <DoughnutChart />
          </TabsContent>
          <TabsContent value="password">
            <PasswordStrengthChecker password="P$assword123" />
          </TabsContent>
        </Tabs>

        <Tabs className="w-full" defaultValue="my">
          <TabListContainer tabs={[{ label: 'My Integrations', value: 'my' }, { label: 'Available Integrations', value: 'available' }]} />

          <TabsContent value="my" className="mt-4">
            {/* Content for My Integrations */}
            <DataTable
              data={[
                {
                  id: 1,
                  integration: {
                    name: 'Appian India',
                    logo: 'https://placehold.co/150',
                    status: 'active',
                  },
                  service: {
                    name: 'Appian',
                    logo: 'https://placehold.co/150',
                  },
                  openIssues: 10,
                  scanFrequency: 'Daily',
                  severity: 'Critical',
                  riskScore: 78,
                  tags: ['Authorization', 'Data Leakage'],
                  lastScan: '2024-03-15 09:30:00',
                  status: 'active',
                },
                {
                  id: 2,
                  integration: {
                    name: 'Auth0 Prod',
                    logo: 'https://placehold.co/150',
                    status: 'active',
                  },
                  service: {
                    name: 'Auth0',
                    logo: 'https://placehold.co/150',
                  },
                  openIssues: 8,
                  scanFrequency: 'Daily',
                  severity: 'High',
                  riskScore: 75,
                  tags: ['Authorization'],
                  lastScan: '2024-03-15 08:45:00',
                  status: 'active',
                },
                {
                  id: 3,
                  integration: {
                    name: 'OneLogin Prod',
                    logo: 'https://placehold.co/150',
                    status: 'inactive',
                  },
                  service: {
                    name: 'OneLogin',
                    logo: 'https://placehold.co/150',
                  },
                  openIssues: 5,
                  scanFrequency: 'Daily',
                  severity: 'Medium',
                  riskScore: 45,
                  tags: ['Onboarding'],
                  lastScan: '2024-03-15 07:15:00',
                  status: 'inactive',
                },
                {
                  id: 4,
                  integration: {
                    name: 'Box - Prod',
                    logo: 'https://placehold.co/150',
                    status: 'inactive',
                  },
                  service: {
                    name: 'Box',
                    logo: 'https://placehold.co/150',
                  },
                  openIssues: 3,
                  scanFrequency: 'Weekly',
                  severity: 'Low',
                  riskScore: 25,
                  tags: ['Onboarding'],
                  lastScan: '2024-03-14 15:30:00',
                  status: 'inactive',
                },
                {
                  id: 5,
                  integration: {
                    name: 'Box - Prod',
                    logo: 'https://placehold.co/150',
                    status: 'inactive',
                  },
                  service: {
                    name: 'Box',
                    logo: 'https://placehold.co/150',
                  },
                  openIssues: 3,
                  scanFrequency: 'Weekly',
                  severity: 'Low',
                  riskScore: 25,
                  tags: ['Onboarding'],
                  lastScan: '2024-03-14 15:30:00',
                  status: 'inactive',
                },
                {
                  id: 6,
                  integration: {
                    name: 'Box - Prod',
                    logo: 'https://placehold.co/150',
                    status: 'inactive',
                  },
                  service: {
                    name: 'Box',
                    logo: 'https://placehold.co/150',
                  },
                  openIssues: 3,
                  scanFrequency: 'Weekly',
                  severity: 'Low',
                  riskScore: 25,
                  tags: ['Onboarding'],
                  lastScan: '2024-03-14 15:30:00',
                  status: 'inactive',
                },
                {
                  id: 7,
                  integration: {
                    name: 'Box - Prod',
                    logo: 'https://placehold.co/150',
                    status: 'inactive',
                  },
                  service: {
                    name: 'Box',
                    logo: 'https://placehold.co/150',
                  },
                  openIssues: 3,
                  scanFrequency: 'Weekly',
                  severity: 'Low',
                  riskScore: 25,
                  tags: ['Onboarding'],
                  lastScan: '2024-03-14 15:30:00',
                  status: 'inactive',
                },
                {
                  id: 8,
                  integration: {
                    name: 'Box - Prod',
                    logo: 'https://placehold.co/150',
                    status: 'inactive',
                  },
                  service: {
                    name: 'Box',
                    logo: 'https://placehold.co/150',
                  },
                  openIssues: 3,
                  scanFrequency: 'Weekly',
                  severity: 'Low',
                  riskScore: 25,
                  tags: ['Onboarding'],
                  lastScan: '2024-03-14 15:30:00',
                  status: 'inactive',
                },
                {
                  id: 9,
                  integration: {
                    name: 'Box - Prod',
                    logo: 'https://placehold.co/150',
                    status: 'inactive',
                  },
                  service: {
                    name: 'Box',
                    logo: 'https://placehold.co/150',
                  },
                  openIssues: 3,
                  scanFrequency: 'Weekly',
                  severity: 'Low',
                  riskScore: 25,
                  tags: ['Onboarding'],
                  lastScan: '2024-03-14 15:30:00',
                  status: 'inactive',
                },
                {
                  id: 10,
                  integration: {
                    name: 'Box - Prod',
                    logo: 'https://placehold.co/150',
                    status: 'inactive',
                  },
                  service: {
                    name: 'Box',
                    logo: 'https://placehold.co/150',
                  },
                  openIssues: 3,
                  scanFrequency: 'Weekly',
                  severity: 'Low',
                  riskScore: 25,
                  tags: ['Onboarding'],
                  lastScan: '2024-03-14 15:30:00',
                  status: 'inactive',
                },
              ]}
              columns={[
                {
                  id: 'integration',
                  accessorKey: 'integration.name',
                  filterFn: 'arrIncludesSome',
                  enableSorting: true,
                  enableHiding: true,
                  header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Integration" />
                  ),
                  cell: ({ row }) => {
                    return (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 rounded-[4px] border-1 border-[#E4E4E8] p-0.5">
                          <AvatarImage src={row.original.integration.logo} className='rounded-[2px]' />
                          <AvatarFallback className="rounded-[2px] bg-gray-100 text-gray-600">
                            {row.original.integration.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{row.original.integration.name}</span>
                        </div>
                      </div>
                    )
                  }
                },
                {
                  id: 'service',
                  accessorKey: 'service.name',
                  enableSorting: true,
                  enableHiding: true,
                  header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Service" />
                  ),
                  cell: ({ row }) => {
                    return (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{row.original.service.name}</span>
                      </div>
                    )
                  }
                },
                {
                  id: 'openIssues',
                  accessorKey: 'openIssues',
                  enableSorting: true,
                  enableHiding: true,
                  header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Open Issues" />
                  ),
                  cell: ({ row }) => (
                    <span className="text-sm text-gray-600">{row.original.openIssues}</span>
                  )
                },
                {
                  id: 'scanFrequency',
                  accessorKey: 'scanFrequency',
                  filterFn: 'arrIncludesSome',
                  enableSorting: true,
                  enableHiding: true,
                  header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Scan Frequency" />
                  ),
                  cell: ({ row }) => (
                    <span className="text-sm text-gray-600">{row.original.scanFrequency}</span>
                  )
                },
                {
                  id: 'riskScore',
                  accessorKey: 'riskScore',
                  enableSorting: true,
                  enableHiding: true,
                  header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Risk Score" />
                  ),
                  cell: ({ row }) => (
                    <div className="flex items-center justify-start">
                      <CircularProgress size={16} value={row.original.riskScore} strokeWidth={2.5} />
                    </div>
                  )
                },
                {
                  id: 'tags',
                  accessorKey: 'tags',
                  enableHiding: true,
                  header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Tags" />
                  ),
                  cell: ({ row }) => (
                    <div className="flex gap-1.5">
                      {row.original.tags.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )
                },
                {
                  id: 'status',
                  accessorKey: 'status',
                  filterFn: 'arrIncludesSome',
                  enableSorting: true,
                  enableHiding: true,
                  header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Status" />
                  ),
                  cell: ({ row }) => {
                    const date = new Date(row.original.lastScan);
                    return (
                      <span className="text-sm text-gray-600">
                        {date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    )
                  }
                },
                {
                  id: 'actions',
                  header: 'Actions',
                  accessorKey: 'actions',
                  cell: () => (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <IconDotsVertical className="h-4 w-4 text-gray-500" />
                    </Button>
                  )
                }
              ]}
              tableToolbar={{
                ...tableToolbar,
                searchTerm,
                setSearchTerm,
              }}
              fetchData={() => { }}
              totalCount={200}
              loading={false}
              tableId="dashboard-integrations"
            />
          </TabsContent>
          <TabsContent value="available" className="mt-4">
            <div className="grid grid-cols-4 gap-4">
              <IntegrationCard
                name="Appian"
                logo="https://seeklogo.com/images/A/appian-logo-7700B1B69B-seeklogo.com.png"
                description="Appian is the leading platform for process orchestration, automation, and intelligence."
              />
              <IntegrationCard
                name="Appian"
                logo="https://seeklogo.com/images/A/appian-logo-7700B1B69B-seeklogo.com.png"
                description="Appian is the leading platform for process orchestration, automation, and intelligence."
              />
              <IntegrationCard
                name="Appian"
                logo="https://seeklogo.com/images/A/appian-logo-7700B1B69B-seeklogo.com.png"
                description="Appian is the leading platform for process orchestration, automation, and intelligence."
              />
              <IntegrationCard
                name="Appian"
                logo="https://seeklogo.com/images/A/appian-logo-7700B1B69B-seeklogo.com.png"
                description="Appian is the leading platform for process orchestration, automation, and intelligence."
              />
              <IntegrationCard
                name="Appian"
                logo="https://seeklogo.com/images/A/appian-logo-7700B1B69B-seeklogo.com.png"
                description="Appian is the leading platform for process orchestration, automation, and intelligence."
              />
              <IntegrationCard
                name="Appian"
                logo="https://seeklogo.com/images/A/appian-logo-7700B1B69B-seeklogo.com.png"
                description="Appian is the leading platform for process orchestration, automation, and intelligence."
              />
            </div>
            {/* Content for Available Integrations */}
          </TabsContent>
        </Tabs>

        <div className='grid grid-cols-2 gap-4'>
          <OpenResolvedLineChart
            key="dashboard-line-chart"
            data={data}
            customLegend={(
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-[2px] bg-[#B1241A]"></div>
                  <span className="text-sm text-gray-600">Open</span>
                  <span className="font-[600] text-[12px] leading-[14px] px-2 py-[2px] text-[#B1241A] bg-[#FDEDED] rounded-md">
                    {30}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-[2px] bg-[#077D48]"></div>
                  <span className="text-sm text-gray-600">Resolved</span>
                  <span className="font-[600] text-[12px] leading-[14px] px-2 py-[2px] text-[#077D48] bg-[#E6F4EE] rounded-md">
                    {28}
                  </span>
                </div>
              </div>
            )}
          />
          <SeverityChartExample />
          <ComplianceCardExample />
          <HoursChart data={{
            labels: ['', "24' Dec", '', "Jan", '', "Feb", '', "Mar", '', "Apr", ''],
            datasets: [
              {
                label: 'Open',
                data: [1, 2, 2.5, 3, 2.6, 6, 3, 3.5, 3.6, 3.7, 3.5],
                borderColor: '#7377E3',
                tension: 0.1,
                borderWidth: 2,
                pointBackgroundColor: Array(10).fill('transparent').concat('#fff'),
                pointBorderColor: Array(10).fill('transparent').concat("#7377E3"),
                pointRadius: Array(10).fill(0).concat(6),
                pointHoverRadius: Array(10).fill(0).concat(6),
                pointBorderWidth: Array(10).fill(0).concat(2),
              },
            ]
          }} className="h-[260px]" />
        </div>
        <div className='grid grid-cols-4 gap-4 border border-[#E4E4E8] shadow-[0px_1px_2px_0px_#1018280D] p-3 rounded-[8px]'>
          <ComplianceScoreCard
            title="Critical Score Example"
            logo="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/AICPA_SOC_Logo.png/120px-AICPA_SOC_Logo.png"
            score={19}
            data={[10, 10, 10, 5, 5, 7, 8]}
          />
          <ComplianceScoreCard
            title="Low Score Example"
            logo="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/AICPA_SOC_Logo.png/120px-AICPA_SOC_Logo.png"
            score={80}
            data={[10, 10, 10, 5, 5, 7, 8]}
          />
          <ComplianceScoreCard
            title="Hihg Score Example"
            logo="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/AICPA_SOC_Logo.png/120px-AICPA_SOC_Logo.png"
            score={45}
            data={[10, 10, 10, 5, 5, 7, 8]}
          />
          <ComplianceScoreCard
            title="Medium Score Example"
            logo="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/AICPA_SOC_Logo.png/120px-AICPA_SOC_Logo.png"
            score={75}
            data={[10, 10, 10, 5, 5, 7, 8]}
          />
        </div>
        <HistoryTimeline history={[
          {
            date: "19/03/2025",
            time: "08:30 PM",
            type: "Severity Changed",
            details: [{ title: "High", type: "high" }, { title: "Low", type: "low" }],
            user: { initials: "RS", name: "Rahul Sharma", badge: "RS", image: "https://placehold.co/150" }
          },
          {
            date: "19/03/2025",
            time: "06:45 PM",
            type: "Manual Scan Executed",
            details: [{ finding: 2, open: 2, resolved: 5 }],
            user: { initials: "RS", name: "Rahul Sharma", badge: "RS", image: "https://placehold.co/150" }
          },
          {
            date: "19/03/2025",
            time: "04:45 PM",
            type: "Description Updated",
            details: ['Rule description refined to include "MFA verification" checks.'],
            user: { initials: "PL", name: "Phillip Lang", badge: "PL", image: "https://placehold.co/150" }
          },
          {
            date: "19/03/2025",
            time: "03:30 PM",
            type: "Rule Renamed",
            details: ['Rule renamed from "Appian Access Control Check" to "Security Configuration Check" by Admin.'],
            user: { initials: "GK", name: "Gaurav Khanna", badge: "GK", image: "https://placehold.co/150" }
          },
          {
            date: "19/03/2025",
            time: "12:30 PM",
            type: "Severity Changed",
            details: [{ title: "Critical", type: "critical" }, { title: "High", type: "high" }],
            user: { initials: "RS", name: "Rahul Sharma", badge: "RS", image: "https://placehold.co/150" }
          },
          {
            date: "19/03/2025",
            time: "10:30 AM",
            type: "Daily Scan Executed",
            details: [{ finding: 12, open: 12, resolved: 7 }],
            user: { initials: "RS", name: "Rahul Sharma", badge: "RS", image: "https://placehold.co/150" }
          },
          {
            date: "19/03/2025",
            time: "10:30 AM",
            type: "Rule Assigned",
            details: [{
              service: {
                name: 'Appian India',
                logo: 'https://placehold.co/150',
                id: 'appian-india'
              }
            }],
            user: { initials: "RS", name: "Rahul Sharma", badge: "RS", image: "https://placehold.co/150" }
          },
        ]} />
        <CommentSection onSubmit={(message) => { console.log(message) }} isShowComments={false} />
        <Dialog
          type={DialogType.SUCCESS}
          icon={<IconLockCheck className="h-9 w-9 text-[#077D48]" />}
          title="Password Updated!"
          description="Your password has been successfully reset!"
          trigger={<Button variant="outline">Open Dialog</Button>}
          actions={[
            { label: "Close", variant: "ghost" }
          ]}
        />
        <SideDrawer
          header={(
            <div className='mr-auto relative left-5 top-8 flex items-center gap-2'>
              <Avatar className="h-17 w-17 rounded-[10px] border-2 border-[#E4E4E8] p-0 bg-white">
                <AvatarImage src="https://placehold.co/150" className='rounded-[0px]' />
                <AvatarFallback className="rounded-[0px] bg-white text-gray-600 text-[32px]">
                  {"A"}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          open={false}
          onClose={() => { }}
        >
          <div>Content</div>
        </SideDrawer>
      </div>
    </div>
  )
}
