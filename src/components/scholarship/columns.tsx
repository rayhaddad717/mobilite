"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Scholarship = {
  id: number;
  name: string;
  duration: number;
  dateFrom: Date;
  dateTo: Date;
  value: number;
  condition_obtention: string;
};

export const columns: ColumnDef<Scholarship>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "dateFrom",
    header: "Start Date",
    cell({ row }) {
      return format(row.original.dateFrom, "PPP");
    },
  },
  {
    accessorKey: "dateTo",
    header: "End Date",
    cell({ row }) {
      return format(row.original.dateTo, "PPP");
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell({ row }) {
      return (
        <div className="flex gap-2">
          <Link to={`/scholarship/${row.original.id}`}>
            <Button variant="secondary">View</Button>
          </Link>
        </div>
      );
    },
  },
];
