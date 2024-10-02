import React from "react";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Header from "@/components/common/Header";

const CreateInvoice = () => {
  return (
    <>
      <Navbar />

      <Layout className={"mx-10 box-border"}>
        <Header
          title={"Create Invoice"}
          className="border mt-10 rounded-md !shadow-none bg-gray-200"
        />

      </Layout>
    </>
  );
};

export default CreateInvoice;
