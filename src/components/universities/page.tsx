import { useCallback, useEffect, useState } from "react";
import { University, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "../ui/button";
import API, { APIResponse } from "@/api/API";
import { useNavigate } from "react-router-dom";

export default function UniversityPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const navigate = useNavigate();
  const fetchData = useCallback(async () => {
    try {
      const result = await API.get<any, APIResponse<University[]>>(
        "/university"
      );
      setUniversities(result.data);
    } catch (error) {}
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="container mx-auto py-10">
      <h2 className="font-bold text-2xl mb-4">List of Universities</h2>
      <div className="flex justify-end mb-4 gap-2">
        <Button onClick={() => navigate("/university/add")}>Add</Button>
        <Button variant="secondary">Export</Button>
      </div>
      <DataTable columns={columns} data={universities} />
    </div>
  );
}
