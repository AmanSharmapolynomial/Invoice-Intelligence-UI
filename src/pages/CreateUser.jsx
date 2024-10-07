"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import signUp from "@/assets/image/sign-up.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/components/auth/api";
import CustomSelect from "@/components/ui/CustomSelect";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  first_name: z.string().min(2, { message: "First Name is required." }),
  last_name: z.string().min(2, { message: "Last Name is required." }),
  username: z.string().min(3, { message: "Username is required." }),
  email: z
    .string()
    .email({ message: "Invalid email format." })
    .nonempty({ message: "Email is required." }),
  user_role: z.string().nonempty({ message: "Role is required." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
});

export function CreateUser() {
  const { mutate, isPending } = useSignUp();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      first_name: "",
      username: "",
      email: "",
      user_role: "",
      password: ""
    }
  });

  const onSubmit = (payload) => {
    mutate(payload, {
      onSuccess: (data) => {
        form.reset();
        navigate("/login");
      }
    });
  };

  return (
    <>
      <Navbar />
      <Layout>
        <div className="w-full border h-[90vh] flex overflow-hidden">
          <div className="w-1/2 h-full flex flex-col pt-[10%] px-20 gap-y-6">
            <p className="text-xl font-bold !text-left text-primary">
              Create User
            </p>

            <Form {...form} className="!w-full">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2  gap-x-4 gap-y-4 !w-full"
              >
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          className="focus:!outline-none focus:!ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last Name"
                          className="focus:!outline-none focus:!ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          className="focus:!outline-none focus:!ring-0"
                          {...field}
                        />
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
                        <Input
                          placeholder="Email"
                          className="focus:!outline-none focus:!ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user_role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <FormControl>
                        <CustomSelect
                          placeholder="Select Role"
                          data={[
                            { label: "Balancer", value: "balancer" },
                            { label: "Developer", value: "developer" },
                            { label: "Manager", value: "manager" },
                            { label: "Admin", value: "admin" },
                            { label: "Approver", value: "approver" }
                          ]}
                          showSearch={false}
                          onSelect={field.onChange}
                          className="focus:!outline-none focus:!ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                        <Input
                          type="password"
                          placeholder="Password"
                          className="focus:!outline-none focus:!ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="!w-full  col-span-2">
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="!w-full"
                  >
                    Create{" "}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className="w-1/2 h-full flex items-center justify-center">
            <img src={signUp} alt="Sign Up" />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default CreateUser;
