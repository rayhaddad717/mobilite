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

const formSchema = z.object({
  name: z.string().min(2),
  duration: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  dateFrom: z.date(),
  dateTo: z.date(),
  value: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  condition_obtention: z.string().min(2),
});
const NAVIGATE_HEADER = "scholarship";
const API_URL_HEADER = "scholarship";
function AddEditScholarship() {
  const navigate = useNavigate();
  const params = useParams();
  const [isAdd] = useState(!params?.id);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      duration: "0",
      dateFrom: new Date(),
      dateTo: new Date(),
      value: "0",
      condition_obtention: "",
    },
  });
  async function getData() {
    try {
      const response = await API.get<any, AxiosResponse<APIResponse<any>>>(
        `/${API_URL_HEADER}/${params.id}`
      );
      if (response.data.statusCode === 200) {
        form.setValue("name", response.data.data.name!);
        form.setValue("duration", response.data.data.duration.toString());
        form.setValue("dateFrom", new Date(response.data.data.dateFrom!));
        form.setValue("dateTo", new Date(response.data.data.dateTo!));
        form.setValue("value", response.data.data.value.toString());
        form.setValue(
          "condition_obtention",
          response.data.data.condition_obtention!
        );
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
          description: `Successfully deleted university ${NAVIGATE_HEADER}`,
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
      payload.value = Number(payload.value);
      payload.duration = Number(payload.duration);
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
      <h2 className="text-3xl">
        {isAdd ? `Add a new ${NAVIGATE_HEADER}` : `${NAVIGATE_HEADER} Details`}
      </h2>
      <div className="max-w-[400px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
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
              name="dateTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
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
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condition_obtention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition Obtention</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
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
export default AddEditScholarship;
