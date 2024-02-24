"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Students } from "../students/columns";
import { University } from "../universities/columns";
//import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type StudentInscription = {
  id?: number;
  student_id: number;
  master_id: number;
  university_id: number;
  is_admitted: boolean;
  is_confirmed: boolean;
  has_scholarship: boolean;
  motivation_letter_file: string | null; //base 64 pdf
  recommendation_letter_file: string | null; //base 64 pdf
  cv_file: string | null; //base 64 pdf
  admission_letter_file: string | null; //base 64 pdf
  nomination_letter_file: string | null; //base 64 pdf
  Student: Students;
  University: University;
};

export const columns: ColumnDef<StudentInscription>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    header: "Student Name",
    cell({ row }) {
      return (
        <p>
          {row.original.Student.name} {row.original.Student.family_name}
        </p>
      );
    },
  },
  {
    header: "University",
    cell({ row }) {
      return <p>{row.original.University.university_name}</p>;
    },
  },
  {
    header: "Branch",
    cell({ row }) {
      return <p>{row.original.Student.branch}</p>;
    },
  },
  {
    header: "Eligble",
    cell({ row }) {
      return <p>{row.original.Student.eligible ? "Yes" : "No"}</p>;
    },
  },
  {
    header: "Admitted",
    cell({ row }) {
      return <p>{row.original.is_admitted ? "Yes" : "No"}</p>;
    },
  },
  {
    header: "Confirmed",
    cell({ row }) {
      return <p>{row.original.is_confirmed ? "Yes" : "No"}</p>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell({ row }) {
      return (
        <div className="flex gap-2">
          <Link to={`/student_inscription/${row.original.id}`}>
            <Button variant="secondary">View</Button>
          </Link>
        </div>
      );
    },
  },
];
