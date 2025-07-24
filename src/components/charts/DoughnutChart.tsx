import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent } from '@/components/ui/card';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
    labels: ['Microsoft 365', 'Appian', 'Google', 'Confluence'],
    datasets: [
        {
            data: [45, 25, 20, 18, 80],
            backgroundColor: [
                '#C9B5F4', // Microsoft 365
                '#B4D7F8', // Appian
                '#E6B6F6', // Google
                '#B3F1F7', // Confluence
                '#F4F4F6'
            ],
            borderWidth: 4,
            borderColor: '#fff',
            cutout: '70%',
            spacing: 5,
            borderRadius: 8
        },
    ],
};

const options = {
    cutout: '75%',
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: false,
        },
    },
};

export default function DoughnutChart() {
    const total = 180;
    const current = 108;
    const percentage = Math.round((current / total) * 100);

    return (
        <Card className="w-full max-w-md p-6 rounded-xl shadow-sm border border-gray-200">
            <CardContent className="flex justify-between items-center gap-6">
                <div className="relative w-48 h-48">
                    <Doughnut data={data} options={options} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
                        <span className="mt-1 text-sm px-2 py-1 rounded bg-orange-100 text-orange-600 font-medium">
                            {current}/{total}
                        </span>
                    </div>
                </div>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-[#C9B5F4]" />
                        <span className="text-gray-700">Microsoft 365</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-[#B4D7F8]" />
                        <span className="text-gray-700">Appian</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-[#E6B6F6]" />
                        <span className="text-gray-700">Google</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-[#B3F1F7]" />
                        <span className="text-gray-700">Confluence</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
