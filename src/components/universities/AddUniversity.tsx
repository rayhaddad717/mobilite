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
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  university_name: z.string().min(2, {
    message: "University Name must be at least 2 characters.",
  }),
});
function AddUniversity() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      university_name: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const response = await API.post<any, APIResponse<any>>(
        "/university",
        values
      );
      if (response.data.statusCode === 201) {
        toast({
          title: "Success",
          description: "Successfully create university",
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
  return (
    <div className="container mt-4 flex flex-col gap-4">
      <h2 className="text-3xl">Add a new University</h2>
      <div className="max-w-[400px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="university_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
export default AddUniversity;
