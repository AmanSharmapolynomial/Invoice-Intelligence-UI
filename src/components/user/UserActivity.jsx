import Layout from "@/components/common/Layout";

import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import TablePagination from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useGetUsersList } from "./api";

const UserActivity = () => {
  const { data, isLoading } = useGetUsersList();

  return (
    <>
      <Navbar />

      <Layout className={"mx-10 box-border "}>
        <Header
          title={"Users"}
          className="border mt-10 rounded-md  !shadow-none bg-gray-200"
        >
          <Link to={"/create-user"}>
            <Button>Add User</Button>
          </Link>
        </Header>

        <Table className="pt-4 flex flex-col  border  box-border max-h-[70vh] overflow-hidden px-4">
          <TableHeader className="">
            <TableRow className="grid grid-cols-3  text-base">
              <TableHead className="flex justify-start !font-bold !text-gray-800">
                Username
              </TableHead>
              <TableHead className="flex justify-center !font-bold !text-gray-800">
                User Id
              </TableHead>
              <TableHead className="flex justify-end mr-6 !font-bold !text-gray-800">
                Activity
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
                  <TableRow
                    className="grid grid-cols-3 mt-2 font-semibold h-14"
                    key={index}
                  >
                    <TableCell className="flex justify-start items-center">
                      <Skeleton className={"w-24 h-4"} />
                    </TableCell>
                    <TableCell className="flex justify-center items-center">
                      {" "}
                      <Skeleton className={"w-72 h-5"} />
                    </TableCell>
                    <TableCell className="flex justify-end items-center">
                      <Skeleton className={"w-24 h-5"} />
                    </TableCell>
                  </TableRow>
                ))
              : data?.data?.map(({ id, username }) => (
                  <TableRow
                    className="grid grid-cols-3 mt-2 font-semibold"
                    key={id}
                  >
                    <TableCell className="flex justify-start">
                      {username}
                    </TableCell>
                    <TableCell className="flex justify-center">{id}</TableCell>
                    <TableCell className="flex justify-end">
                      <Button>View Activity</Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <div className="w-full">
          <TablePagination
            totalPages={data?.total_pages}
            isFinalPage={data?.is_final_page}
          />
        </div>
      </Layout>
    </>
  );
};

export default UserActivity;
