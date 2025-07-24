import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { IconChevronRight } from "@tabler/icons-react";
import { memo } from "react";

// Memoize individual breadcrumb item to prevent unnecessary re-renders
const BreadcrumbItemComponent = memo(({
    item,
    isLast,
    showSeparator,
    totalItems
}: {
    item: { label: string; path: string };
    isLast: boolean;
    showSeparator: boolean;
    totalItems: number;
}) => (
    <div className="flex items-center">
        <BreadcrumbItem>
            {isLast ? (
                <span className={`${totalItems === 1 ? "text-[#5E5F6E]" : "text-primary"} text-[13px] leading-5 font-inter font-[600] capitalize`}>
                    {item.label}
                </span>
            ) : (
                <Link
                    to={item.path}
                    className="text-[#5E5F6E] text-[13px] leading-5 font-inter font-[400] hover:text-foreground transition-colors"
                >
                    {item.label}
                </Link>
            )}
        </BreadcrumbItem>
        {showSeparator && (
            <BreadcrumbSeparator>
                <IconChevronRight className="ml-2 h-4 w-4" />
            </BreadcrumbSeparator>
        )}
    </div>
));

BreadcrumbItemComponent.displayName = 'BreadcrumbItemComponent';

// Memoize the entire NavigationBreadcrumb component
export const NavgationBreadcrumb = memo(function NavgationBreadcrumb() {
    const breadcrumbs = useBreadcrumbs();

    if (breadcrumbs.length < 1) {
        return null;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                    <BreadcrumbItemComponent
                        key={item.path}
                        item={item}
                        totalItems={breadcrumbs.length}
                        isLast={index === breadcrumbs.length - 1}
                        showSeparator={index < breadcrumbs.length - 1}
                    />
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
});