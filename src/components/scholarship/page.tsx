import { useCallback, useEffect, useRef, useState } from "react";
import { Scholarship, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "../ui/button";
import API, { APIResponse } from "@/api/API";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { saveAs } from "file-saver";
import { AxiosResponse } from "axios";
const API_URL_HEADER = "scholarship";
const NAVIGATE_HEADER = "scholarship";
export default function ScholarshipPage() {
  const [universities, setUniversities] = useState<Scholarship[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const importUniversities = async (event: any) => {
    try {
      // Handle the file selected by the user
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post<any, AxiosResponse<APIResponse<any>>>(
        `/${API_URL_HEADER}/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.statusCode) {
        toast({
          title: "Success",
          description: `Successfully imported universities`,
          action: (
            <ToastAction altText="Goto schedule to undo">Done</ToastAction>
          ),
        });
        setTimeout(() => {
          fetchData();
        }, 100);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  };
  async function handleImportButtonClick() {
    try {
      if (!fileInputRef.current) return;
      fileInputRef.current.click();
    } catch (error) {}
  }
  async function exportUniversities() {
    try {
      const response = await API.get(`/${API_URL_HEADER}/export`, {
        responseType: "blob",
      });
      // Use file-saver or a similar library to save the blob as a file
      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(file, `${NAVIGATE_HEADER}.xlsx`);
      toast({
        title: "Success",
        description: `Successfully exported ${NAVIGATE_HEADER}`,
        action: <ToastAction altText="Goto schedule to undo">Done</ToastAction>,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  }
  const fetchData = useCallback(async () => {
    try {
      const result = await API.get<any, APIResponse<Scholarship[]>>(
        `/${API_URL_HEADER}`
      );
      setUniversities(result.data);
    } catch (error) {}
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="container mx-auto py-10 overflow-x-auto">
      <h2 className="font-bold text-2xl mb-4">
        List of {NAVIGATE_HEADER.charAt(0).toUpperCase()}
        {NAVIGATE_HEADER.slice(1)}s
      </h2>
      <div className="flex justify-end mb-4 gap-2">
        <Button onClick={() => navigate(`/${NAVIGATE_HEADER}/add`)}>Add</Button>
        {/* <Button variant="secondary" onClick={handleImportButtonClick}>
          Import
        </Button> */}
        <Button variant="secondary" onClick={exportUniversities}>
          Export
        </Button>
      </div>
      <DataTable columns={columns} data={universities} />
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept=".xlsx,.xls,.csv"
        onChange={importUniversities}
      />
    </div>
  );
}
