import Header from "@/components/common/Header";
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
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import upload_form from "@/assets/image/upload-form.svg";
import toast, { LoaderIcon } from "react-hot-toast";
import { axiosInstance } from "@/axios/instance";
import { useProcessInvoice } from "@/components/invoice/api";

const formSchema = z.object({
  restaurant_id: z.string().min(2, { message: "Restaurant ID is required." }),
  invoice_document_id: z
    .string()
    .min(2, { message: "Invoice Document ID is required." }),
  channel: z.string().min(3, { message: "Channel is required." }),
  invoice_pdf: z.any()
});

const InvoiceProcessor = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurant_id: "",
      invoice_document_id: "",
      channel: "",
      invoice_pdf: null
    }
  });
  const { mutate, isPending } = useProcessInvoice();
  const onSubmit = async (payload) => {
    const formData = new FormData();
    formData.append("restaurant_id", payload.restaurant_id);
    formData.append("invoice_document_id", payload.invoice_document_id);
    formData.append("channel", payload.channel);
    formData.append("invoice_pdf", payload.invoice_pdf);

    // Check if the file is captured correctly
    if (payload.invoice_pdf) {
      formData.append("invoice_pdf", payload.invoice_pdf); // Append file object
      mutate(payload, {
        onSuccess: () => {
          form.reset();
        }
      });
    } else {
      console.error("No invoice_pdf found in payload");
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <Navbar />
      <Layout className={"mx-10 box-border"}>
        <Header
          title={"Process Invoice"}
          className="border mt-10 rounded-md !text-[#FFFFFF] !shadow-none bg-primary"
        />
        <div className="flex-1 flex w-full items-center h-[70vh]">
          <Form {...form} className="!w-1/2">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-x-4 gap-y-4 !w-full px-24"
            >
              <FormField
                control={form.control}
                name="restaurant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Restaurant ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoice_document_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Document ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Invoice Document ID"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Channel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoice_pdf"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Picture</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        placeholder="Picture"
                        type="file"
                        accept="image/*, application/pdf"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="!w-full col-span-2">
                <Button type="submit" className="!w-full">
                  {isPending ? (
                    <>
                      Submitting <LoaderIcon className="ml-2" />
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="flex justify-center items-center h-full w-full">
            <img src={upload_form} alt="Upload Form" className="max-h-96" />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default InvoiceProcessor;
