import React, { useEffect, useState } from "react";

interface SegmentGaugeProps {
    totalSegments?: number;
    filledSegments?: number;
    className?: string;
}

const SegmentGauge: React.FC<SegmentGaugeProps> = ({
    totalSegments = 15,
    filledSegments = 7,
    className = ''
}) => {
    const [currentFilled, setCurrentFilled] = useState(0);

    useEffect(() => {
        // Start from 0 and animate to the target number
        setCurrentFilled(0);
        const timer = setTimeout(() => {
            setCurrentFilled(filledSegments);
        }, 100); // Small delay to ensure the initial state is rendered

        return () => clearTimeout(timer);
    }, [filledSegments]);

    const generateSVGString = () => {
        const fullSize = 200;
        const angleStep = 180 / (totalSegments - 1);
        const center = fullSize / 2;

        const segmentPath = `
            M7.72235 1.2871C8.53421 1.37089 9.09485 2.13967 8.92641 2.93816
            L5.97411 16.9336C5.83741 17.5816 5.25782 18.0396 4.59568 18.0229
            L1.94723 17.9561C1.19392 17.9371 0.596162 17.3149 0.607337 16.5614
            L0.822162 2.07702C0.834119 1.27084 1.53439 0.648494 2.33643 0.731266
            L7.72235 1.2871Z
        `;

        const segmentOriginX = center - 4.5;
        const segmentOriginY = center - 80;

        let segments = "";
        for (let i = 0; i < totalSegments; i++) {
            const angle = -90 + i * angleStep;
            const isFilled = i < currentFilled;
            const transitionDelay = i * 50; // Stagger the animations

            segments += `
              <g transform="translate(${segmentOriginX}, ${segmentOriginY}) rotate(${angle}, ${center - segmentOriginX}, ${center - segmentOriginY})">
                <path d="${segmentPath.trim()}" fill="${isFilled ? "#F79211" : "#F4F4F6"}">
                    <animate
                        attributeName="fill"
                        values="${i < filledSegments ? "#F4F4F6;#F79211" : "#F4F4F6"}"
                        dur="1s"
                        begin="${transitionDelay}ms"
                        fill="freeze"
                    />
                </path>
              </g>
            `;
        }

        const needleAngle = -90 + (currentFilled - 1) * angleStep;

        const needlePath = `
            M -4 0
            Q 0 -100 4 0
            Q 0 -10 -4 0
            Z
        `;

        const needle = `
          <g transform="translate(${center}, ${center})">
            <g>
              <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="-90"
                  to="${needleAngle}"
                  dur="0.8s"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
              />
              <path d="${needlePath}" fill="#070822" />
            </g>
          </g>
        `;

        const centerCircle = `
            <circle cx="${center}" cy="${center}" r="10" fill="#070822" />
        `;

        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg"
               width="${fullSize}" height="${center}"
               viewBox="0 0 ${fullSize} ${center + 15}">
            ${segments}
            ${needle}
            ${centerCircle}
          </svg>
        `;

        return svg;
    };

    const svgString = generateSVGString();
    const getImageSrc = () => {
        const encoded = encodeURIComponent(svgString)
            .replace(/'/g, "%27")
            .replace(/"/g, "%22");

        return `data:image/svg+xml,${encoded}`;
    };

    const src = getImageSrc();

    return (
        <>
            <div className={`flex justify-center items-center ${className}`}>
                <img src={src} alt="gauge" />
            </div>
        </>
    );
};

export default SegmentGauge;
