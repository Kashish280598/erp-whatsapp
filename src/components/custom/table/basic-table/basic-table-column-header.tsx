import type { Column } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  IconCaretDown,
  IconCaretUp,
  // IconCaretUpDown,
} from "@tabler/icons-react";

interface BasicTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function BasicTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: BasicTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleToggleSorting = () => {
    if (column.getIsSorted() === "asc") {
      column.toggleSorting(true);
    } else if (column.getIsSorted() === "desc") {
      column.clearSorting();
    } else {
      column.toggleSorting(false);
    }
  };

  return (
    <div className={cn("flex items-center  space-x-2", className)}>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild> */}
      <Button
        onClick={handleToggleSorting}
        variant="ghost"
        size="sm"
        className="cursor-pointer -ml-3 h-8 data-[state=open]:bg-accent text-neutral-500 text-[12px] leading-4 font-inter font-[600] flex justify-between flex-1 !pr-0 hover:bg-transparent !ring-0"
      >
        <span>{title}</span>
        <div className="cursor-pointer flex items-center flex-col relative h-2.5 w-2.5 mr-0.5">
          <IconCaretUp size={1} fill={column.getIsSorted() === "asc" ? "#565ADD" : "#C8C8D0"} className={`!h-3 !w-3 absolute -top-[3px] ${column.getIsSorted() === "asc" ? "text-primary" : "text-[#C8C8D0]"}`} />
          <IconCaretDown size={1} fill={column.getIsSorted() === "desc" ? "#565ADD" : "#C8C8D0"} className={`!h-3 !w-3 absolute top-[1px] ${column.getIsSorted() === "desc" ? "text-primary" : "text-[#C8C8D0]"}`} />
        </div>
      </Button>
      {/* </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-1">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)} className={`cursor-pointer text-[13px] font-[600] leading-5 text-neutral ${column.getIsSorted() === "asc" ? "!text-primary bg-primary-100 font-[600]" : "text-[#5E5F6E]"} `}>
            <IconCaretUp className={`mr-2 h-3.5 w-3.5 ${column.getIsSorted() === "asc" ? "text-primary" : "text-[#5E5F6E]"}`} fill={column.getIsSorted() === "asc" ? "#565ADD" : "#5E5F6E"} />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)} className={`cursor-pointer text-[13px] font-[600] leading-5 text-neutral ${column.getIsSorted() === "desc" ? "!text-primary bg-primary-100 font-[600]" : "text-[#5E5F6E]"} `}>
            <IconCaretDown className={`mr-2 h-3.5 w-3.5 ${column.getIsSorted() === "desc" ? "text-primary" : "text-[#5E5F6E]"}`} fill={column.getIsSorted() === "desc" ? "#565ADD" : "#5E5F6E"} />
            Desc
          </DropdownMenuItem>
          {column.getIsSorted() && (
            <>
              <div className="my-1 h-[1px] bg-neutral-200" />
              <DropdownMenuItem onClick={() => column.clearSorting()} className={`cursor-pointer text-[13px] font-[400] leading-5 text-neutral`}>
                <IconCaretUpDown className="mr-2 h-3.5 w-3.5 text-[#5E5F6E]" fill="#5E5F6E" />
                Reset
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}
