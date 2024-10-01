import React from "react";
import Navbar from "../common/Navbar";
import auth from "@/assets/image/auth.jpg";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  username: z
    .string()
    .min(2, "username must have minimum 4 characters.")
    .max(50),
  password: z
    .string()
    .min(4, "password should be atleast of 4 characters.")
    .max(20)
});

const Login = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = (values) => {
    console.log(values);
    // Handle authentication here
  };

  return (
    <div className="h-full">
      <Navbar />
      <div className="grid grid-cols-2 mt-2 flex-1 h-[90vh] gap-x-2">
        <div className="h-full flex flex-col items-center justify-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <p className="!text-left font-bold text-xl ">Log in</p>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="!min-w-[400px] mt-6">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username or email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-6 w-full">
                Log in
              </Button>
            </form>
          </Form>
        </div>
        <div className="h-full flex justify-center overflow-hidden">
          <img
            src={auth}
            alt="Authentication"
            className="max-w-[80%] max-h-[70%] mt-24"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
