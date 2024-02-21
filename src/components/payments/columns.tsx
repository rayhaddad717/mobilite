"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: string;
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Country",
  },
  {
    accessorKey: "amount",
    header: "Nb Students",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell() {
      return (
        <div className="flex gap-2">
          <Button variant="secondary">Edit</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      );
    },
  },
];
