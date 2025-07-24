import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef, useState, useMemo, memo } from 'react';
import {
    Tooltip as TooltipUI,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip"
import SeverityChip from '../custom/SeverityChip';

ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Filler
);

interface SeverityChartProps {
    title: string;
    value: number;
    type: 'critical' | 'high' | 'medium' | 'low';
    data: number[];
    color: {
        primary: string;
        background: string;
        indicator: string;
        text: string;
        gradient1: string;
        gradient2: string;
        disabled?: {
            primary: string;
            indicator: string;
            text: string;
        };
    };
    labels?: string[];
}

const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: '#5E5F6E',
                font: {
                    size: 12,
                },
            },
            border: {
                display: true,
                width: 2,
                color: '#E4E4E8',
            },
        },
        y: {
            display: true,
            border: {
                display: false,
                dash: [2, 10],
                dashOffset: 0,
            },
            grid: {
                color: '#E4E4E8',
                lineWidth: 2,
                tickBorderDash: [0, 16],
            },
            ticks: {
                display: false,
            },
        },
    },
};

// Memoize the point arrays since they only depend on data length
const createPointArrays = (dataLength: number, lastValue: string) => ({
    pointBackgroundColor: Array(dataLength - 1).fill('transparent').concat('#fff'),
    pointBorderColor: Array(dataLength - 1).fill('transparent').concat(lastValue),
    pointRadius: Array(dataLength - 1).fill(0).concat(6),
    pointHoverRadius: Array(dataLength - 1).fill(0).concat(6),
    pointBorderWidth: Array(dataLength - 1).fill(0).concat(2),
});

function SeverityChartComponent({
    title,
    value,
    type,
    data,
    color,
    labels = ["Oct '24", "Dec '24", "Feb", "Apr"]
}: SeverityChartProps) {
    const chartRef = useRef<any>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Memoize point arrays
    const pointArrays = useMemo(
        () => createPointArrays(data.length, color.indicator),
        [data.length, color.indicator]
    );

    // Memoize chart data
    const chartData = useMemo(() => ({
        labels,
        datasets: [
            {
                label: title,
                data: data,
                borderColor: isHovered ? color.primary : (color.disabled?.primary || 'rgba(186, 186, 196, 1)'),
                tension: 0.1,
                fill: true,
                borderWidth: 1,
                ...pointArrays,
                backgroundColor: function (context: any) {
                    const chart = context.chart;
                    const { ctx } = chart;
                    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                    gradient.addColorStop(0, isHovered ? color.gradient1 : 'rgb(244, 244, 246)');
                    gradient.addColorStop(1, isHovered ? color.gradient2 : '#FFFFFF');
                    return gradient;
                },
            },
        ],
    }), [isHovered, title, data, color, labels, pointArrays]);

    // Cleanup chart instance on unmount
    useEffect(() => {
        return () => {
            if (chartRef.current?.chartInstance) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, []);

    return (
        <TooltipProvider>
            <Card
                className={`rounded-xl shadow-none p-0 transition-all duration-200 border border-transparent ${isHovered && "shadow-sm border border-gray-200"} hover:shadow-sm hover:border hover:border-gray-200 cursor-pointer`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <TooltipUI>
                    <TooltipTrigger asChild>
                        <CardContent className="p-4">
                            <SeverityChip title={title} value={value} type={type} />
                            <div className="mt-2 h-24">
                                <Line data={chartData} options={defaultOptions} ref={chartRef} />
                            </div>
                        </CardContent>
                    </TooltipTrigger>
                    <TooltipContent
                        className="bg-white px-4 py-3 text-sm text-gray-600 border border-gray-100 shadow-lg rounded-lg max-w-[250px]"
                        sideOffset={5}
                        side="bottom"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        Click to filter the table and view only <span className="font-semibold text-gray-900">{title}</span> issues.
                    </TooltipContent>
                </TooltipUI>
            </Card>
        </TooltipProvider>
    );
}

// Memoize the entire component
export default memo(SeverityChartComponent);
