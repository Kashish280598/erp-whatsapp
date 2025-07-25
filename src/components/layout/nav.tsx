import { Link } from "react-router-dom";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  TooltipProvider,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import useCheckActiveNav from "@/hooks/use-check-active-nav";
import type { SidebarLink } from "@/data/sidebar-links";
import { Separator } from "../ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import DynamicSidebar from "./DynamicSidebar";

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  links: SidebarLink[];
  closeNav: () => void;
}

export default function Nav({
  links,
  className,
  closeNav,
}: NavProps) {
  const renderLink = ({ sub, ...rest }: SidebarLink) => {
    const key = `${rest.title}-${rest.href}`;
    if (rest?.saperator) {
      return <Separator className="mt-2" key={key} />;
    }
    if (sub)
      return (
        <NavLinkIconDropdown
          {...rest}
          sub={sub}
          key={key}
          closeNav={closeNav}
        />
      );

    return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />;

  };
  return (
    <div
      className={cn(
        "group bg-background transition-[max-height] duration-500",
        className
      )}
    >
      <TooltipProvider delayDuration={0}>
        <nav className="grid gap-2 pb-3 group-[[data-collapsed=true]]:px-2 justify-center">
          {links.map(renderLink)}
        </nav>
      </TooltipProvider>
    </div>
  );
}

interface NavLinkProps extends SidebarLink {
  subLink?: boolean;
  closeNav: () => void;
}

function NavLinkIcon(props: NavLinkProps) {
  const { title, icon, href, sidebarIdentifier } = props;
  const { checkActiveNav } = useCheckActiveNav();

  // Normalize title for data-tour attribute
  const tourId = ["Dashboard", "Inventory Manager", "Customers", "Chat"].includes(title)
    ? `sidebar-${title.toLowerCase().replace(/\s+/g, '-')}`
    : undefined;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          to={href}
          className="flex flex-col gap-[4px] items-center w-[58px]"
          {...(tourId ? { 'data-tour': tourId } : {})}
        >
          <span
            className={cn(
              buttonVariants({
                variant: checkActiveNav(href) ? "default" : "ghost",
                size: "icon",
              }),
              "h-9 w-9 menu-item !shadow-none",
              checkActiveNav(href) && "active-menu"
            )}
          >
            {icon && <img src={icon} alt={title} className={`w-4 h-4 ${checkActiveNav(href) && "active-menu-icon"}`} />}
            <span className="sr-only">{title}</span>
          </span>
          <span className={`menu-title ${checkActiveNav(href) && 'active-menu-title'}`}>{title}</span>
        </Link>
      </HoverCardTrigger>
      {/* Only show DynamicSidebar for non-settings links */}
      {sidebarIdentifier && sidebarIdentifier !== 'settings' && (
        <HoverCardContent portalClassName="layout-sidebar-container" className="collapsible-sidebar w-[250px] z-49">
          <div className="font-[600] text-[16px] leading-[24px] text-neutral mb-5">{title}</div>
          <DynamicSidebar {...props} />
        </HoverCardContent>
      )}
    </HoverCard>
  );
}

function NavLinkIconDropdown({ icon, sub }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();

  /* Open collapsible by default
   * if one of child element is active */
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isChildActive ? "secondary" : "ghost"}
          size="icon"
          className="h-10 w-10"
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>
      {/* <DropdownMenuContent side="right" align="start" sideOffset={4}>
        <DropdownMenuLabel>
          {title} {label ? `(${label})` : ""}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub!.map(({ title, icon, label, href }) => (
          <DropdownMenuItem key={`${title}-${href}`} asChild>
            <Link
              to={href}
              className={`${checkActiveNav(href) ? "bg-primary text-primary-foreground" : ""}`}
            >
              {icon && icon}{" "}
              <span className={`${icon ? "ml-2" : ""} max-w-52 text-wrap`}>
                {title}
              </span>
              {label && <span className="ml-auto text-xs">{label}</span>}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
}
