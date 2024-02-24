import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Container } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import API from "@/api/API";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useNavigate } from "react-router-dom";
const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { username, password } = values;
    try {
      const response = await API.post("/login", {
        username,
        password,
      });
      localStorage.setItem("isLoggedIn", "true");
      console.log("Login successful", response.data);
      toast({
        title: "Success",
        description: `You are now Logged in`,
        action: <ToastAction altText="Goto schedule to undo">Done</ToastAction>,
      });
      navigate("/university");
      // Handle login success (e.g., redirect, store token)
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Error",
        description: `Invalid Credentials`,
        action: <ToastAction altText="Goto schedule to undo">Done</ToastAction>,
      });
      // Handle login failure
    }
  };

  return (
    <div className="w-[100vw] flex items-center h-[100vh] justify-center p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8  w-[45vw]"
          style={{
            display: "grid",
            gridTemplateColumns: "45% 45%",
            columnGap: "5%",
          }}
        >
          <h2 className="text-2xl font-bold">Login</h2>
          <p></p>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            style={{
              gridColumn: "1 / -1",
              textAlign: "end",
            }}
          >
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
export default LoginPage;
