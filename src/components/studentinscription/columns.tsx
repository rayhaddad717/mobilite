"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
//import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type StudentInscription = {
    id?:number,
    name:string,
    family:string,
    nbr_dossier:number,
    type_diploma:string,
    phone:number,
    email:string,
    departement:string,
    year:number,
    branch:number,
    average:number,
    grades:number,
    eligible:boolean,
    expected_grad_date:Date,
    id_university:number,
    comment:string,
};

export const columns: ColumnDef<StudentInscription>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell({ row }) {
      return (
        <div className="flex gap-2">
          <Link to={`/studentinscription/${row.original.id}`}>
            <Button variant="secondary">View</Button>
          </Link>
        </div>
      );
    },
  },
];
