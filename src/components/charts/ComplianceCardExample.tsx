import ComplianceCard from './ComplianceCard';
import { toast } from 'sonner';

export default function ComplianceCardExample() {
    const integrations = [
        {
            name: "Zoom",
            logo: "https://cdn-icons-png.flaticon.com/512/5968/5968672.png"
        },
        {
            name: "Auth0",
            logo: "https://cdn-icons-png.flaticon.com/512/5969/5969065.png"
        },
        {
            name: "OneLogin",
            logo: "https://cdn-icons-png.flaticon.com/512/5969/5969074.png"
        }
    ];

    return (
        <div className="col-span-2 grid grid-cols-3 gap-7">
            {/* Critical Score Example */}
            <ComplianceCard
                title="Critical Score Example"
                logo="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/AICPA_SOC_Logo.png/120px-AICPA_SOC_Logo.png"
                score={19}
                total={100}
                data={[10, 10, 10, 5, 5, 7, 8]}
                integrations={integrations}
                onClick={() => toast.info('Clicked on Critical Card')}
            />

            {/* High Score Example */}
            <ComplianceCard
                title="High Score Example"
                logo="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/AICPA_SOC_Logo.png/120px-AICPA_SOC_Logo.png"
                score={45}
                total={100}
                data={[30, 35, 40, 42, 43, 44, 45]}
                integrations={integrations}
                onClick={() => toast.info('Clicked on High Card')}
            />

            {/* Medium Score Example */}
            <ComplianceCard
                title="Medium Score Example"
                logo="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/AICPA_SOC_Logo.png/120px-AICPA_SOC_Logo.png"
                score={65}
                total={100}
                data={[50, 55, 58, 60, 62, 64, 65]}
                integrations={integrations}
                onClick={() => toast.info('Clicked on Medium Card')}
            />

            {/* Low Score Example */}
            <ComplianceCard
                title="Low Score Example"
                logo="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/AICPA_SOC_Logo.png/120px-AICPA_SOC_Logo.png"
                score={85}
                total={100}
                data={[70, 75, 78, 80, 82, 84, 85]}
                integrations={integrations}
                onClick={() => toast.info('Clicked on Low Card')}
            />
        </div>
    );
} 