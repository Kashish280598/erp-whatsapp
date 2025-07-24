import SeverityChart from './SeverityChart';

// Define severity types with their respective colors
const severityTypes = {
    critical: {
        title: 'Critical',
        color: {
            primary: '#851D13',
            background: '#F3E8E7',
            indicator: '#851D13',
            text: '#070822',
            gradient1: '#F3E8E7',
            gradient2: '#FFFFFF',
            disabled: {
                primary: 'rgba(186, 186, 196, 1)',
                indicator: '#851D13',
                text: 'rgba(186, 186, 196, 1)'
            }
        }
    },
    high: {
        title: 'High',
        color: {
            primary: '#B1241A',
            background: '#FDEDED',
            indicator: '#B1241A',
            text: '#070822',
            gradient1: '#FDEDED',
            gradient2: '#FFFFFF',
            disabled: {
                primary: 'rgba(186, 186, 196, 1)',
                indicator: '#B1241A',
                text: 'rgba(186, 186, 196, 1)'
            }
        }
    },
    medium: {
        title: 'Medium',
        color: {
            primary: '#F79211',
            background: '#FEF6EC',
            indicator: '#F79211',
            text: '#070822',
            gradient1: '#FEF6EC',
            gradient2: '#FFFFFF',
            disabled: {
                primary: 'rgba(186, 186, 196, 1)',
                indicator: '#F79211',
                text: 'rgba(186, 186, 196, 1)'
            }
        }
    },
    low: {
        title: 'Low',
        color: {
            primary: '#077D48',
            background: '#E6F4EE',
            indicator: '#077D48',
            text: '#070822',
            gradient1: '#E6F4EE',
            gradient2: '#FFFFFF',
            disabled: {
                primary: 'rgba(186, 186, 196, 1)',
                indicator: '#077D48',
                text: 'rgba(186, 186, 196, 1)'
            }
        }
    }
};

export default function SeverityChartExample() {
    return (
        <div className="grid grid-cols-2 gap-4 border-2 border-gray-200 rounded-lg p-3">
            <SeverityChart
                title={severityTypes.critical.title}
                value={65}
                data={[0, 10, 5, 15]}
                color={severityTypes.critical.color}
                type="critical"
            />
            <SeverityChart
                title={severityTypes.high.title}
                value={42}
                data={[0, 15, 10, 20]}
                color={severityTypes.high.color}
                type="high"
            />
            <SeverityChart
                title={severityTypes.medium.title}
                value={28}
                data={[0, 8, 15, 12]}
                color={severityTypes.medium.color}
                type="medium"
            />
            <SeverityChart
                title={severityTypes.low.title}
                value={15}
                data={[0, 5, 3, 8]}
                color={severityTypes.low.color}
                type="low"
            />
        </div>
    );
} 