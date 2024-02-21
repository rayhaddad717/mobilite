"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import API from "@/api/API";
import { Link } from "react-router-dom";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type University = {
  id: number;
  university_name: string;
};

export const columns: ColumnDef<University>[] = [
  {
    accessorKey: "university_name",
    header: "University Name",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell({ row }) {
      return (
        <div className="flex gap-2">
          <Button variant="secondary">
            <Link to={`/university/add?id=${row.original.id}`}>Edit</Link>
          </Button>
          <Button variant="destructive">
            <Link to={`/university`}>Delete</Link>
          </Button>
        </div>
      );
    },
  },
];
