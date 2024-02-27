import { useCallback, useEffect, useRef, useState } from "react";
import { StudentInscription, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "../ui/button";
import API, { APIResponse } from "@/api/API";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { saveAs } from "file-saver";
import { AxiosResponse } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
const API_URL_HEADER = "student_inscription";
const NAVIGATE_HEADER = "student_inscription";
export default function StudentInscriptionPage() {
  const [data, setData] = useState<StudentInscription[]>([]);
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
  async function exportUniversities(
    type:
      | "inscrit"
      | "autorise-elligible"
      | "non-autorise-list-attente" //NOT ELLIGILE
      | "admis"
      | "will-travel"
      | "boursier"
  ) {
    try {
      const response = await API.get(`/${API_URL_HEADER}/export?type=${type}`, {
        responseType: "blob",
      });
      // Use file-saver or a similar library to save the blob as a file
      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const mapper = {
        inscrit: "Inscrits",
        "autorise-elligible": "Autorise",
        "non-autorise-list-attente": "List D'attente",
        admis: "Admis",
        "will-travel": "En Voyage",
        boursier: "Boursier",
      };
      saveAs(file, `${mapper[type]}.xlsx`);
      toast({
        title: "Success",
        description: `Successfully exported ${mapper[type]}`,
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
      const result = await API.get<any, APIResponse<StudentInscription[]>>(
        `/${API_URL_HEADER}`
      );
      setData(result.data);
    } catch (error) {}
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="container mx-auto py-10 overflow-x-auto">
      <h2 className="font-bold text-2xl mb-4">List of Student Inscriptions</h2>
      <div className="flex justify-end mb-4 gap-2">
        <Button onClick={() => navigate(`/${NAVIGATE_HEADER}/add`)}>Add</Button>
        <Button variant="secondary">
          <a download="Template.xlsx" href="/Inscription Template.xlsx">
            Download Template
          </a>
        </Button>
        <Button variant="secondary" onClick={handleImportButtonClick}>
          Import
        </Button>
        <Select
          onValueChange={(value) =>
            exportUniversities(
              value as
                | "inscrit"
                | "autorise-elligible"
                | "non-autorise-list-attente"
                | "admis"
                | "will-travel"
                | "boursier"
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Export" />
          </SelectTrigger>
          <SelectContent>
            {[
              { name: "Download Inscrits", value: "inscrit" },
              { name: "Download Autorise", value: "autorise-elligible" },
              {
                name: "Download List D'attente",
                value: "non-autorise-list-attente",
              },
              { name: "Download Admis", value: "admis" },
              { name: "Download Boursier", value: "boursier" },
              { name: "Download Etudiant en voyage", value: "will-travel" },
            ].map((type) => (
              <SelectItem value={type.value}>{type.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={data} />
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
