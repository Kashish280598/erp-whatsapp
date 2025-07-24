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
import annotationPlugin from 'chartjs-plugin-annotation';

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
    Legend,
    annotationPlugin
);

interface LineChartProps {
    data: any;
    className?: string;
}

const HoursChart: React.FC<LineChartProps> = ({
    data,
    className
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

    const lastValue = data.datasets[0].data[data.datasets[0].data.length - 1];

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 0,
                right: 15, // Add padding for label
                top: 10,   // Add padding for date label
                bottom: 0
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
                    stepSize: 2,
                    callback: function (value: any) {
                        return value === 0 ? value : value + "h";
                    }
                },
                min: 0,
                max: roundedMax + 3, // Increased to accommodate label
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
            },
            annotation: {
                clip: false, // Important: Prevents labels from being clipped
                annotations: {
                    label1: {
                        type: 'label',
                        xValue: data.labels.length - 1.3,
                        yValue: data.datasets[0].data[data.datasets[0].data.length - 1] + 1.2,
                        backgroundColor: 'transparent',
                        color: '#111827',
                        content: lastValue + "h",
                        font: {
                            size: 18,
                            weight: 'bold',
                            family: "'Inter', sans-serif",
                        },
                    },
                    label2: {
                        type: 'label',
                        xValue: data.labels.length - 2.1,
                        yValue: data.datasets[0].data[data.datasets[0].data.length - 1] + 2.5,
                        backgroundColor: 'transparent',
                        color: '#6B7280',
                        content: 'Today - 02/04/2025',
                        font: {
                            size: 14,
                            weight: 'normal',
                            family: "'Inter', sans-serif",
                        },
                    }
                }
            }
        }
    };

    return (
        <div className={`border-2 border-gray-200 rounded-lg pt-4 px-0 flex flex-col gap-4 overflow-hidden ${className}`}>
            <Line
                redraw={true}
                ref={chartRef}
                options={options as any}
                data={data}
            />
        </div>
    );
};

export default HoursChart;