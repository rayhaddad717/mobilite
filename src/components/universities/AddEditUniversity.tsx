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

const websiteRegex = /^www\..+\.com$/;

const formSchema = z.object({
  university_name: z.string().min(2,{
    message:"university must be at least 2 characters."
  }),
  country:z.string().min(2,{
    message:"country must be at least 2 characters.",
  }),
  website:z.string().refine(value => websiteRegex.test(value), {
    message: "Website must start with 'www.' and end with '.com'"
  }),
  convention_info:z.string().min(2,{
    message:"Information of convention must be at least 2 characters.",
  }),
  convention_date:z.date(),
  procedure_inscription:z.string().min(2,{
    message:"procedure of inscription must be at least 2 characters.",
  }),
  is_free:z.boolean(),
  
});
const API_URL_HEADER = "university";
function AddEditUniversity() {
  const [isUniversityFree, setIsUniversityFree] = useState(false); 
  const navigate = useNavigate();
  const params = useParams();
  const [isAdd] = useState(!params?.id);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      university_name: "",
      country:"",
      website:"",
      is_free:false,
      convention_info:"",
      convention_date:new Date(),
      procedure_inscription:"",
      
    },
  });
  // Add event handler to update isUniversityFree state
  const handleUniversityFreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUniversityFree(e.target.value === "yes");
  };
  async function getUniversity() {
    try {
      const response = await API.get<any, AxiosResponse<APIResponse<any>>>(
        `/${API_URL_HEADER}/${params.id}`
      );
      if (response.data.statusCode === 200) {
        form.setValue("university_name", response.data.data.university_name!);
        form.setValue("country",response.data.data.country!);
        form.setValue("website",response.data.data.website!);
        form.setValue("is_free",response.data.data.is_free!);
        form.setValue("convention_date",response.data.data.convention_date!);
        form.setValue("convention_info",response.data.data.convention_info!);
        form.setValue("procedure_inscription",response.data.data.procedure_inscription!);
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
        navigate("/university");
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
        navigate("/university");
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
        {isAdd ? "Add a new University" : "University Details"}
      </h2>
      <div className="max-w-[400px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="university_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University Name</FormLabel>
                  <FormControl>
                    <Input placeholder="ULFG" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the university name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the country name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="www.univeristy.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_free"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University public</FormLabel>
                  <label>
                      <input
                        type="radio"
                        name="is_free"
                        value="yes"
                        checked={isUniversityFree}
                        onChange={handleUniversityFreeChange}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="is_free"
                        value="no"
                        checked={!isUniversityFree}
                        onChange={handleUniversityFreeChange}
                      />
                      No
                    </label>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="convention_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convention Information</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="convention_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convention Date</FormLabel>
                  <FormControl>
                  
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="procedure_inscription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procedure Inscription</FormLabel>
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
              onClick={() => navigate("/university")}
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
export default AddEditUniversity;
