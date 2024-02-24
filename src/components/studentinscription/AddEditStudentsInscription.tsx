import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  //FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import API, { APIResponse } from "@/api/API";
import { ToastAction } from "@radix-ui/react-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import ConfirmDialog from "../shared/ConfirmDialog";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Calendar } from "../ui/calendar";
import { University } from "../universities/columns";
//import { Masters} from "../masters/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { Label } from "../ui/label";
import { Masters } from "../masters/columns";
import { Students } from "../students/columns";
import { Switch } from "../ui/switch";
import { File } from "buffer";
import { Label } from "../ui/label";

const formSchema = z.object({
  student_id: z.number(),
  master_id: z.number(),
  university_id: z.number(),
  is_admitted: z.boolean(),
  is_confirmed: z.boolean(),
  has_scholarship: z.boolean(),
  motivation_letter_file: z.string().nullable(), //base 64 pdf
  recommendation_letter_file: z.string().nullable(), //base 64 pdf
  cv_file: z.string().nullable(), //base 64 pdf
  admission_letter_file: z.string().nullable(), //base 64 pdf
  nomination_letter_file: z.string().nullable(), //base 64 pdf
});
const NAVIGATE_HEADER = "student_inscription";
const API_URL_HEADER = "student_inscription";
//const convertToBooleanString = (value: boolean) => (value ? "true" : "false");
const convertToStringBoolean = (value: string) =>
  value === "true" ? true : false;
function AddEditStudentInscription() {
  const navigate = useNavigate();
  const params = useParams();
  const [isAdd] = useState(!params?.id);
  const [render, Rerender] = useState(false);
  const [students, setStudents] = useState<Students[]>([]);
  const [masters, setMasters] = useState<Masters[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);

  function fileToBase64(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        Rerender(!render);
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
  function downloadFromBase64(
    base64String: string | null,
    fileName = "download.pdf"
  ) {
    if (!base64String) return;
    // Convert base64 to raw binary data held in a string
    // If your string has a prefix like "data:application/pdf;base64,", remove it.
    const base64WithoutPrefix = base64String.split(";base64,").pop();
    if (!base64WithoutPrefix) return;
    const binaryString = window.atob(base64WithoutPrefix);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a blob from the bytes
    const blob = new Blob([bytes], { type: "application/pdf" });

    // Create an object URL for the blob object
    const url = window.URL.createObjectURL(blob);

    // Create a new anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // Set the file name
    document.body.appendChild(a); // Append the anchor to body
    a.click(); // Trigger the download

    // Clean up by revoking the Object URL and removing the anchor element
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_id: undefined,
      master_id: undefined,
      university_id: undefined,
      is_admitted: false,
      is_confirmed: false,
      has_scholarship: false,
      motivation_letter_file: "",
      recommendation_letter_file: "",
      cv_file: "",
      admission_letter_file: "",
      nomination_letter_file: "",
    },
  });
  async function init() {
    try {
      const students = await API.get<any, AxiosResponse<Students[]>>(
        `/students`
      );
      const masters = await API.get<any, AxiosResponse<Masters[]>>(`/masters`);
      const universities = await API.get<any, AxiosResponse<University[]>>(
        `/university`
      );
      setStudents(students.data);
      setMasters(masters.data);
      setUniversities(universities.data);
    } catch (error) {}
  }

  async function getData() {
    try {
      const response = await API.get<any, AxiosResponse<APIResponse<any>>>(
        `/${API_URL_HEADER}/${params.id}`
      );
      if (response.data.statusCode === 200) {
        Object.entries(response.data.data).map(([key, value]) => {
          const typedKey = key as
            | "student_id"
            | "master_id"
            | "is_admitted"
            | "is_confirmed"
            | "has_scholarship"
            | "motivation_letter_file"
            | "recommendation_letter_file"
            | "cv_file"
            | "admission_letter_file"
            | "nomination_letter_file";
          const typedValue: any = value;
          form.setValue(typedKey, typedValue);
        });
        setTimeout(() => {
          Rerender(render);
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  }
  async function onDelete() {
    try {
      const response = await API.delete(`/${API_URL_HEADER}/${params.id}`);
      if (response?.data?.statusCode === 200) {
        toast({
          title: "Success",
          description: `Successfully deleted student ${NAVIGATE_HEADER}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Done</ToastAction>
          ),
        });
        navigate(`/${NAVIGATE_HEADER}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      let payload: any = isAdd ? values : { ...values, id: params.id };

      const response = await API.post<any, APIResponse<any>>(
        `/${API_URL_HEADER}`,
        payload
      );
      if (
        response?.data?.statusCode === 201 ||
        response?.data?.statusCode === 200
      ) {
        toast({
          title: "Success",
          description: `Successfully ${
            isAdd ? "created" : "updated"
          } ${NAVIGATE_HEADER}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Done</ToastAction>
          ),
        });
        navigate(`/${NAVIGATE_HEADER}`);
      }
    } catch (error) {
      toast({
        title: "Failure",
        description: `Something went wrong.`,
        action: <ToastAction altText="Goto schedule to undo">OK</ToastAction>,
      });
      console.error(error);
    }
  }
  useEffect(() => {
    init();
    if (!isAdd) {
      getData();
    }
  }, [isAdd]);
  if (!students.length || !masters.length || !universities.length)
    return <h1>loading</h1>;
  return (
    <div className="container mt-4 flex flex-col gap-4">
      <div className="max-h-[90vh] overflow-y-auto pb-4 pl-4 pr-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8  w-full"
            style={{
              display: "grid",
              gridTemplateColumns: "45% 45%",
              columnGap: "5%",
            }}
          >
            <h2 className="text-xl font-bold">
              {isAdd ? `Add a new Inscription` : `Inscription Details`}
            </h2>
            <p></p>
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={`${student.id}`}>
                          {student.name} {student.family_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="master_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Master</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a master" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {masters.map((master) => (
                        <SelectItem key={master.id} value={`${master.id}`}>
                          {master.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="university_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a university" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {universities.map((university) => (
                        <SelectItem
                          key={university.id}
                          value={`${university.id}`}
                        >
                          {university.university_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_admitted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Is Admited</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_confirmed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Is Confirmed</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="has_scholarship"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Has Scholarship</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="flex items-end gap-4 mt-4">
          <div>
            <Label htmlFor="motivation_letter_file">Motivation Letter</Label>
            <Input
              id="motivation_letter_file"
              type="file"
              onChange={(e) => {
                if (e.target?.files?.length && e.target?.files[0]) {
                  fileToBase64(e.target?.files[0])
                    .then((res) => {
                      form.setValue("motivation_letter_file", res);
                    })
                    .catch(console.log);
                }
              }}
            />
          </div>
          {!!form.getValues().motivation_letter_file?.length ? (
            <Button
              variant={"secondary"}
              onClick={() =>
                downloadFromBase64(
                  form.getValues().motivation_letter_file,
                  "Motivation Letter.pdf"
                )
              }
            >
              Download
            </Button>
          ) : null}
        </div>
        <div className="flex items-end gap-4 mt-4">
          <div className="">
            <Label htmlFor="recommendation_letter_file">
              Recommendation Letter
            </Label>
            <Input
              id="recommendation_letter_file"
              type="file"
              onChange={(e) => {
                if (e.target?.files?.length && e.target?.files[0]) {
                  fileToBase64(e.target?.files[0])
                    .then((res) => {
                      form.setValue("recommendation_letter_file", res);
                    })
                    .catch(console.log);
                }
              }}
            />
          </div>
          {!!form.getValues().recommendation_letter_file?.length ? (
            <Button
              variant={"secondary"}
              onClick={() =>
                downloadFromBase64(
                  form.getValues().recommendation_letter_file,
                  "Recommendation Letter.pdf"
                )
              }
            >
              Download
            </Button>
          ) : null}
        </div>
        <div className="flex items-end gap-4 mt-4">
          <div>
            <Label htmlFor="cv_file">CV</Label>
            <Input
              id="cv_file"
              type="file"
              onChange={(e) => {
                if (e.target?.files?.length && e.target?.files[0]) {
                  fileToBase64(e.target?.files[0])
                    .then((res) => {
                      form.setValue("cv_file", res);
                    })
                    .catch(console.log);
                }
              }}
            />
          </div>
          {!!form.getValues().cv_file?.length ? (
            <Button
              variant={"secondary"}
              onClick={() =>
                downloadFromBase64(form.getValues().cv_file, "CV.pdf")
              }
            >
              Download
            </Button>
          ) : null}
        </div>
        <div className="flex items-end gap-4 mt-4">
          <div>
            <Label htmlFor="admission_letter_file">Admission Letter</Label>
            <Input
              id="admission_letter_file"
              type="file"
              onChange={(e) => {
                if (e.target?.files?.length && e.target?.files[0]) {
                  fileToBase64(e.target?.files[0])
                    .then((res) => {
                      form.setValue("admission_letter_file", res);
                    })
                    .catch(console.log);
                }
              }}
            />
          </div>
          {!!form.getValues().admission_letter_file?.length ? (
            <Button
              variant={"secondary"}
              onClick={() =>
                downloadFromBase64(
                  form.getValues().admission_letter_file,
                  "Admission Letter.pdf"
                )
              }
            >
              Download
            </Button>
          ) : null}
        </div>
        <div className="flex items-end gap-4 mt-4">
          <div>
            <Label htmlFor="nomination_letter_file">Nomination Letterr</Label>
            <Input
              id="nomination_letter_file"
              type="file"
              onChange={(e) => {
                if (e.target?.files?.length && e.target?.files[0]) {
                  fileToBase64(e.target?.files[0])
                    .then((res) => {
                      form.setValue("nomination_letter_file", res);
                    })
                    .catch(console.log);
                }
              }}
            />
          </div>
          {!!form.getValues().nomination_letter_file?.length ? (
            <Button
              variant={"secondary"}
              onClick={() =>
                downloadFromBase64(
                  form.getValues().nomination_letter_file,
                  "Nomination Letter.pdf"
                )
              }
            >
              Download
            </Button>
          ) : null}
        </div>
        <div className="flex items-center mt-4 justify-end">
          <Button
            variant="secondary"
            className="mr-4"
            size={"lg"}
            onClick={() => navigate(`/${NAVIGATE_HEADER}`)}
          >
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} size={"lg"}>
            {isAdd ? "Add" : "Edit"}
          </Button>
        </div>
        <ConfirmDialog
          confirmMessage={"Confirm"}
          onClick={onDelete}
          buttonTitle={"Delete"}
          header={"Warning"}
          description={`Are you sure you want to delete ${NAVIGATE_HEADER}`}
        />
      </div>
    </div>
  );
}
export default AddEditStudentInscription;
