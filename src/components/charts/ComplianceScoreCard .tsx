import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
    Tooltip,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { useEffect, useRef, useState, useMemo, memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

interface ColorConfig {
    primary: string;
    background: string;
    indicator: string;
    text: string;
    gradient1: string;
    gradient2: string;
}

interface ComplianceCardProps {
    title: string;
    logo: string;
    score: number;
    data: number[];
    labels?: string[];
    onClick?: () => void;
    colorConfig?: ColorConfig;
}

const defaultColors: Record<string, ColorConfig> = {
    critical: {
        primary: '#B1241A',
        background: '#FDEDED',
        indicator: '#B1241A',
        text: '#B1241A',
        gradient1: '#FDEDED',
        gradient2: '#FFFFFF'
    },
    high: {
        primary: '#F04438',
        background: '#FEF3F2',
        indicator: '#F04438',
        text: '#F04438',
        gradient1: '#FEF3F2',
        gradient2: '#FFFFFF'
    },
    medium: {
        primary: '#F79009',
        background: '#FFFAEB',
        indicator: '#F79009',
        text: '#F79009',
        gradient1: '#FFFAEB',
        gradient2: '#FFFFFF'
    },
    low: {
        primary: '#039855',
        background: '#ECFDF3',
        indicator: '#039855',
        text: '#039855',
        gradient1: '#ECFDF3',
        gradient2: '#FFFFFF'
    }
};

const getColorConfigByScore = (score: number): ColorConfig => {
    if (score <= 25) return defaultColors.critical;
    if (score <= 50) return defaultColors.high;
    if (score <= 75) return defaultColors.medium;
    return defaultColors.low;
};

const createChartOptions = (): ChartOptions<'line'> => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            display: false,
            grid: {
                display: false
            }
        },
        y: {
            display: false,
            beginAtZero: true,
            min: 0,
            grid: {
                color: '#E4E4E8',
                display: false
            },
            border: {
                display: false
            }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: false
        }
    },
    elements: {
        line: {
            tension: 0.1
        }
    }
});

function ComplianceCardComponent({
    title,
    logo,
    score,
    data,
    labels = ['', '', '', '', '', '', ''],
    onClick,
    colorConfig: customColorConfig
}: ComplianceCardProps) {
    const chartRef = useRef<any>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Get color config based on score or use custom colors
    const colorConfig = useMemo(() => 
        customColorConfig || getColorConfigByScore(score)
    , [customColorConfig, score]);

    // Memoize chart options
    const chartOptions = useMemo(() => createChartOptions(), [isHovered]);

    // Memoize chart data
    const chartData = useMemo(() => ({
        labels,
        datasets: [
            {
                data,
                fill: true,
                borderColor: isHovered ? colorConfig.primary : '#BABAC4',
                borderWidth: 2,
                tension: 0,
                pointRadius: 0,
                backgroundColor: function (context: any) {
                    const chart = context.chart;
                    const { ctx } = chart;
                    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                    gradient.addColorStop(0, isHovered ? colorConfig.gradient1 : 'rgb(244, 244, 246)');
                    gradient.addColorStop(1, '#FFFFFF');
                    return gradient;
                },
            },
        ],
    }), [isHovered, data, labels, colorConfig]);

    useEffect(() => {
        return () => {
            if (chartRef.current?.chartInstance) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, []);

    return (
        <Card
            className={`rounded-[8px]  overflow-hidden transition-all duration-200 cursor-pointer border border-transparent ${isHovered ? 'border border-[#E4E4E8] shadow-[0px_1px_2px_0px_#1018280D]' : 'shadow-none'} p-0 gap-0`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="flex justify-between items-center p-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-5 w-5 rounded-[4px] border-1 border-[#E4E4E8] p-0.5 overflow-hidden">
                        <AvatarImage src={logo} className='rounded-[4px] object-cover overflow-hidden' />
                        <AvatarFallback className="rounded-[4px] bg-gray-100 text-gray-600 text-[10px]">
                            {title.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-[600] text-[13px] text-neutral line-clamp-1">
                        {title}
                    </span>
                </div>
                {/* Score section */}
                <div 
                    className="px-3 py-1 rounded-[8px] whitespace-nowrap text-[13px] font-[600]"
                    style={{
                        backgroundColor: colorConfig.background,
                        color: colorConfig.text
                    }}
                >
                    {score}%
                </div>
            </div>

            <div className="h-13 px-0 mt-5">
                <Line data={chartData} options={chartOptions} ref={chartRef} />
            </div>
        </Card>
    );
}

// Memoize the entire component
export default memo(ComplianceCardComponent);
