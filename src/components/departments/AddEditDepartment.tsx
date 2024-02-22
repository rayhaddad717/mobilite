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

const formSchema = z.object({
  department_name: z.string().min(2, {
    message: "Department Name must be at least 2 characters.",
  }),
});
const NAVIGATE_HEADER = "department";
const API_URL_HEADER = "department";
function AddEditDepartment() {
  const navigate = useNavigate();
  const params = useParams();
  const [isAdd] = useState(!params?.id);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department_name: "",
    },
  });
  async function getUniversity() {
    try {
      const response = await API.get<any, AxiosResponse<APIResponse<any>>>(
        `/${API_URL_HEADER}/${params.id}`
      );
      if (response.data.statusCode === 200) {
        form.setValue("department_name", response.data.data.department_name!);
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
          description: "Successfully deleted university",
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
      let payload = isAdd ? values : { ...values, id: params.id };
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
          } university`,
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
      getUniversity();
    }
  }, [isAdd]);
  return (
    <div className="container mt-4 flex flex-col gap-4">
      <h2 className="text-3xl">
        {isAdd ? "Add a new Department" : "Department Details"}
      </h2>
      <div className="max-w-[400px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="department_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="ULFG" {...field} />
                  </FormControl>
                  <FormDescription>This is the deparment name.</FormDescription>
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
          description={"Are you sure you want to delete university"}
        />
      </div>
    </div>
  );
}
export default AddEditDepartment;
