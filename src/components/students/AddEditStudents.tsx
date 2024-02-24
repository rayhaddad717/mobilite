import { zodResolver } from "@hookform/resolvers/zod";
import { ResolverResult, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  family_name: z.string().min(1, "Required"),
  email: z.string().email(),
  comment: z.string().optional(),
  phone: z.number(),
  nbr_dossier: z.number(),
  departement: z.string(),
  annee: z.number().min(3).max(5),
  branch: z.number(),
  average: z.number().min(0).max(100),
  eligible: z.boolean(),
  expected_grad_date: z.date(),
});

const NAVIGATE_HEADER = "students";
const API_URL_HEADER = "students";
const convertToBooleanString = (value: boolean) => (value ? "true" : "false");
const convertToStringBoolean = (value: string) =>
  value === "true" ? true : false;
function AddEditStudent() {
  const navigate = useNavigate();
  const params = useParams();
  const [isAdd] = useState(!params?.id);
  const [reRender, Rerender] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nbr_dossier: undefined,
      family_name: "",
      phone: undefined,
      email: "",
      departement: "GE",
      annee: 3,
      branch: 1,
      average: undefined,
      eligible: false,
      expected_grad_date: new Date(),
      comment: "",
    },
  });
  const notesFormSchema = z.object({
    sem1: z.number().min(0).max(100),
    sem2: z.number().min(0).max(100),
    sem3: z.number().min(0).max(100),
    sem4: z.number().min(0).max(100),
    sem5: z.number().min(0).max(100),
    sem6: z.number().min(0).max(100),
    sem7: z.number().min(0).max(100),
    sem8: z.number().min(0).max(100),
    sem9: z.number().min(0).max(100),
    sem10: z.number().min(0).max(100),
  });
  const notesForm = useForm<z.infer<typeof notesFormSchema>>({
    // resolver: zodResolver(notesFormSchema),
    resolver: async (values, context, options) => {
      const year = form.getValues().annee;
      const result = await zodResolver(notesFormSchema)(
        values,
        context,
        options
      );
      console.log("here", year, result);
      const errors: any = result.errors;
      try {
        if (year < 4) {
          delete errors["sem7"];
          delete errors["sem8"];
        }
        if (year < 5) {
          delete errors["sem9"];
          delete errors["sem10"];
        }
      } catch (error) {
        console.error(error);
      }
      console.log("here", values, errors);
      return {
        values,
        errors,
      } as ResolverResult;
    },
    defaultValues: {
      sem1: undefined,
      sem2: undefined,
      sem3: undefined,
      sem4: undefined,
      sem5: undefined,
      sem6: undefined,
      sem7: undefined,
      sem8: undefined,
      sem9: undefined,
      sem10: undefined,
    },
  });

  async function getData() {
    try {
      const response = await API.get<any, AxiosResponse<APIResponse<any>>>(
        `/${API_URL_HEADER}/${params.id}`
      );
      if (response.data.statusCode === 200) {
        const valueMappings = [
          "name",
          "nbr_dossier",
          "family_name",
          "phone",
          "email",
          "departement",
          "annee",
          "branch",
          "average",
          "eligible",
          "expected_grad_date",
          "comment",
        ];
        for (const [key, value] of Object.entries(response.data.data)) {
          let anyValue: any = value;
          let valueKey = key as
            | "name"
            // | "notes"
            | "nbr_dossier"
            | "family_name"
            | "phone"
            | "email"
            | "departement"
            | "annee"
            | "branch"
            | "average"
            | "eligible"
            | "expected_grad_date"
            | "comment";
          if (key === "notes") {
            response.data.data.notes?.forEach((sem: any) => {
              Object.entries(sem).forEach((semester: any) => {
                const [semKey, semValue] = semester;
                notesForm.setValue(`${semKey}` as any, semValue);
              });
            });
          } else if (valueKey === "expected_grad_date") {
            form.setValue(valueKey, new Date(anyValue));
            continue;
          }
          form.setValue(valueKey, anyValue);
        }
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
          description: `Successfully deleted ${NAVIGATE_HEADER}`,
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
    console.log(values);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await notesForm.trigger();
    if (!notesForm.formState.isValid) {
      return;
    }
    try {
      let payload: any = isAdd ? values : { ...values, id: params.id };
      payload.notes = Object.entries(notesForm.getValues())
        .map(([sem, value]) => {
          const semester = Number(`${sem}`.split("sem")[1]);
          if (
            (payload.annee < 4 && semester >= 7) ||
            (payload.annee < 5 && semester >= 9)
          ) {
            return {
              [sem]: value,
              delete: true,
            };
          }
          return {
            [sem]: value,
          };
        })
        .filter((x) => !x.delete);
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
    if (!isAdd) {
      getData();
    }
  }, [isAdd]);
  return (
    <div className="container mt-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">
        {isAdd ? `Add a new Student` : `Student Details`}
      </h2>
      <div className="max-h-[90vh] overflow-y-auto">
        <Tabs defaultValue="details" className=" pb-4 pl-4 pr-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
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
                <h2 className="text-xl font-bold">Student Details</h2>
                <p></p>
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
                  name="family_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family Name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                          type="number"
                          placeholder="71 981 122"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="nbr_dossier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero Du Dossier</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                        />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["GE", "GM", "GC", "GP"].map((depart, index) => (
                            <SelectItem
                              key={`depart-${index}`}
                              value={`${depart}`}
                            >
                              {depart}
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
                  name="annee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          Rerender(!reRender);
                        }}
                        value={field.value?.toString()}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            { year: 3, name: "3rd Year" },
                            { year: 4, name: "4th Year" },
                            { year: 5, name: "5th Year" },
                          ].map((year) => (
                            <SelectItem
                              key={year.year}
                              value={year.year?.toString()}
                            >
                              {year.name}
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
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <Select
                        onValueChange={(event) => field.onChange(Number(event))}
                        value={field.value?.toString()}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            { value: 1, name: "ULFG I" },
                            { value: 2, name: "ULFG II" },
                            { value: 3, name: "ULFG III" },
                          ].map((branch, index) => (
                            <SelectItem
                              key={`branch-${index}`}
                              value={`${branch.value}`}
                            >
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="average"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                          type="number"
                          placeholder="75"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expected_grad_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Graduation Date</FormLabel>
                      <br></br>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eligible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Eligible</FormLabel>
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
          </TabsContent>
          <TabsContent value="grades">
            <Form {...notesForm}>
              <form
                onSubmit={notesForm.handleSubmit(console.log)}
                className="space-y-8  w-full "
                style={{
                  display: "grid",
                  gridTemplateColumns: "45% 45%",
                  columnGap: "5%",
                }}
              >
                <h2 className="text-xl font-bold">Student Grades</h2>
                <p></p>
                {(
                  [
                    "sem1",
                    "sem2",
                    "sem3",
                    "sem4",
                    "sem5",
                    "sem6",
                    "sem7",
                    "sem8",
                    "sem9",
                    "sem10",
                  ] as (
                    | "sem1"
                    | "sem2"
                    | "sem3"
                    | "sem4"
                    | "sem5"
                    | "sem6"
                    | "sem7"
                    | "sem8"
                    | "sem9"
                    | "sem10"
                  )[]
                ).map((sem, index) => (
                  <FormField
                    key={sem}
                    name={sem}
                    control={notesForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester {index + 1}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(event) =>
                              field.onChange(Number(event.target.value))
                            }
                            type="number"
                            placeholder="Grade"
                            disabled={
                              (index >= 6 && form.getValues().annee < 4) ||
                              (index >= 8 && form.getValues().annee < 5)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        <div className="w-full flex mt-4 justify-end">
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
export default AddEditStudent;
