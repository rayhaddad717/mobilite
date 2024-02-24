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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

const COUNTIRES = [
  { id: 1, name: "Afghanistan" },
  { id: 2, name: "Albania" },
  { id: 3, name: "Algeria" },
  { id: 4, name: "Andorra" },
  { id: 5, name: "Angola" },
  { id: 6, name: "Antigua and Barbuda" },
  { id: 7, name: "Argentina" },
  { id: 8, name: "Armenia" },
  { id: 9, name: "Australia" },
  { id: 10, name: "Austria" },
  { id: 11, name: "Azerbaijan" },
  { id: 12, name: "Bahamas" },
  { id: 13, name: "Bahrain" },
  { id: 14, name: "Bangladesh" },
  { id: 15, name: "Barbados" },
  { id: 16, name: "Belarus" },
  { id: 17, name: "Belgium" },
  { id: 18, name: "Belize" },
  { id: 19, name: "Benin" },
  { id: 20, name: "Bhutan" },
  { id: 21, name: "Bolivia" },
  { id: 22, name: "Bosnia and Herzegovina" },
  { id: 23, name: "Botswana" },
  { id: 24, name: "Brazil" },
  { id: 25, name: "Brunei" },
  { id: 26, name: "Bulgaria" },
  { id: 27, name: "Burkina Faso" },
  { id: 28, name: "Burundi" },
  { id: 29, name: "Cabo Verde" },
  { id: 30, name: "Cambodia" },
  { id: 31, name: "Cameroon" },
  { id: 32, name: "Canada" },
  { id: 33, name: "Central African Republic" },
  { id: 34, name: "Chad" },
  { id: 35, name: "Chile" },
  { id: 36, name: "China" },
  { id: 37, name: "Colombia" },
  { id: 38, name: "Comoros" },
  { id: 39, name: "Congo (Congo-Brazzaville)" },
  { id: 40, name: "Costa Rica" },
  { id: 41, name: "Croatia" },
  { id: 42, name: "Cuba" },
  { id: 43, name: "Cyprus" },
  { id: 44, name: "Czechia (Czech Republic)" },
  { id: 45, name: "Democratic Republic of the Congo" },
  { id: 46, name: "Denmark" },
  { id: 47, name: "Djibouti" },
  { id: 48, name: "Dominica" },
  { id: 49, name: "Dominican Republic" },
  { id: 50, name: "Ecuador" },
  { id: 51, name: "Egypt" },
  { id: 52, name: "El Salvador" },
  { id: 53, name: "Equatorial Guinea" },
  { id: 54, name: "Eritrea" },
  { id: 55, name: "Estonia" },
  { id: 56, name: "Eswatini" },
  { id: 57, name: "Ethiopia" },
  { id: 58, name: "Fiji" },
  { id: 59, name: "Finland" },
  { id: 60, name: "France" },
  { id: 61, name: "Gabon" },
  { id: 62, name: "Gambia" },
  { id: 63, name: "Georgia" },
  { id: 64, name: "Germany" },
  { id: 65, name: "Ghana" },
  { id: 66, name: "Greece" },
  { id: 67, name: "Grenada" },
  { id: 68, name: "Guatemala" },
  { id: 69, name: "Guinea" },
  { id: 70, name: "Guinea-Bissau" },
  { id: 71, name: "Guyana" },
  { id: 72, name: "Haiti" },
  { id: 73, name: "Holy See" },
  { id: 74, name: "Honduras" },
  { id: 75, name: "Hungary" },
  { id: 76, name: "Iceland" },
  { id: 77, name: "India" },
  { id: 78, name: "Indonesia" },
  { id: 79, name: "Iran" },
  { id: 80, name: "Iraq" },
  { id: 81, name: "Ireland" },
  { id: 82, name: "Israel" },
  { id: 83, name: "Italy" },
  { id: 84, name: "Jamaica" },
  { id: 85, name: "Japan" },
  { id: 86, name: "Jordan" },
  { id: 87, name: "Kazakhstan" },
  { id: 88, name: "Kenya" },
  { id: 89, name: "Kiribati" },
  { id: 90, name: "Kuwait" },
  { id: 91, name: "Kyrgyzstan" },
  { id: 92, name: "Laos" },
  { id: 93, name: "Latvia" },
  { id: 94, name: "Lebanon" },
  { id: 95, name: "Lesotho" },
  { id: 96, name: "Liberia" },
  { id: 97, name: "Libya" },
  { id: 98, name: "Liechtenstein" },
  { id: 99, name: "Lithuania" },
  { id: 100, name: "Luxembourg" },
  { id: 101, name: "Madagascar" },
  { id: 102, name: "Malawi" },
  { id: 103, name: "Malaysia" },
  { id: 104, name: "Maldives" },
  { id: 105, name: "Mali" },
  { id: 106, name: "Malta" },
  { id: 107, name: "Marshall Islands" },
  { id: 108, name: "Mauritania" },
  { id: 109, name: "Mauritius" },
  { id: 110, name: "Mexico" },
  { id: 111, name: "Micronesia" },
  { id: 112, name: "Moldova" },
  { id: 113, name: "Monaco" },
  { id: 114, name: "Mongolia" },
  { id: 115, name: "Montenegro" },
  { id: 116, name: "Morocco" },
  { id: 117, name: "Mozambique" },
  { id: 118, name: "Myanmar" },
  { id: 119, name: "Namibia" },
  { id: 120, name: "Nauru" },
  { id: 121, name: "Nepal" },
  { id: 122, name: "Netherlands" },
  { id: 123, name: "New Zealand" },
  { id: 124, name: "Nicaragua" },
  { id: 125, name: "Niger" },
  { id: 126, name: "Nigeria" },
  { id: 127, name: "North Korea" },
  { id: 128, name: "North Macedonia" },
  { id: 129, name: "Norway" },
  { id: 130, name: "Oman" },
  { id: 131, name: "Pakistan" },
  { id: 132, name: "Palau" },
  { id: 133, name: "Palestine State" },
  { id: 134, name: "Panama" },
  { id: 135, name: "Papua New Guinea" },
  { id: 136, name: "Paraguay" },
  { id: 137, name: "Peru" },
  { id: 138, name: "Philippines" },
  { id: 139, name: "Poland" },
  { id: 140, name: "Portugal" },
  { id: 141, name: "Qatar" },
  { id: 142, name: "Romania" },
  { id: 143, name: "Russia" },
  { id: 144, name: "Rwanda" },
  { id: 145, name: "Saint Kitts and Nevis" },
  { id: 146, name: "Saint Lucia" },
  { id: 147, name: "Saint Vincent and the Grenadines" },
  { id: 148, name: "Samoa" },
  { id: 149, name: "San Marino" },
  { id: 150, name: "Sao Tome and Principe" },
  { id: 151, name: "Saudi Arabia" },
  { id: 152, name: "Senegal" },
  { id: 153, name: "Serbia" },
  { id: 154, name: "Seychelles" },
  { id: 155, name: "Sierra Leone" },
  { id: 156, name: "Singapore" },
  { id: 157, name: "Slovakia" },
  { id: 158, name: "Slovenia" },
  { id: 159, name: "Solomon Islands" },
  { id: 160, name: "Somalia" },
  { id: 161, name: "South Africa" },
  { id: 162, name: "South Korea" },
  { id: 163, name: "South Sudan" },
  { id: 164, name: "Spain" },
  { id: 165, name: "Sri Lanka" },
  { id: 166, name: "Sudan" },
  { id: 167, name: "Suriname" },
  { id: 168, name: "Sweden" },
  { id: 169, name: "Switzerland" },
  { id: 170, name: "Syria" },
  { id: 171, name: "Tajikistan" },
  { id: 172, name: "Tanzania" },
  { id: 173, name: "Thailand" },
  { id: 174, name: "Timor-Leste" },
  { id: 175, name: "Togo" },
  { id: 176, name: "Tonga" },
  { id: 177, name: "Trinidad and Tobago" },
  { id: 178, name: "Tunisia" },
  { id: 179, name: "Turkey" },
  { id: 180, name: "Turkmenistan" },
  { id: 181, name: "Tuvalu" },
  { id: 182, name: "Uganda" },
  { id: 183, name: "Ukraine" },
  { id: 184, name: "United Arab Emirates" },
  { id: 185, name: "United Kingdom" },
  { id: 186, name: "United States of America" },
  { id: 187, name: "Uruguay" },
  { id: 188, name: "Uzbekistan" },
  { id: 189, name: "Vanuatu" },
  { id: 190, name: "Venezuela" },
  { id: 191, name: "Vietnam" },
  { id: 192, name: "Yemen" },
  { id: 193, name: "Zambia" },
  { id: 194, name: "Zimbabwe" },
];

const websiteRegex =
  /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;

const formSchema = z.object({
  university_name: z.string().min(2, {
    message: "university must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "country must be at least 2 characters.",
  }),
  website: z.string().refine((value) => websiteRegex.test(value), {
    message: "Website must start with 'www.' and end with '.com'",
  }),
  convention_info: z.string().min(2, {
    message: "Information of convention must be at least 2 characters.",
  }),
  convention_date: z.date(),
  procedure_inscription: z.string().min(2, {
    message: "procedure of inscription must be at least 2 characters.",
  }),
  is_free: z.string(),
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
      country: "",
      website: "",
      is_free: "false",
      convention_info: "",
      convention_date: new Date(),
      procedure_inscription: "",
    },
  });
  // Add event handler to update isUniversityFree state
  const handleUniversityFreeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUniversityFree(e.target.value === "yes");
  };
  async function getUniversity() {
    try {
      const response = await API.get<any, AxiosResponse<APIResponse<any>>>(
        `/${API_URL_HEADER}/${params.id}`
      );
      if (response.data.statusCode === 200) {
        form.setValue("university_name", response.data.data.university_name!);
        form.setValue("country", response.data.data.country);
        console.log(response.data.data.country);
        form.setValue("website", response.data.data.website!);
        form.setValue("is_free", response.data.data.is_free ? "true" : "false");
        form.setValue(
          "convention_date",
          new Date(response.data.data.convention_date!)
        );
        form.setValue("convention_info", response.data.data.convention_info!);
        form.setValue(
          "procedure_inscription",
          response.data.data.procedure_inscription!
        );
        console.log(form.getValues());
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
      let payload: any = isAdd ? values : { ...values, id: params.id };
      console.log("payload.is_free", payload.is_free);
      payload.is_free = payload.is_free === "true" ? true : false;
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
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            style={{
              display: "grid",
              gridTemplateColumns: "45% 45%",
              columnGap: "5%",
            }}
          >
            <h2 className="text-2xl font-bold">
              {" "}
              {isAdd ? "Add a new University" : "University Details"}
            </h2>
            <p></p>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={field.value || "Select a country"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTIRES.map((country) => (
                        <SelectItem key={country.id} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>This is the country name.</FormDescription>
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
              name="convention_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convention Information</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
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
                  <FormControl></FormControl>
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
          </form>
        </Form>
        <div className="w-full flex items-center gap-4 justify-end">
          <Button
            size={"lg"}
            variant="secondary"
            className="mr-4"
            onClick={() => navigate("/university")}
          >
            Cancel
          </Button>
          <Button size={"lg"} onClick={form.handleSubmit(onSubmit)}>
            {isAdd ? "Add" : "Edit"}
          </Button>
        </div>
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
