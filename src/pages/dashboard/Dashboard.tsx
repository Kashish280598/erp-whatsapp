import React from 'react';
import { MetabaseDashboard } from '@/components/MetabaseDashboard';
// import React, { useState, Suspense } from 'react';
// import { DataTable } from '@/components/custom/table/data-table';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import type { TableToolbar } from '@/types/table.types';
// import { IconDotsVertical, IconLockCheck } from '@tabler/icons-react';
// import { Button } from '@/components/ui/button';
// import { CircularProgress } from '@/components/custom/CircularProgress';
// import { DataTableColumnHeader } from '@/components/custom/table/data-table/data-table-column-header';
// import TabListContainer from '@/components/custom/TabListContainer';
// import { toast } from "sonner";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Calendar } from '@/components/ui/calendar';
// import { DialogType } from '@/components/custom/Dialog';

// const Dialog = React.lazy(() => import('@/components/custom/Dialog').then(m => ({ default: m.Dialog })));
// const SideDrawer = React.lazy(() => import('@/components/custom/SideDrawer').then(m => ({ default: m.SideDrawer })));
// const IntegrationCard = React.lazy(() => import('@/components/custom/IntegrationCard').then(m => ({ default: m.IntegrationCard })));
// const Gauge = React.lazy(() => import('@/components/charts/Gauge'));
// const DoughnutChart = React.lazy(() => import('@/components/charts/DoughnutChart'));
// const PasswordStrengthChecker = React.lazy(() => import('@/components/custom/PasswordStrengthChecker'));
// const OpenResolvedLineChart = React.lazy(() => import('@/components/charts/OpenResolvedLineChart'));
// const SeverityChartExample = React.lazy(() => import('@/components/charts/SeverityChartExample'));
// const ComplianceCardExample = React.lazy(() => import('@/components/charts/ComplianceCardExample'));
// const HoursChart = React.lazy(() => import('@/components/charts/HoursChart'));
// const ComplianceScoreCard = React.lazy(() => import('@/components/charts/ComplianceScoreCard '));
// const HistoryTimeline = React.lazy(() => import('@/components/custom/HistoryTimeline'));
// const CommentSection = React.lazy(() => import('@/components/custom/Comments'));

// const data = {
//   labels: ['', "24' Nov", '', "24' Dec", '', "Jan", '', "Feb", '', "Mar", '', "Apr", ''],
//   datasets: [
//     {
//       label: 'Open',
//       data: [0, 2, 5, 7, 8, 12, 16, 20, 22, 25, 26, 27, 30],
//       borderColor: '#B1241A',
//       fill: true,
//       tension: 0.3,
//       pointBorderWidth: 2,
//       pointRadius: 0,
//       pointHoverRadius: 0,
//       borderWidth: 1.5,
//       backgroundColor: function (context: any) {
//         const chart = context.chart;
//         const { ctx } = chart;
//         const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
//         gradient.addColorStop(0, '#b1241a26');
//         gradient.addColorStop(1, 'rgba(253, 237, 237, 0)');
//         return gradient;
//       },
//     },
//     {
//       label: 'Resolved',
//       data: [0, 1, 5, 5, 15, 15, 15, 15, 22, 24, 24, 24, 29],
//       borderColor: '#077D48',
//       fill: true,
//       tension: 0.3,
//       pointBorderWidth: 2,
//       pointRadius: 0,
//       pointHoverRadius: 0,
//       borderWidth: 1.5,
//       backgroundColor: function (context: any) {
//         const chart = context.chart;
//         const { ctx } = chart;
//         const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
//         gradient.addColorStop(0, '#077d4826');
//         gradient.addColorStop(1, 'rgba(230, 244, 238, 0)');
//         return gradient;
//       },
//     }
//   ]
// };
export default function Dashboard() {
  // const tableToolbar: TableToolbar = {
  //   enableSearch: true,
  //   enableFilter: true,
  //   searchPlaceholder: 'Search by Name...',
  //   filterOptions: [
  //     {
  //       field: 'integration',
  //       title: 'Integration',
  //       options: [
  //         { label: 'Appian India', value: 'Appian India' },
  //         { label: 'Auth0 Prod', value: 'Auth0 Prod' },
  //         { label: 'OneLogin Prod', value: 'OneLogin Prod' },
  //         { label: 'Box - Prod', value: 'Box - Prod' },
  //       ],
  //     },
  //     {
  //       field: 'status',
  //       title: 'Status',
  //       options: [
  //         { label: 'Active', value: 'active' },
  //         { label: 'Inactive', value: 'inactive' },
  //       ],
  //     },
  //     {
  //       field: 'scanFrequency',
  //       title: 'Scan Frequency',
  //       options: [
  //         { label: 'Daily', value: 'daily' },
  //         { label: 'Weekly', value: 'weekly' },
  //         { label: 'Monthly', value: 'monthly' },
  //       ],
  //     },
  //   ],
  // };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-4 md:mb-6 px-4 md:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-primary-400 mb-2">Dashboard</h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-500 dark:text-gray-400">Overview of your ERP system analytics and insights.</p>
      </div>
      
      {/* Metabase Analytics Dashboard */}
      <div className="flex-1 flex flex-col min-h-0 w-full">
        <div className="mb-4 md:mb-6 px-4 md:px-6 lg:px-8">
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 text-neutral-800 dark:text-primary-400">Analytics Overview</h3>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
            View real-time analytics and insights from your ERP system data.
          </p>
        </div>
        
        <div className="flex-1 min-h-[500px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] w-full px-4 md:px-6 lg:px-8">
          <MetabaseDashboard 
            title="ERP Analytics Dashboard"
            showControls={true}
            theme="auto"
            debug={false} // Disable debug mode
            onLoad={() => console.log('Metabase dashboard loaded')}
            onError={(error) => console.error('Metabase dashboard error:', error)}
          />
        </div>
      </div>

      {/* Rest of your dashboard content can go here */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <CardDescription>
              You have 3 unread messages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
}
