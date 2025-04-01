import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const VendorStatsTable = ({ data, isLoading }) => {
  const columns = [
    { key: "vendor_name", label: "Vendor Name" },
    { key: "total_findings", label: "Total Findings" },
    { key: "archive_status", label: "Archive Status" },
    { key: "human_verified", label: "Human Verified" },
    { key: "recent_addition_date", label: "Recent Addition Date" }
  ];

  return (
    <div className="w-full mt-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key}
                  className="font-semibold text-black"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state with skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.length > 0 ? (
              // Data rows
              data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {row.vendor?.vendor_name || "--"}
                  </TableCell>
                  <TableCell>{row.total_findings || 0}</TableCell>
                  <TableCell>
                    {row.vendor?.archive_status ? "Archived" : "Active"}
                  </TableCell>
                  <TableCell>
                    {row.vendor?.human_verified ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    {row.vendor?.recent_addition_date 
                      ? new Date(row.vendor.recent_addition_date).toLocaleDateString()
                      : "--"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // No data state
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VendorStatsTable; 