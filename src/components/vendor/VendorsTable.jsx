import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import approved from "@/assets/image/approved.svg";
const VendorsTable = ({ columns, data }) => {
  return (
    <div className="w-full mt-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="!rounded-md !relative !min-h-full box-border flex flex-col min-w-full">
          <TableHeader className="w-full sticky top-0 z-10 pr-[0.7rem]">
            <TableRow
              className={`!text-white !rounded-md w-full  grid grid-cols-${columns?.length} items-center justify-center text-xs sm:text-sm `}
            >
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={
                    " font-poppins !px-[0.75rem] font-semibold text-black leading-5 text-sm border-r  items-center flex"
                  }
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="max-h-[44rem] overflow-auto w-full">
            <div className="w-full">
              {data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={`grid grid-cols-${columns?.length} w-full items-center text-xs sm:text-sm`}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`border-r h-full font-poppins px-[0.8rem] text-sm font-normal `}
                    >
                      {column?.key == "human_verified" ? (
                        row[column?.key] == true ? (
                          <img src={approved} alt="Approved" />
                        ) : (
                          <></>
                        )
                      ) : (
                        row[column.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </div>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VendorsTable;
