import React, { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Filler,
    Legend,
    PointElement,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    PointElement,
    Tooltip,
    Filler,
    Legend
);

interface LineChartProps {
    data: any;
    customLegend: React.ReactNode;
}

const OpenResolvedLineChart: React.FC<LineChartProps> = ({
    data,
    customLegend
}) => {
    const chartRef = useRef<any>(null);

    useEffect(() => {
        // Cleanup function
        return () => {
            const chart = chartRef.current?.chartInstance;
            if (chart) {
                chart.destroy();
            }
        };
    }, []);

    const maxValue = Math.max(
        ...data.datasets.flatMap((a: any) => a.data)
    );
    const roundedMax = Math.ceil(maxValue);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 0,
                right: 0
            },
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false,
                    drawBorder: false,
                    drawOnChartArea: false,
                    drawTicks: false,
                },
                ticks: {
                    display: true,
                    color: '#5E5F6E',
                    font: {
                        size: 12,
                    },
                    padding: 16,
                },
                border: {
                    display: true,
                    width: 2,
                    color: '#E4E4E8',
                },
                afterFit: (scale: any) => {
                    scale.paddingRight = 0;
                }
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
                    display: true,
                    color: '#5E5F6E',
                    font: {
                        size: 12,
                    },
                    padding: 12,
                    stepSize: 8,
                    callback: function (value: any) {
                        return value === 0 ? value : value;
                    }
                },
                min: 0,
                max: roundedMax,
                beginAtZero: true,
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
                displayColors: false,
                usePointStyle: false,
            }
        }
    };

    return (
        <div className="border-2 border-gray-200 rounded-lg pt-4 px-0 flex flex-col gap-4 overflow-hidden">
            {/* Legend */}
            {customLegend ? customLegend : ''}
            {/* Chart */}
            <div className='w-full h-[90%]'>
                <Line
                    redraw={true}
                    ref={chartRef}
                    options={options}
                    data={data}
                />
            </div>
        </div>
    );
};

export default OpenResolvedLineChart;