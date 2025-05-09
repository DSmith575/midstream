import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DataProps {
  name: string;
  formSubmitted: string;
  status: string;
}

const caseWorkerColumns: ColumnDef<DataProps>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "formSubmitted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Submission Date
          <ArrowUpDown className={"h-4 w-4"} />
        </Button>
      );
    },
  },
  {
      accessorKey: 'status',
      header: ({ column}) => {
        return (
          <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className={'ml-2 h-4 w-4'} />
          </Button>
        )
      }
    },
];

export default caseWorkerColumns;

// {
//   accessorKey: 'lastUpdate',
//   header: ({ column}) => {
//     return (
//       <Button
//       variant="ghost"
//       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Last Update
//         <ArrowUpDown className={'ml-2 h-4 w-4'} />
//       </Button>
//     )
//   }
// },
// {
//   accessorKey: 'assignedTo',
//   header: 'Assigned To',
// },
// {
//   accessorKey: 'status',
//   header: ({ column}) => {
//     return (
//       <Button
//       variant="ghost"
//       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Status
//         <ArrowUpDown className={'ml-2 h-4 w-4'} />
//       </Button>
//     )
//   }
// },
