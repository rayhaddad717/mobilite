"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type University = {
  id: number;
  university_name: string;
  is_free: boolean;
};

export const columns: ColumnDef<University>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "university_name",
    header: "University Name",
  },
  {
    accessorKey: "country",
    header: "Country Name",
  },
  {
    accessorKey: "website",
    header: "Website",
  },
  {
    accessorKey: "is_free",
    header: "Public",
    cell({ row }) {
      return <p>{row.original.is_free ? "Yes" : "No"}</p>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell({ row }) {
      return (
        <div className="flex gap-2">
          <Link to={`/university/${row.original.id}`}>
            <Button variant="secondary">View</Button>
          </Link>
        </div>
      );
    },
  },
];
