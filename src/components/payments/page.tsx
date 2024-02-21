import { useState } from "react";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "../ui/button";

function getData(): Payment[] {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "Supaero",
      email: "France",
    },
    {
      id: "728ed52f",
      amount: 55,
      status: "Supaero",
      email: "France",
    },
    {
      id: "728ed52f",
      amount: 23,
      status: "Supaero",
      email: "France",
    },
    {
      id: "728ed52f",
      amount: 77,
      status: "Supaero",
      email: "France",
    },
    // ...
  ];
}

export default function DemoPage() {
  const [data] = useState(getData());

  return (
    <div className="container mx-auto py-10">
      <h2 className="font-bold text-2xl mb-4">List of Universities</h2>
      <div className="flex justify-end mb-4 gap-2">
        <Button>Add</Button>
        <Button variant="secondary">Export</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
