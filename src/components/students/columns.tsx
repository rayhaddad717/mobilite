"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Students = {
  id?: number;
  name: string;
  notes: { [x: string]: number }[];
  nbr_dossier: number;
  family_name: string;
  phone: number;
  email: string;
  departement: string;
  annee: number;
  branch: number;
  average: number;
  eligible: boolean;
  expected_grad_date: Date;
  comment: string;
};
const departmentNames = {
  GE: "Genie Elec",
  GM: "Genie Meca",
  GC: "Genie Civ",
  GP: "Genie PetElec",
};
export const columns: ColumnDef<Students>[] = [
  {
    header: "Dossier#",
    accessorKey: "nbr_dossier",
  },
  {
    header: "Student Name",
    cell({ row }) {
      return (
        <p>
          {row.original.name} {row.original.family_name}
        </p>
      );
    },
  },
  {
    header: "Average",
    cell({ row }) {
      return <p>{row.original.average}</p>;
    },
  },
  {
    header: "Department",
    cell({ row }) {
      return (
        <p>
          {
            departmentNames[
              row.original.departement as "GE" | "GC" | "GM" | "GP"
            ]
          }
        </p>
      );
    },
  },
  {
    header: "Branch",
    cell({ row }) {
      return <p>ULFG {`I`.repeat(row.original.branch)}</p>;
    },
  },
  {
    header: "Year",
    cell({ row }) {
      return <p>{row.original.annee}</p>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell({ row }) {
      return (
        <div className="flex gap-2">
          <Link to={`/students/${row.original.id}`}>
            <Button variant="secondary">View</Button>
          </Link>
        </div>
      );
    },
  },
];
