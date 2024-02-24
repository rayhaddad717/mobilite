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

const formSchema = z.object({
  university_id: z.string().min(1).refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  name: z.string().min(1),
  family: z.string().min(1),
  nbr_dossier: z.string().min(1).refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  phone: z.string().min(1).refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  email: z.string(),
  departement: z.string().min(1),
  year:z.string().min(1).refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  branch: z.string().min(1).refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  average: z.string().min(1).refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  grades: z.string().min(1).refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  eligible: z.boolean(),
  expected_grad_date: z.date(),
  comment: z.string(),
  type_diploma: z.string().min(1),
  
  
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
  const [universities, setUniversities] = useState<University[]>([]);
  const [masters, setMasters] = useState<Masters[]>([]);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name:"",
        family:"",
        nbr_dossier:"",
        type_diploma:"",
        phone:"",
        email:"",
        departement:"",
        year:"",
        branch:"",
        average:"",
        grades:"",
        eligible:false,
        expected_grad_date:new Date(),
        university_id:"",
        comment:"",
    },
  });
  async function init() {
    try {
      const university = await API.get<any, AxiosResponse<University[]>>(
        `/university`
      );
      const masters = await API.get<any, AxiosResponse<Masters[]>>(
        `/masters`
      );
      setUniversities(university.data);
      setMasters(masters.data);
    } catch (error) {}
  }

  async function getData() {
    try {
      const response = await API.get<any, AxiosResponse<APIResponse<any>>>(
        `/${API_URL_HEADER}/${params.id}`
      );
      if (response.data.statusCode === 200) {
        form.setValue("name", response.data.data.name);
        form.setValue("family", response.data.data.family);
        form.setValue("nbr_dossier", response.data.data.nbr_dossier);
        form.setValue("type_diploma", response.data.data.type_diploma);
        form.setValue("phone", response.data.data.phone);
        form.setValue("email", response.data.data.email);
        form.setValue("departement",response.data.data.departement);
        form.setValue("year", response.data.data.year);
        form.setValue("branch", response.data.data.branch);
        form.setValue("average", response.data.data.average);
        form.setValue("grades", response.data.data.grades);
        form.setValue("eligible", response.data.data.eligible);
        form.setValue("expected_grad_date", response.data.data.expected_grad_date);
        form.setValue("university_id",response.data.data.university_id.toString()); // Assuming university_id is a number
        form.setValue("comment", response.data.data.comment);
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
      
      payload.eligible = convertToStringBoolean(payload.eligible);
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
      console.error(error);
    }
  }
  useEffect(() => {
    init();
    if (!isAdd) {
      getData();
    }
  }, [isAdd]);
  if (!universities.length || !masters.length) return <h1>loading</h1>;
  return (
    <div className="container mt-4 flex flex-col gap-4">
      <h2 className="text-3xl">
        {isAdd ? `Add a new ${NAVIGATE_HEADER}` : `${NAVIGATE_HEADER} Details`}
      </h2>
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type_diploma"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diploma Type</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a university" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {universities.map((uni) => (
                        <SelectItem key={uni.id} value={`${uni.id}`}>
                          {uni.university_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="secondary"
              className="mr-4"
              onClick={() => navigate(`/${NAVIGATE_HEADER}`)}
            >
              Cancel
            </Button>
            <Button type="submit">{isAdd ? "Add" : "Edit"}</Button>
          </form>
        </Form>
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
