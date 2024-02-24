"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { University } from "../universities/columns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Masters = {
  id?: number;
  university_id: number;
  name: string;
  departement_target: string;
  type_diploma: string;
  language_required: string;
  recrutement_sur_dossier: boolean;
  exemption_fees: number;
  entretien_motivation: Date | null;
  oral_exam: Date | null;
  date_d_appel: Date | null;
  written_exam: Date | null;
  nb_students: number;
  result_dates: Date;
  date_candidature_deposit: Date;
  id_bourse: number;
  University: University;
};
const departmentNames = {
  GE: "Genie Elec",
  GM: "Genie Meca",
  GC: "Genie Civ",
  GP: "Genie PetElec",
};
export const columns: ColumnDef<Masters>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "Department",
    cell({ row }) {
      return (
        <p>
          {
            departmentNames[
              row.original.departement_target as "GE" | "GC" | "GM" | "GP"
            ]
          }
        </p>
      );
    },
  },
  {
    header: "University",
    cell({ row }) {
      return <p>{row.original.University?.university_name}</p>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell({ row }) {
      return (
        <div className="flex gap-2">
          <Link to={`/masters/${row.original.id}`}>
            <Button variant="secondary">View</Button>
          </Link>
        </div>
      );
    },
  },
];
