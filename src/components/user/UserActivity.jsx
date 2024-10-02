import Layout from "../common/Layout";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import Header from "../common/Header";
import { useGetUsersList } from "./api";
import { Button } from "../ui/button";
import TablePagination from "../common/TablePagination";
import Navbar from "../common/Navbar";
import { Skeleton } from "../ui/skeleton";

const UserActivity = () => {
  const { data, isLoading } = useGetUsersList();

  return (
    <>
      <Navbar />

      <Layout className={"mx-10 box-border"}>
        <Header
          title={"Users"}
          className="border mt-10 rounded-md !shadow-none bg-gray-200"
        />

        <Table className="mt-8 flex flex-col   box-border">
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
              ? [0, 1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                  <TableRow
                    className="grid grid-cols-3 mt-2 font-semibold"
                    key={index}
                  >
                    <TableCell className="flex justify-start">
                      <Skeleton className={"w-24 h-5"} />
                    </TableCell>
                    <TableCell className="flex justify-center">
                      {" "}
                      <Skeleton className={"w-72 h-5"} />
                    </TableCell>
                    <TableCell className="flex justify-end">
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
        <div className="absolute right-14 bottom-14">
          <TablePagination totalPages={data?.total_pages} />
        </div>
      </Layout>
    </>
  );
};

export default UserActivity;
