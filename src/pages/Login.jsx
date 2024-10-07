import React from "react";
import Navbar from "../components/common/Navbar";
import auth from "@/assets/image/login.svg";
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
import { useNavigate } from "react-router-dom";
import { useSignIn } from "@/components/auth/api";
import toast, { Toaster } from "react-hot-toast";

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
  const { mutate, isPending } = useSignIn();
  const navigate = useNavigate();

  const onSubmit = (payload) => {
    mutate(payload, {
      onError: (data) => {
        console.log(data);
      },
      onSuccess: (data) => {
        const {
          access_token,
          refresh_token,
          first_name,
          last_name,
          role,
          username
        } = data["data"];
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("first_name", first_name);
        localStorage.setItem("last_name", last_name);
        localStorage.setItem("user_role", role);
        localStorage.setItem("username", username);
        navigate("/")

      }
    });
  };

  return (
    <div className="h-full">
      <Navbar />
      <Toaster />
      <div className="grid grid-cols-2 mt-2 flex-1 h-[90vh] gap-x-2">
        <div className="h-full flex flex-col  justify-center items-center ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2">
              <p className="!text-left font-bold text-xl ">Log in</p>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="!min-w-[400px] mt-6">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username or email"
                        {...field}
                        className="focus:!outline-none focus:!ring-0"
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
                  <FormItem className="mt-6 !min-w-[400px]">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="focus:!outline-none focus:!ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-6 w-full">
                {isPending ? "Logging in...." : "Log in"}
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
