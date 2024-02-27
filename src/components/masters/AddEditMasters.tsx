import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { University } from "../universities/columns";
import { Scholarship } from "../scholarship/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const formSchema = z.object({
  university_id: z
    .string()
    .min(1)
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  name: z.string().min(1),
  departement_target: z.string().min(1),
  type_diploma: z.string().min(1),
  language_required: z.string().min(1),
  recrutement_sur_dossier: z.string().min(1),
  exemption_fees: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  is_entretien_motivation: z.string(),
  is_oral_exam: z.string(),
  is_written_exam: z.string(),
  entretien_motivation: z.date().nullable().optional(),
  oral_exam: z.date().nullable().optional(),
  date_d_appel: z.date(),
  written_exam: z.date().nullable().optional(),
  nb_students: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  result_dates: z.date(),
  date_candidature_deposit: z.date(),
  id_bourse: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
});
const NAVIGATE_HEADER = "masters";
const API_URL_HEADER = "masters";
const convertToBooleanString = (value: boolean) => (value ? "true" : "false");
const convertToStringBoolean = (value: string) =>
  value === "true" ? true : false;
function AddEditMasters() {
  const navigate = useNavigate();
  const params = useParams();
  const [isAdd] = useState(!params?.id);
  const [render, Rerender] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      departement_target: "",
      type_diploma: "",
      language_required: "",
      exemption_fees: "0",
      university_id: "10",
      nb_students: "0",
      id_bourse: "0",
      recrutement_sur_dossier: "false",
      is_entretien_motivation: "false",
      is_oral_exam: "false",
      is_written_exam: "false",
      result_dates: new Date(),
      date_candidature_deposit: new Date(),
    },
  });
  async function init() {
    try {
      const university = await API.get<any, AxiosResponse<University[]>>(
        `/university`
      );
      const scholarship = await API.get<any, AxiosResponse<Scholarship[]>>(
        `/scholarship`
      );
      setUniversities(university.data);
      setScholarships(scholarship.data as Scholarship[]);
    } catch (error) {}
  }

  async function getData() {
    try {
      const response = await API.get<any, AxiosResponse<APIResponse<any>>>(
        `/${API_URL_HEADER}/${params.id}`
      );
      if (response.data.statusCode === 200) {
        form.setValue(
          "university_id",
          response.data.data.university_id?.toString()
        ); // Assuming university_id is a number
        form.setValue("name", response.data.data.name);
        form.setValue(
          "departement_target",
          response.data.data.departement_target
        );
        form.setValue("type_diploma", response.data.data.type_diploma);
        form.setValue(
          "language_required",
          response.data.data.language_required
        );
        form.setValue(
          "exemption_fees",
          response.data.data.exemption_fees?.toString()
        ); // Assuming exemption_fees is a number
        form.setValue(
          "recrutement_sur_dossier",
          convertToBooleanString(response.data.data.recrutement_sur_dossier)
        );
        form.setValue(
          "is_entretien_motivation",
          convertToBooleanString(!!response.data.data.entretien_motivation)
        );
        form.setValue(
          "date_d_appel",
          new Date(response.data.data.date_d_appel)
        );
        if (response.data.data.entretien_motivation)
          form.setValue(
            "entretien_motivation",
            new Date(response.data.data.entretien_motivation)
          );
        form.setValue(
          "is_oral_exam",
          convertToBooleanString(!!response.data.data.oral_exam)
        );
        if (response.data.data.oral_exam)
          form.setValue("oral_exam", new Date(response.data.data.oral_exam));
        form.setValue(
          "is_written_exam",
          convertToBooleanString(!!response.data.data.written_exam)
        );
        if (response.data.data.written_exam)
          form.setValue(
            "written_exam",
            new Date(response.data.data.written_exam)
          );
        form.setValue(
          "nb_students",
          response.data.data.nb_students?.toString()
        ); // Assuming nb_students is a number
        form.setValue(
          "result_dates",
          new Date(response.data.data.result_dates)
        );
        form.setValue(
          "date_candidature_deposit",
          new Date(response.data.data.date_candidature_deposit)
        );
        if (response.data.data.id_bourse?.toString())
          form.setValue("id_bourse", response.data.data.id_bourse?.toString());
        // Assuming id_bourse is a number
        else form.setValue("id_bourse", "-1");
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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      let payload: any = isAdd ? values : { ...values, id: params.id };
      payload.exemption_fees = Number(payload.exemption_fees);
      payload.university_id = Number(payload.university_id);
      payload.nb_students = Number(payload.nb_students);
      payload.id_bourse = Number(payload.id_bourse);
      payload.recrutement_sur_dossier = convertToStringBoolean(
        payload.recrutement_sur_dossier
      );
      if (payload.is_entretien_motivation != "true")
        payload.entretien_motivation = null;
      if (payload.is_oral_exam != "true") payload.oral_exam = null;
      if (payload.is_written_exam != "true") payload.written_exam = null;
      delete payload.is_entretien_motivation;
      delete payload.is_oral_exam;
      delete payload.is_written_exam;
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
        title: "Error",
        description: "Something went wrong",
      });
    }
  }
  useEffect(() => {
    init();
    if (!isAdd) {
      getData();
    }
  }, [isAdd]);
  if (!universities.length) return <h1>loading</h1>;
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
            <h2 className="text-2xl font-bold">
              {isAdd ? `Add a new Masters` : `Masters Details`}
            </h2>
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
              name="departement_target"
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
                        <SelectItem key={`depart-${index}`} value={`${depart}`}>
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
              name="type_diploma"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diploma Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Test" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        { name: "Master de recherche", value: "M2R" },
                        { name: "Double Diplome", value: "DD" },
                      ].map((type, index) => (
                        <SelectItem
                          key={`type-${index}`}
                          value={`${type.value}`}
                        >
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language_required"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Required</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Test" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["TOEFUL", "DELF B2", "DELF B1", "SAT", "IELTS"].map(
                        (depart, index) => (
                          <SelectItem
                            key={`depart-${index}`}
                            value={`${depart}`}
                          >
                            {depart}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exemption_fees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fees</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nb_students"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nb Students</FormLabel>
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
            <FormField
              control={form.control}
              name="id_bourse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scholarship</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue="-1"
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a scholarship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={`-1`}>None</SelectItem>
                      {scholarships.map((scho) => (
                        <SelectItem key={scho.id} value={`${scho.id}`}>
                          {scho.name}
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
              name="recrutement_sur_dossier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recrutement Sur Dossier</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="r1" />
                      <Label htmlFor="r1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="r2" />
                      <Label htmlFor="r2">No</Label>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_candidature_deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidature Deposit Date</FormLabel>
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
              name="is_entretien_motivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entretien de Motivation</FormLabel>
                  <RadioGroup
                    onValueChange={(e) => {
                      field.onChange(e);
                      Rerender(!render);
                    }}
                    value={field.value}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="r1" />
                      <Label htmlFor="r1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="r2" />
                      <Label htmlFor="r2">No</Label>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues().is_entretien_motivation === "true" && (
              <FormField
                control={form.control}
                name="entretien_motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'entretien de Motivation</FormLabel>
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
                          selected={field.value as Date}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="is_oral_exam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oral Exam</FormLabel>
                  <RadioGroup
                    onValueChange={(e) => {
                      field.onChange(e);
                      Rerender(!render);
                    }}
                    value={field.value}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="r1" />
                      <Label htmlFor="r1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="r2" />
                      <Label htmlFor="r2">No</Label>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues().is_oral_exam === "true" && (
              <FormField
                control={form.control}
                name="oral_exam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oral Exam Date</FormLabel>
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
                          selected={field.value as Date}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="is_written_exam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Written Exam</FormLabel>
                  <RadioGroup
                    onValueChange={(e) => {
                      field.onChange(e);
                      Rerender(!render);
                    }}
                    value={field.value}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="r1" />
                      <Label htmlFor="r1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="r2" />
                      <Label htmlFor="r2">No</Label>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues().is_written_exam === "true" && (
              <FormField
                control={form.control}
                name="written_exam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Written Exam Date</FormLabel>
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
                          selected={field.value as Date}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="result_dates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Result Date</FormLabel>
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
              name="date_d_appel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date D'appel</FormLabel>
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
                        selected={field.value as Date}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="w-full flex items-center justify-end gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="mr-4"
            onClick={() => navigate(`/${NAVIGATE_HEADER}`)}
          >
            Cancel
          </Button>
          <Button size="lg" onClick={form.handleSubmit(onSubmit)}>
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
export default AddEditMasters;
