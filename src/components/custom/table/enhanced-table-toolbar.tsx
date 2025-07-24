import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EnhancedTableToolbarAction } from "@/types/table.types";

interface EnhancedTableToolbarProps {
  actions: EnhancedTableToolbarAction;
}

export const EnhancedTableToolbar = ({
  actions,
}: EnhancedTableToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      {actions?.dropdownActions && actions?.dropdownActions?.length > 0 && (
        <div className="hidden sm:flex items-center justify-between space-x-2">
          {actions?.dropdownActions?.map(
            (
              { label, disabled, icon: Icon, variant = "outline", onClick },
              i
            ) => (
              <Button
                key={`${label}-${i}`}
                size="sm"
                variant={variant}
                onClick={onClick}
                disabled={disabled}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            )
          )}
        </div>
      )}
      {actions?.primaryAction && actions?.primaryAction?.length > 0 && (
        <div className="items-center justify-between space-x-2">
          {actions?.primaryAction?.map(
            ({ label, disabled, icon: Icon, variant, to }, i) => {
              return (
                to && (
                  <Link to={to} key={`${label}-${i}`}>
                    <Button
                      variant={variant}
                      size="sm"
                      className="px-2 sm:px-3"
                      disabled={disabled}
                    >
                      <Icon className="m-0 sm:mr-2 h-4 w-4" />
                      <span className="hidden sm:block">{label}</span>
                    </Button>
                  </Link>
                )
              );
            }
          )}
        </div>
      )}
      {actions?.dropdownActions && actions?.dropdownActions?.length > 0 && (
        <div className="sm:hidden block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <IconDotsVertical className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              {actions?.dropdownActions?.map(
                ({ label, icon: Icon, disabled, onClick }, i) => (
                  <DropdownMenuItem
                    key={`${label}-${i}`}
                    onClick={onClick}
                    disabled={disabled}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};
