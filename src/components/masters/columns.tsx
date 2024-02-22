"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";

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
  entretien_motivation: boolean;
  oral_exam: boolean;
  written_exam: boolean;
  nb_students: number;
  result_dates: Date;
  date_candidature_deposit: Date;
  id_bourse: number;
};

export const columns: ColumnDef<Masters>[] = [
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
          <Link to={`/masters/${row.original.id}`}>
            <Button variant="secondary">View</Button>
          </Link>
        </div>
      );
    },
  },
];
