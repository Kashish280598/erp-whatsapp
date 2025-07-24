import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface CircularProgressProps {
    value: number;
    className?: string;
    size?: number;
    strokeWidth?: number;
    animationDuration?: number;
    fontSize?: number;
}

const getColorByValue = (value: number): string => {
    if (value <= 25) return '#099456';
    if (value <= 50) return '#F79211';
    if (value <= 75) return '#B1241A';
    return '#851D13';
};

export const CircularProgress = ({
    value,
    className,
    size = 40,
    strokeWidth = 3,
    animationDuration = 1000,
    fontSize = 13
}: CircularProgressProps) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    // Calculate dimensions based on size
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Calculate stroke offset for progress
    const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

    // Get color based on current animated value
    const currentColor = getColorByValue(animatedValue);

    useEffect(() => {
        // Reset animation when value changes
        setAnimatedValue(0);

        // Start animation
        const startTime = Date.now();
        const animate = () => {
            const currentTime = Date.now();
            const progress = (currentTime - startTime) / animationDuration;

            if (progress < 1) {
                setAnimatedValue(Math.min(value * progress, value));
                requestAnimationFrame(animate);
            } else {
                setAnimatedValue(value);
            }
        };

        requestAnimationFrame(animate);
    }, [value, animationDuration]);

    return (
        <div className={cn("inline-flex items-center gap-1", className)}>
            <div className="relative">
                <svg
                    width={size}
                    height={size}
                    className="transform -rotate-90"
                    viewBox={`0 0 ${size} ${size}`}
                >
                    {/* Background circle */}
                    <circle
                        className="text-[#F4F4F6]"
                        strokeWidth={strokeWidth}
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx={center}
                        cy={center}
                    />
                    {/* Progress circle */}
                    <circle
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke={currentColor}
                        fill="transparent"
                        r={radius}
                        cx={center}
                        cy={center}
                        className="transition-all duration-300 ease-out"
                        style={{
                            transform: 'rotate(0deg)',
                            transformOrigin: 'center',
                            animation: 'spin 1s ease-out'
                        }}
                    />
                </svg>
            </div>
            <span
                className="whitespace-nowrap transition-all duration-200"
                style={{
                    fontSize: `${fontSize}px`,
                    fontWeight: 400,
                    color: 'black'
                }}
            >
                {Math.round(animatedValue)}%
            </span>
        </div>
    );
};