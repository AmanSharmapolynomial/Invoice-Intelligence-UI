import approved from "@/assets/image/approved.svg";
import sort from "@/assets/image/sort.svg";
import unapproved from "@/assets/image/unapproved.svg";
import undo from "@/assets/image/undo.svg";
import { Button } from "@/components/ui/button";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { v4 as uuidv4 } from "uuid";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { categoryNamesFormatter, headerNamesFormatter } from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { useEffect, useState } from "react";
import {
  ArrowDownFromLine,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowUpToLine,
  Trash2
} from "lucide-react";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import ContextMenu from "../ContextMenu";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import CustomInput from "@/components/ui/Custom/CustomInput";
import { useAutoCalculate } from "../api";

const HumanVerificationTable = ({
  data,
  isLoading,
  additionalData,
  loadingAdditionalData,
  document_uuid,
  metadata,
  payload
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-8">
        {[1, 2, 3, 4, 5, 6, 7, 8.9, 10].map((_, i) => {
          return (
            <div
              key={i}
              className="grid grid-cols-3 items-center gap-y-8 gap-x-8"
            >
              <Skeleton key={i} className={"w-[19rem] h-[2rem]"} />
              <Skeleton key={i} className={"w-[19rem] h-[2rem]"} />
              <Skeleton key={i} className={"w-[19rem] h-[2rem]"} />
            </div>
          );
        })}
      </div>
    );
  }

  const [autoCalculate, setAutoCalculate] = useState(false);
  const [stopHovering, setStopHovering] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(false);
  const [showActionsPopup, setShowActionsPopup] = useState(false);
  const [viewVerificationColumn, setViewVerificationColumn] = useState(true);
  const [viewDeleteColumn, setViewDeleteColumn] = useState(false);
  const [viewShiftColumn, setViewShiftColumn] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [editMode, setEditMode] = useState({ rowIndex: null, cellIndex: null });
  const [cellValue, setCellValue] = useState("");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    rowIndex: null,
    cellIndex: null,
    column_uuid: null,
    cell_uuid: null,
    row_uuid: null
  });
  const { mutate } = useAutoCalculate();
  const handleCloseMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };
  const menuOptions = [
    {
      label: "Add Column",
      action: () => {
        addEmptyColumn();
      }
    },
    {
      label: "Add Row",
      action: () => {
        addRow(contextMenu.rowIndex);
      }
    },
    {
      label: "Copy Row Up",
      action: () => {
        copyRow(contextMenu.rowIndex, "up");
      }
    },
    {
      label: "Copy Row Down",
      action: () => {
        copyRow(contextMenu.rowIndex, "down");
      }
    },

    // {
    //   label: "Add Cell",
    //   action: () => {
    //     addNewCell(
    //       contextMenu.rowIndex,
    //       contextMenu?.column_uuid,
    //       contextMenu?.cell_uuid
    //     );
    //   }
    // },
    // {
    //   label: "Delete Cell",
    //   action: () => {
    //     deleteCell(
    //       contextMenu?.rowIndex,
    //       contextMenu?.column_uuid,
    //       contextMenu?.cell_uuid
    //     );
    //   }
    // },

    {
      label: "Shift Row Up",
      action: () => {
        handleRowShifting(contextMenu.rowIndex, "up");
      }
    },
    {
      label: "Shift Row Down",
      action: () => {
        handleRowShifting(contextMenu.rowIndex, "down");
      }
    },

    {
      label: "Delete Row",
      action: () => {
        deleteRow(contextMenu.rowIndex);
      }
    }
  ];
  const {
    highlightAll,
    setHighlightAll,
    setBoundingBox,
    setMetaData,
    setBoundingBoxes,
    bounding_box,
    bounding_boxes,
    totalExtendedPrce,
    setTotalExtendedPrice,
    setHistory,
    setReCalculateCWiseSum,
    setHighlightRow,
    updatedFields,
    setUpdatedFields,
    reCalculateCWiseSum,
    clearUpdatedFields,
    editVendor,
    editBranch,
    newVendor,
    history,
    newBranch,
    setOperations,
    operations,
    branchChanged,
    vendorChanged,
    metaData
  } = invoiceDetailStore();

  const { columns = [], rows = [] } = data?.data?.processed_table;

  const handleDropdownChange = (column_uuid, column_name) => {
    // Deep copy of the data to avoid direct mutation
    let copyObj = JSON.parse(JSON.stringify(data));
    const { rows, columns } = copyObj?.data?.processed_table;

    // Update the column name in the columns array
    columns?.forEach((col) => {
      if (col?.column_uuid === column_uuid) {
        col.column_name = column_name;
      }
    });

    // Update the query data with the modified table structure
    queryClient.setQueryData(["combined-table", document_uuid], copyObj);

    // Check if an update operation for this column already exists
    const existingIndex = operations?.findIndex(
      (op) =>
        op?.type === "update_column" && op?.data?.column_uuid === column_uuid
    );

    if (existingIndex === -1) {
      // Add a new operation if it doesn't exist
      const newOperation = {
        type: "update_column",
        operation_order: operations?.length + 1,
        data: {
          column_uuid,
          selected_column: true,
          column_name
        }
      };
      setOperations([...operations, newOperation]);
    } else {
      // Update the existing operation with the new column name
      let updatedOperations = [...operations];
      updatedOperations[existingIndex] = {
        ...updatedOperations[existingIndex],
        data: {
          ...updatedOperations[existingIndex]?.data,
          column_name
        }
      };
      setOperations(updatedOperations);
    }
  };

  // useEffects

  useEffect(() => {
    if (data) {
      let copyObj = JSON.parse(JSON.stringify(data));
      const { columns = [], rows = [] } = copyObj?.data?.processed_table;
      const columnOrderMap = columns?.reduce((acc, column) => {
        acc[column.column_uuid] = column.column_order;
        return acc;
      }, {});
      copyObj?.data?.processed_table?.rows?.forEach((row) => {
        row?.cells?.sort((a, b) => {
          return columnOrderMap[a.column_uuid] - columnOrderMap[b.column_uuid];
        });
      });

      queryClient.setQueryData(["combined-table", document_uuid], copyObj);
    }
  }, [data]);

  useEffect(() => {
    if (highlightAll == true) {
      let pushed = [];
      data?.data?.processed_table?.rows?.map((row) =>
        row?.cells?.map((cell) =>
          pushed.push({
            box: cell?.bounding_box,
            page_index: cell.page_index || 0
          })
        )
      );
      setBoundingBoxes(pushed);
    } else {
      setBoundingBoxes([]);
    }
  }, [highlightAll]);

  useEffect(() => {
    if (data?.data) {
      const extPriceColNum = data?.data?.processed_table?.columns?.findIndex(
        (col) => col.column_name == "Extended Price"
      );

      const totalExtendedPrice = data?.data?.processed_table?.rows?.reduce(
        (acc, row) => {
          const price = Number(row?.cells[extPriceColNum]?.text || 0);
          return acc + price;
        },
        0
      );

      setTotalExtendedPrice(totalExtendedPrice);
    }
  }, [reCalculateCWiseSum, history, setHistory, operations, data]);

  useEffect(() => {
    if (metaData?.document_metadata?.added_fees?.length == 0) {
      setMetaData({
        ...metaData,
        ["document_metadata"]: {
          ...metaData.document_metadata,
          added_fees: [0]
        }
      });
    }
    if (metaData?.document_metadata?.added_taxes?.length == 0) {
      setMetaData({
        ...metaData,
        ["document_metadata"]: {
          ...metaData.document_metadata,
          added_taxes: [0]
        }
      });
    }
    if (metaData?.document_metadata?.added_discounts?.length == 0) {
      setMetaData({
        ...metaData,
        ["document_metadata"]: {
          ...metaData.document_metadata,
          added_discounts: [0]
        }
      });
    }
  }, [metaData]);

  // Sums and Other Calculated Values

  let calculatedsum = (
    totalExtendedPrce +
    metaData?.document_metadata?.added_taxes?.reduce((acc, it, i) => {
      return (acc += Number(it));
    }, 0) +
    metaData?.document_metadata?.added_fees?.reduce((acc, it, i) => {
      return (acc += Number(it));
    }, 0) -
    metaData?.document_metadata?.added_discounts?.reduce((acc, it, i) => {
      return (acc += Number(it));
    }, 0)
  ).toFixed(2);

  let categoryColumnId =
    columns?.find((c) => c.column_name == "Category")?.column_uuid || null;
  const selectedColumnIds = columns
    ?.filter((f) => f?.selected_column)
    ?.map(
      ({ column_name, column_order, selected_column, ...rest }) =>
        rest?.column_uuid
    );

  // Table Operations
  const saveHistory = () => {
    setHistory([
      ...history,
      {
        tableData: JSON.parse(JSON.stringify(data)),
        operations: [...operations]
      }
    ]);
  };

  const handleEditCell = (rowIndex, cellIndex, initialValue) => {
    setEditMode({ rowIndex, cellIndex });
    setCellValue(initialValue);
    setStopHovering(false);
  };

  const handleKeyPress = (event, rowIndex, cellIndex) => {
    if (event.key === "Enter") {
      handleSaveCell(rowIndex, cellIndex);
    }
  };

  const undoLastAction = () => {
    if (history.length === 0) return;

    const { tableData: lastTableData, operations: lastOperations } =
      history.pop();
    const lastOperation = lastOperations[lastOperations.length - 1];
    if (lastOperation?.type === "delete_row") {
      const deletedRowUuid = lastOperation.data.transaction_uuid;
      const restoredRow = lastTableData.data.processed_table.rows.find(
        (row) => row.transaction_uuid === deletedRowUuid
      );

      const updatedRows = [
        ...lastTableData.data.processed_table.rows,
        restoredRow
      ];
      let copyData = JSON.parse(JSON.stringify(data));
      copyData.data.processed_table.rows = updatedRows;
      queryClient.setQueryData(["combined-table", document_uuid], copyData);
    } else {
      queryClient.setQueryData(
        ["combined-table", document_uuid],
        lastTableData
      );
    }

    setOperations(lastOperations);
    setHistory(history);
  };

  const addEmptyRow = () => {
    saveHistory();
    let copyData = JSON.parse(JSON.stringify(data));
    let { rows, columns } = copyData?.data?.processed_table;
    let newRow = {
      cells: data?.data?.processed_table?.columns.map((column) => ({
        column_uuid: column?.column_uuid,
        text: "",
        actual_text: null,
        confidence: null,
        page_index: 0,
        row_uuid: uuidv4(),
        cell_uuid: uuidv4(),
        selected_column: column.selected_column
      })),
      row_order:
        data?.data?.processed_table?.rows[
          data?.data?.processed_table?.rows.length - 1
        ]?.row_order + 1 || 1,
      transaction_uuid: uuidv4()
    };
    let operation = {
      type: "create_row",
      operation_order: operations?.length + 1,
      data: {
        transaction_uuid: newRow.transaction_uuid,
        row_order: newRow.row_order,
        cells: newRow.cells
      }
    };
    setOperations([...operations, operation]);
    rows.push(newRow);
    queryClient.setQueryData(["combined-table", document_uuid], copyData);
  };

  const deleteRow = (rowIndex) => {
    saveHistory();
    let copyData = JSON.parse(JSON.stringify(data));
    const updatedRows = [...copyData?.data?.processed_table?.rows];
    const deletedRow = updatedRows[rowIndex];
    updatedRows.splice(rowIndex, 1);
    const operation = {
      type: "delete_row",
      operation_order: operations.length + 1,
      data: {
        transaction_uuid: deletedRow.transaction_uuid
      }
    };
    setOperations([...operations, operation]);

    toast.success(`Row ${rowIndex + 1} deleted successfully.`);
    copyData.data.processed_table.rows = updatedRows;
    queryClient.setQueryData(["combined-table", document_uuid], copyData);
    setContextMenu({
      visible: false,
      position: { x: 0, y: 0 }
    });
  };

  const handleRowShifting = (rowIndex, shiftType) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    if (rowIndex == 0 && shiftType == "up") {
      return;
    } else if (
      rowIndex == copyObj?.data?.processed_table?.rows?.length - 1 &&
      shiftType == "down"
    ) {
      return;
    }
    saveHistory();

    let shiftToIndex = shiftType == "up" ? rowIndex - 1 : rowIndex + 1;
    let temp;
    let newOperation = {
      type: "swap_rows",
      operation_order: operations?.length + 1,
      data: {
        row_1_uuid:
          copyObj.data.processed_table.rows[rowIndex]?.transaction_uuid,
        row_2_uuid:
          copyObj.data.processed_table.rows[shiftToIndex]?.transaction_uuid
      }
    };

    setOperations([...operations, newOperation]);
    temp = copyObj.data.processed_table.rows[rowIndex];
    copyObj.data.processed_table.rows[rowIndex] =
      copyObj.data.processed_table.rows[shiftToIndex];
    copyObj.data.processed_table.rows[shiftToIndex] = temp;
    queryClient.setQueryData(["combined-table", document_uuid], copyObj);
  };

  const addEmptyColumn = () => {
    saveHistory();
    const newColumn = {
      column_uuid: uuidv4(),
      column_name: "Select an option",
      column_order:
        data?.data?.processed_table?.columns?.[
          data?.data?.processed_table?.columns?.length - 1
        ]?.column_order + 1 || 0,
      bounding_boxes: null,
      selected_column: true
    };

    const updatedColumns = [...data?.data?.processed_table?.columns, newColumn];
    const updatedRows = data?.data?.processed_table?.rows?.map((row) => ({
      ...row,
      cells: [
        ...row.cells,
        {
          column_uuid: newColumn.column_uuid,
          text: "",
          actual_text: null,
          confidence: null,
          page_index: 0,
          row_uuid: row.transaction_uuid,
          cell_uuid: uuidv4(),
          selected_column: true
        }
      ]
    }));

    let copyTable = JSON.parse(JSON.stringify(data));
    copyTable.data.processed_table.rows = updatedRows;
    copyTable.data.processed_table.columns = updatedColumns;

    const operation = {
      type: "create_column",
      operation_order: operations.length + 1,
      data: {
        column_uuid: newColumn.column_uuid,
        column_name: newColumn.column_name,
        selected_column: newColumn.selected_column,
        cells: updatedRows.reduce((acc, row) => {
          const filteredCells = row?.cells?.filter(
            (cell) => cell?.column_uuid == newColumn?.column_uuid
          );
          return acc.concat(filteredCells);
        }, [])
      }
    };

    setOperations([...operations, operation]);
    queryClient.setQueryData(["combined-table", document_uuid], copyTable);

    setContextMenu({
      visible: false,
      position: { x: 0, y: 0 }
    });
  };

  const copyRow = (rowIndex, copyType) => {
    // Prevent copying outside table bounds
    if (rowIndex < 0 || rowIndex >= data?.data?.processed_table?.rows?.length) {
      toast.error("Invalid row index.");
      return;
    }

    saveHistory();

    let copyData = JSON.parse(JSON.stringify(data));
    let { rows, columns } = copyData?.data?.processed_table;

    // Determine target index based on the copy type
    const targetIndex = copyType === "up" ? rowIndex : rowIndex + 1;

    // Create a new row based on the row to be copied
    const rowToCopy = rows[rowIndex];

    // Set the row_order for the new row based on its new position
    const newRow = {
      ...rowToCopy,
      row_order: rowToCopy?.row_order, // Set the row_order
      transaction_uuid: uuidv4(),
      cells: rowToCopy?.cells?.map((cell) => ({
        ...cell,
        row_uuid: uuidv4(),
        cell_uuid: uuidv4()
      }))
    };

    // Insert the new row at the desired position
    rows.splice(targetIndex, 0, newRow);

    // Record the operation(s)
    let operation = [
      {
        type: "create_row",
        operation_order: operations?.length + 1,
        data: {
          transaction_uuid: newRow.transaction_uuid,
          row_order: newRow.row_order,
          cells: newRow.cells
        }
      }
    ];

    // Add move_row operation if copyType is "up"
    if (copyType === "up") {
      operation.push({
        type: "move_row",
        operation_order: operations?.length + 2,
        data: {
          selected_row_uuid: newRow?.transaction_uuid,
          move_to_row_uuid: rowToCopy?.transaction_uuid
        }
      });
    }

    setOperations([...operations, ...operation]);

    // Update the query data
    queryClient.setQueryData(["combined-table", document_uuid], copyData);

    // Show a success toast
    toast.success(`Row copied ${copyType} successfully.`);

    // Hide the context menu
    setContextMenu({
      visible: false,
      position: { x: 0, y: 0 }
    });
  };

  const addRow = (rowIndex = -1) => {
    saveHistory();

    let copyData = JSON.parse(JSON.stringify(data));
    let { rows, columns } = copyData?.data?.processed_table;
    let clickedRow = rows[rowIndex];
    // Create a new empty row
    const newRow = {
      cells: columns.map((column) => ({
        column_uuid: column?.column_uuid,
        text: "",
        actual_text: null,
        confidence: null,
        page_index: 0,
        row_uuid: uuidv4(),
        cell_uuid: uuidv4(),
        selected_column: column.selected_column
      })),
      row_order: clickedRow ? clickedRow?.row_order - 1 : 1,
      transaction_uuid: uuidv4()
    };

    // If rowIndex is -1, add the row at the end; otherwise, insert it at the specified index
    const targetIndex = rowIndex === -1 ? rows.length : rowIndex;
    rows.splice(targetIndex, 0, newRow);

    // Update row orders after the new row insertion
    for (let i = targetIndex + 1; i < rows.length; i++) {
      rows[i].row_order += 1;
    }

    // Prepare the operations based on the row index
    let new_operations = [
      {
        type: "create_row",
        operation_order: operations.length + 1,
        data: {
          transaction_uuid: newRow.transaction_uuid,
          row_order: newRow.row_order,
          cells: newRow.cells
        }
      }
    ];

    if (rowIndex !== -1) {
      // If a row is inserted at a specific index, record the move operation
      const moveRowOperation = {
        type: "move_row",
        operation_order: operations.length + 2,
        data: {
          selected_row_uuid: newRow.transaction_uuid,
          move_to_row_uuid: rows[rowIndex]?.transaction_uuid
        }
      };

      new_operations.push(moveRowOperation);
    }

    // Add the operations to the history
    setOperations([...operations, ...new_operations]);

    // Update the query data with the new row
    queryClient.setQueryData(["combined-table", document_uuid], copyData);

    // Show a success toast
    toast.success(
      rowIndex === -1
        ? "Row added successfully at the end."
        : `Row added successfully at position ${rowIndex + 1}.`
    );

    // Hide the context menu
    setContextMenu({
      visible: false,
      position: { x: 0, y: 0 }
    });
  };

  const addNewCell = (rowIndex, column_uuid, cell_uuid) => {
    saveHistory();

    let copyData = JSON.parse(JSON.stringify(data));
    let { rows, columns } = copyData?.data?.processed_table;

    // Check if column exists
    if (!columns.some((col) => col.column_uuid === column_uuid)) {
      toast.error("Invalid column UUID.");
      return;
    }

    // Ensure lastRow and lastCell are properly captured
    const lastRow = rows[rows.length - 1] || null;
    const lastCell = lastRow?.cells.find(
      (cell) => cell.column_uuid === column_uuid
    );

    // Create a new row if necessary
    let newRowCreated = false;
    let newRow = null;

    let rowOperation;
    if (lastRow && lastCell) {
      newRow = {
        cells: columns.map((column) => ({
          column_uuid: column?.column_uuid,
          text: column_uuid === column.column_uuid ? lastCell.text : "",
          actual_text:
            column_uuid === column.column_uuid ? lastCell.actual_text : null,
          confidence: null,
          page_index: 0,
          row_uuid: uuidv4(),
          cell_uuid: uuidv4(),
          selected_column: column.selected_column
        })),
        row_order: (lastRow?.row_order || 0) + 1,
        transaction_uuid: uuidv4()
      };

      rows.push(newRow);
      newRowCreated = true;

      // Record the operation for the created row
      rowOperation = {
        type: "create_row",
        operation_order: operations?.length + 1,
        data: {
          transaction_uuid: newRow.transaction_uuid,
          row_order: newRow.row_order,
          cells: newRow.cells
        }
      };

      // Ensure create_row operation is added first
      let ops = JSON.parse(JSON.stringify(operations));
      setOperations([...ops, rowOperation]);
    }

    // Shift column cells downward starting from rowIndex
    for (let i = rows.length - 1; i > rowIndex; i--) {
      const currentCell = rows[i]?.cells.find(
        (cell) => cell.column_uuid === column_uuid
      );
      const previousCell = rows[i - 1]?.cells.find(
        (cell) => cell.column_uuid === column_uuid
      );

      if (currentCell && previousCell) {
        Object.assign(currentCell, {
          ...previousCell,
          cell_uuid: uuidv4() // Generate a new UUID for the shifted cell
        });
      }
    }

    // Clear the original cell at rowIndex
    const targetCell = rows[rowIndex]?.cells.find(
      (cell) => cell.column_uuid === column_uuid
    );
    if (targetCell) {
      Object.assign(targetCell, {
        text: "",
        actual_text: null,
        confidence: null,
        cell_uuid: uuidv4(),
        bounding_box: null // Reset any other properties if needed
      });
    }

    // Record the operation for creating a new cell
    const cellOperation = {
      type: "create_cell",
      operation_order: operations?.length + (newRowCreated ? 2 : 1),
      data: {
        current_column_uuid: column_uuid,
        current_cell_uuid: cell_uuid,
        current_row_uuid: rows[rowIndex]?.transaction_uuid,
        new_cell_uuid: targetCell?.cell_uuid
      }
    };
    const ops = JSON.parse(JSON.stringify(operations));
    // Ensure create_cell operation is added after the row operation
    setOperations([...ops, rowOperation, cellOperation]);

    // Update the query data
    queryClient.setQueryData(["combined-table", document_uuid], copyData);

    // Show a success message
    toast.success("Cell added successfully.");
  };

  const deleteCell = (rowIndex, column_uuid, cell_uuid) => {
    saveHistory(); // Save the current state for undo/redo functionality

    // Deep copy the table data to avoid mutations
    let copyData = JSON.parse(JSON.stringify(data));
    let { rows, columns } = copyData?.data?.processed_table;

    // Validate the existence of the row and column
    if (!rows[rowIndex]) {
      toast.error("Invalid row index.");
      return;
    }

    if (!columns.some((col) => col.column_uuid === column_uuid)) {
      toast.error("Invalid column UUID.");
      return;
    }

    // Identify the column's cells and start shifting data upwards
    for (let i = rowIndex; i < rows.length - 1; i++) {
      const currentCell = rows[i]?.cells.find(
        (cell) => cell.column_uuid === column_uuid
      );
      const nextCell = rows[i + 1]?.cells.find(
        (cell) => cell.column_uuid === column_uuid
      );

      if (currentCell && nextCell) {
        // Generate a new UUID for the shifted cell
        const newCellUuid = uuidv4();
        Object.assign(currentCell, {
          ...nextCell,
          cell_uuid: newCellUuid
        });
      }
    }

    // Handle the last cell in the column
    const lastRow = rows[rows.length - 1];
    const lastCell = lastRow?.cells.find(
      (cell) => cell.column_uuid === column_uuid
    );

    let newLastCellUuid = null;
    if (lastCell) {
      // Generate a new UUID for the last cell and reset it
      newLastCellUuid = uuidv4();
      Object.assign(lastCell, {
        text: "",
        actual_text: null,
        confidence: null,
        cell_uuid: newLastCellUuid, // Reset the last cell with a new UUID
        bounding_box: null // Reset any bounding box or additional properties
      });
    }

    // Record the delete operation for tracking
    let operation = {
      type: "delete_cell",
      operation_order: operations.length + 1,
      data: {
        current_cell_uuid: cell_uuid, // UUID of the cell being deleted
        current_column_uuid: column_uuid,
        current_row_uuid: rows[rowIndex]?.transaction_uuid,
        new_cell_uuid: newLastCellUuid // New UUID of the last cell
      }
    };

    // Update the operations and table data
    setOperations([...operations, operation]);
    queryClient.setQueryData(["combined-table", document_uuid], copyData);

    // Show success toast
    toast.success("Cell deleted and column shifted successfully.");

    // Hide the context menu (if applicable)
    setContextMenu({
      visible: false,
      position: { x: 0, y: 0 }
    });
  };

  const handleSaveCell = async (rowIndex, cellIndex, value) => {
    const originalValue =
      data.data.processed_table.rows[rowIndex].cells[cellIndex].text;

    if (value !== originalValue) {
      saveHistory();

      // Create a deep copy of the data object
      const updatedData = JSON.parse(JSON.stringify(data));

      // Update the cell value in both rows
      updatedData.data.processed_table.rows[rowIndex].cells[cellIndex].text =
        value;

      // Prepare the operation for the update
      const operation = {
        type: "update_cell",
        operation_order: operations.length + 1,
        data: {
          cell_uuid:
            updatedData.data.processed_table.rows[rowIndex].cells[cellIndex]
              .cell_uuid,
          row_uuid:
            updatedData.data.processed_table.rows[rowIndex].transaction_uuid,
          column_uuid:
            updatedData.data.processed_table.rows[rowIndex].cells[cellIndex]
              .column_uuid,
          text: value
        }
      };

      // Add column names if needed
      updatedData.data.processed_table.rows[rowIndex].cells.forEach((c, i) => {
        c["column_name"] = data.data.processed_table.columns[i]?.column_name;
      });

      setOperations([...operations, operation]);

      let extPriceCellColumnUUID =
        updatedData.data.processed_table.columns?.find(
          (col) => col?.column_name === "Extended Price"
        )?.["column_uuid"];

      // Copy operations for recalculation
      let copyOperations = JSON.parse(
        JSON.stringify([...operations, operation])
      );

      // If autoCalculate is enabled, trigger the mutate function
      if (autoCalculate) {
        mutate(
          {
            document_uuid,
            row: { ...updatedData.data.processed_table.rows[rowIndex] }
          },
          {
            onSuccess: (data) => {
              const extPriceCell = data?.data?.cells.find(
                (cell) => cell.column_uuid === extPriceCellColumnUUID
              );

              const newOperation = {
                type: "update_cell",
                operation_order: operations.length + 1,
                data: {
                  cell_uuid: extPriceCell?.cell_uuid,
                  row_uuid:
                    updatedData.data.processed_table.rows[rowIndex]
                      .transaction_uuid,
                  column_uuid: extPriceCellColumnUUID,
                  text: extPriceCell?.text
                }
              };

              // Add the new operation for the extended price
              setOperations([...copyOperations, newOperation]);
              updatedData.data.processed_table.rows[rowIndex] = data.data;

              setReCalculateCWiseSum(true); // Recalculate category-wise sum
              queryClient.setQueryData(
                ["combined-table", document_uuid],
                updatedData
              );
              setEditMode({ rowIndex: null, cellIndex: null });
              return;
            }
          }
        );
      }

      // Update query data for the combined table
      queryClient.setQueryData(["combined-table", document_uuid], updatedData);
    }

    // Exit edit mode after saving
    setEditMode({ rowIndex: null, cellIndex: null });
  };

  const addTax = () => {
    const newData = { ...metaData };
    newData["document_metadata"]["added_taxes"].push(0);
    setMetaData(newData);
  };

  const addDiscount = () => {
    const newData = { ...metaData };
    newData["document_metadata"]["added_discounts"].push(0);
    setMetaData(newData);
  };

  const addNewFeeAmt = () => {
    const newData = { ...metaData };
    newData["document_metadata"]["added_fees"].push(0);
    setMetaData(newData);
  };

  const removeDiscount = (index) => {
    const newData = { ...metaData };
    newData["document_metadata"]["added_discounts"].splice(index, 1);
    setMetaData(newData);
    setUpdatedFields((prevFields) => {
      return {
        ...prevFields,
        document_metadata: {
          ...prevFields.document_metadata,
          added_discounts: newData["document_metadata"]["added_discounts"]
        }
      };
    });
  };

  const removeTax = (index) => {
    const newData = { ...metaData };
    newData["document_metadata"]["added_taxes"].splice(index, 1);
    setMetaData(newData);
    setUpdatedFields((prevFields) => {
      return {
        ...prevFields,
        document_metadata: {
          ...prevFields.document_metadata,
          added_taxes: newData["document_metadata"]["added_taxes"]
        }
      };
    });
  };

  const removeFee = (index) => {
    const newData = { ...metaData };
    newData["document_metadata"]["added_fees"].splice(index, 1);
    setMetaData(newData);
    setUpdatedFields((prevFields) => {
      return {
        ...prevFields,
        document_metadata: {
          ...prevFields.document_metadata,
          added_fees: newData["document_metadata"]["added_fees"]
        }
      };
    });
  };

  return (
    <>
      {" "}
      <div
        className={`${
          metadata?.invoice_type !== "Summary Invoice" &&
          "max-h-[42rem]   overflow-hidden"
        } w-full mt-1 border border-[#F0F0F0] shadow-sm rounded-md `}
      >
        {metaData?.invoice_type !== "Summary Invoice" && (
          <div className="w-full flex items-center justify-between pr-[1rem] border-b border-[#E0E0E0]">
            <p className="font-poppins font-semibold  p-3 text-base leading-6">
              Items
            </p>
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-2">
                <p className=" font-poppins font-normal text-xs leading-4 text-[#000000]">
                  Highlight
                </p>
                <Switch
                  className="!bg-[#888888] data-[state=checked]:!bg-primary "
                  checked={stopHovering}
                  onCheckedChange={(v) => setStopHovering(v)}
                />
              </div>
              <div className="flex items-center gap-x-2">
                <p className=" font-poppins font-normal text-xs leading-4 text-[#000000]">
                  Highlight All
                </p>
                <Switch
                  className="!bg-[#888888] data-[state=checked]:!bg-primary "
                  checked={highlightAll}
                  onCheckedChange={(v) => setHighlightAll(v)}
                />
              </div>
              <div className="flex items-center gap-x-2">
                <p className=" font-poppins font-normal text-xs leading-4 text-[#000000]">
                  Auto Calculate
                </p>
                <Switch
                  className="!bg-[#888888] data-[state=checked]:!bg-primary "
                  checked={autoCalculate}
                  onCheckedChange={(v) => setAutoCalculate(v)}
                />
              </div>

              <CustomTooltip content={"Row Actions"}>
                <div className="!relative">
                  <div
                    className="border  rounded-sm h-8 w-8 flex justify-center items-center cursor-pointer "
                    onClick={() => setShowActionsPopup(!showActionsPopup)}
                  >
                    <img src={sort} alt="" className="h-[0.6rem]" />
                  </div>

                  {showActionsPopup && (
                    <div
                      onMouseLeave={() => setShowActionsPopup(false)}
                      style={{
                        boxShadow: "4px 4px 8px 0px rgba(0, 0, 0, 0.12)"
                      }}
                      className="absolute bg-white rounded-lg flex flex-col gap-y-1  p-2  !z-50 w-[12rem] right-0 top-8"
                    >
                      <p
                        onClick={() => {
                          setViewDeleteColumn(!viewDeleteColumn);
                        }}
                        className={`${
                          viewDeleteColumn && "bg-primary text-white"
                        } cursor-pointer px- py-1.5 font-poppins font-normal text-xs rounded-sm`}
                      >
                        View Row Delete Button
                      </p>
                      <p
                        onClick={() => {
                          setViewVerificationColumn(!viewVerificationColumn);
                        }}
                        className={`${
                          viewVerificationColumn && "bg-primary text-white"
                        } cursor-pointer px- py-1.5 font-poppins font-normal text-xs rounded-sm`}
                      >
                        View Verification Button
                      </p>
                      <p
                        onClick={() => {
                          setViewShiftColumn(!viewShiftColumn);
                        }}
                        className={`${
                          viewShiftColumn && "bg-primary text-white"
                        } cursor-pointer px- py-1.5 font-poppins font-normal text-xs rounded-sm`}
                      >
                        View Row Shift Button
                      </p>
                    </div>
                  )}
                </div>
              </CustomTooltip>
              <CustomTooltip content={"Add Empty Row"}>
                <Button
                  onClick={() => addEmptyRow()}
                  className="bg-transparent border border-primary hover:bg-transparent w-[3.5rem] h-[1.75rem] font-poppins text-primary space-x-1 font-normal rounded-sm text-xs leading-4"
                >
                  <span>+</span>
                  <span>R</span>
                </Button>
              </CustomTooltip>
              <CustomTooltip content={"Add New Column"}>
                <Button
                  onClick={() => addEmptyColumn()}
                  className="bg-transparent border border-primary hover:bg-transparent w-[3.5rem] h-[1.75rem] font-poppins text-primary space-x-1 font-normal rounded-sm text-xs leading-4"
                >
                  <span>+</span>
                  <span>C</span>
                </Button>
              </CustomTooltip>
              <CustomTooltip content={"Undo"}>
                <Button
                  disabled={operations?.length == 0}
                  className="bg-transparent border-none shadow-none hover:bg-transparent"
                >
                  <img
                    src={undo}
                    alt=""
                    className="h-[1.25rem] ml-1 cursor-pointer"
                    onClick={() => undoLastAction()}
                  />
                </Button>
              </CustomTooltip>
            </div>
          </div>
        )}
        {contextMenu?.visible && (
          <ContextMenu
            menuOptions={menuOptions}
            position={contextMenu.position}
            onClose={handleCloseMenu}
          />
        )}
        <div
          className={`flex items-center justify-between py-3 !text-[#121212] !font-poppins !font-semibold !text-base px-8 ${
            metaData?.document_metadata?.invoice_extracted_total ==
            calculatedsum
              ? "bg-green-100"
              : "bg-[#FFEEEF]"
          }`}
        >
          <p>Difference</p>
          <p>
            ${" "}
            {metaData?.document_metadata?.invoice_extracted_total ==
            calculatedsum
              ? 0
              : (
                  Number(metaData?.document_metadata?.invoice_extracted_total) -
                  Number(calculatedsum)
                ).toFixed(2)}
          </p>
        </div>

        {metaData?.invoice_type !== "Summary Invoice" && (
          <div className="pb-2  overflow-hidden w-full ">
            <Table className="w-full   overflow-auto  !min-h-[40rem] ">
              <TableBody
                className=""
                onMouseLeave={() => {
                  if (stopHovering) {
                    setBoundingBox({});
                    setHighlightRow(false);
                    setBoundingBoxes([]);
                  }
                }}
              >
                <div className=" flex gap-x-2  px-0.5 sticky top-0 bg-white/80 z-20">
                  {columns
                    ?.filter((c) => c.selected_column)
                    ?.map(
                      ({
                        column_uuid,
                        column_name,
                        column_order,
                        selected_column
                      }) => {
                        return (
                          <TableCell
                            className="!w-[10rem] !max-w-[12rem]     flex items-center "
                            key={column_uuid}
                          >
                            <CustomDropDown
                              Value={column_name}
                              className={"!w-[rem]"}
                              triggerClassName={
                                "!max-w-[10rem] !h-[2.25rem] !min-w-[9.5rem]  "
                              }
                              data={headerNamesFormatter(
                                additionalData?.data
                                  ?.processed_table_header_candidates
                              )}
                              onChange={(c, item) => {
                                handleDropdownChange(column_uuid, c);
                              }}
                            />
                          </TableCell>
                        );
                      }
                    )}
                  <div className="w-full sticky right-0  flex items-center justify-end">
                    {(viewDeleteColumn ||
                      viewShiftColumn ||
                      viewVerificationColumn) && (
                      <TableCell className=" !border-l  sticky w-[120px]   flex justify-center items-center font-poppins font-normal text-xs  !p-0 h-full bg-white/90 !z-30 !right-[0px]">
                        Actions
                      </TableCell>
                    )}
                  </div>
                </div>

                <div className=" flex flex-col gap-x-2   px-0.5 max-h-[30rem] ">
                  {rows?.map((row, index) => {
                    return (
                      <div className="flex !relative">
                        <TableRow
                          bordered
                          key={index}
                          className="flex w-full gap-x-2  mb-2 border-b !border-b-[#F5F5F5]     "
                        >
                          {row?.cells
                            ?.filter((c) =>
                              selectedColumnIds?.includes(c?.column_uuid)
                            )
                            ?.map((cell, i) => {
                              return (
                                <TableCell
                                  onClick={() =>
                                    handleEditCell(index, i, cell?.text)
                                  }
                                  onMouseEnter={(e) => {
                                    e.stopPropagation();
                                    if (stopHovering) {
                                      if (cell.bounding_box == null) {
                                        setHoveredRow(true);
                                      } else {
                                        setHoveredRow(false);
                                      }
                                      setBoundingBox({
                                        box: cell?.bounding_box,
                                        page_index: cell?.page_index
                                      });

                                      let pushed = [];

                                      row.cells?.map((cell) =>
                                        pushed.push({
                                          box: cell?.bounding_box,
                                          page_index:
                                            cell?.bounding_box?.page_index || 0
                                        })
                                      );

                                      setBoundingBoxes(pushed);
                                      setHighlightRow(true);
                                      setHighlightAll(false);
                                    }
                                  }}
                                  onContextMenu={(e) => {
                                    e.preventDefault();

                                    setContextMenu({
                                      visible: true,
                                      position: { x: e.pageX, y: e.pageY },
                                      rowIndex: index,
                                      cellIndex: i,
                                      column_uuid: cell?.column_uuid,
                                      cell_uuid: cell?.cell_uuid,
                                      row_uuid: row?.transaction_uuid
                                    });
                                  }}
                                  className="!w-[10rem] font-poppins  font-normal text-sm leading-4 text-[#121212] !max-w-[12rem]  justify-center !z-10   flex items-center  capitalize text-center pl-4"
                                  key={i}
                                >
                                  {editMode?.rowIndex === index &&
                                  editMode?.cellIndex == i ? (
                                    <>
                                      {cell?.column_uuid ===
                                      categoryColumnId ? (
                                        <div
                                          onMouseLeave={() =>
                                            setEditMode({
                                              rowIndex: -1,
                                              cellIndex: -1
                                            })
                                          }
                                        >
                                          <CustomDropDown
                                            Value={
                                              additionalData?.data?.category_choices?.find(
                                                (c) => c.name == cell?.text
                                              )?.category_id
                                            }
                                            data={categoryNamesFormatter(
                                              additionalData?.data
                                                ?.category_choices
                                            )}
                                            onChange={(v) => {
                                              setCellValue(v);
                                              handleSaveCell(
                                                index,
                                                i,
                                                additionalData?.data?.category_choices?.find(
                                                  (c) => c.category_id == v
                                                )?.name
                                              );
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <Textarea
                                          value={cellValue}
                                          onBlur={() =>
                                            handleSaveCell(index, i, cellValue)
                                          }
                                          onDoubleClick={(e) => {
                                            e.preventDefault();
                                          }}
                                          onKeyPress={(e) => {
                                            handleKeyPress(e, index, i);
                                          }}
                                          onChange={(e) => {
                                            setCellValue(e.target.value);
                                          }}
                                        />
                                      )}
                                    </>
                                  ) : (
                                    <>{cell?.text || "--"}</>
                                  )}
                                </TableCell>
                              );
                            })}
                        </TableRow>

                        {(viewDeleteColumn ||
                          viewShiftColumn ||
                          viewVerificationColumn) && (
                          <TableCell className="sticky min-w-[120px] border-l gap-x-4 flex justify-center items-center font-poppins font-normal text-xs leading-4 bg-white/90  right-0 !z-10">
                            {viewVerificationColumn &&
                              (row?.item_master?.human_verified ? (
                                <img
                                  src={approved}
                                  alt=""
                                  className="h-4 w-4 mt-[0.8px] cursor-pointer"
                                />
                              ) : row?.item_master?.human_verified == false ? (
                                <img
                                  src={unapproved}
                                  alt=""
                                  className="h-4 w-4 mt-[0.8px] cursor-pointer"
                                />
                              ) : (
                                <ExclamationTriangleIcon className="h-4 w-4 mt-[0.8px]  cursor-pointer" />
                              ))}
                            {viewDeleteColumn && (
                              <Trash2
                                className="h-4 w-4 text-[#1C1C1E] cursor-pointer"
                                onClick={() => deleteRow(index)}
                              />
                            )}
                            {viewShiftColumn && (
                              <div className="flex flex-col gap-y-1">
                                <CustomTooltip content={"Shift Row Up"}>
                                  <ArrowUpFromLine
                                    className="h-4 w-4 text-[#1C1C1E] cursor-pointer"
                                    onClick={() =>
                                      handleRowShifting(index, "up")
                                    }
                                  />
                                </CustomTooltip>
                                <CustomTooltip content={"Shift Row Down"}>
                                  <ArrowDownFromLine
                                    className="h-4 w-4 text-[#1C1C1E] cursor-pointer"
                                    onClick={() =>
                                      handleRowShifting(index, "down")
                                    }
                                  />
                                </CustomTooltip>
                              </div>
                            )}
                          </TableCell>
                        )}
                      </div>
                    );
                  })}
                </div>
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      {metaData?.invoice_type !== "Summary Invoice" && (
        <div className="mt-8 mb-4 justify-end flex items-center">
          <Button className=" !h-[2.4rem] rounded-sm bg-transparent hover:bg-transparent font-poppins  font-normal text-sm leading-4 shadow-none text-[#000000] border-[0.125rem] border-primary">
            Auto Categorize
          </Button>
        </div>
      )}
      {metaData?.invoice_type !== "Summary Invoice" ? (
        <>
          <div className="flex gap-x-2 items-center  justify-between px-3 mt-8 border-b pb-3 border-b-[#E0E0E0]">
            <div className="flex  items-center gap-x-2 ">
              <Button
                disabled={
                  Number(metaData?.document_metadata?.added_taxes?.at(-1)) === 0
                }
                onClick={addTax}
                className=" !h-[1.75rem] rounded-sm bg-transparent hover:bg-transparent font-poppins  font-normal text-xs leading-4 shadow-none flex gap-x-1 !text-[#348355] border-[0.1rem] border-primary"
              >
                <span>+</span>
                <span>Tax</span>
              </Button>
              <Button
                onClick={addNewFeeAmt}
                className=" !h-[1.75rem] rounded-sm bg-transparent hover:bg-transparent font-poppins  font-normal text-xs leading-4 shadow-none !text-[#348355] border-[0.1rem] border-primary"
                disabled={
                  Number(metaData?.document_metadata?.added_fees?.at(-1)) === 0
                }
              >
                <span>+</span> <span>Fees</span>
              </Button>
              <Button
                onClick={addDiscount}
                className=" !h-[1.75rem] rounded-sm bg-transparent hover:bg-transparent font-poppins  font-normal text-xs leading-4 shadow-none !text-[#348355] border-[0.1rem] border-primary"
                disabled={
                  Number(
                    metaData?.document_metadata?.added_discounts?.at(-1)
                  ) === 0
                }
              >
                <span>+</span> <span>Discount</span>
              </Button>
            </div>
            <div>
              <p className="text-[#121212] font-poppins  font-semibold text-sm leading-5 flex gap-x-2">
                <span className="flex gap-x-3 items-center">
                  <span>Sub Total</span> <span>:</span>{" "}
                </span>{" "}
                <span>$ {totalExtendedPrce}</span>
              </p>
            </div>
          </div>

          <div className="pl-4 pr-2  flex flex-col gap-y-4 my-4 border-b pb-4 border-b-[#E0E0E0]">
            <div className="flex justify-between items-center   h-full">
              <p className="font-poppins font-normal text-sm text-[#121212]">
                Taxes (+){" "}
              </p>

              <div className="flex flex-col gap-y-4 ">
                {metaData?.document_metadata?.added_taxes?.map((tax, index) => (
                  <div key={index} className=" flex  items-center gap-x-2  ">
                    <CustomInput
                      type="number"
                      max={100}
                      step="0.1"
                      value={tax}
                      className="w-[12rem] !text-xs border-[#E0E0E0] !rounded-md max-h-[2rem]"
                      onChange={(v) => {
                        // Update metadata only if the value is not empty
                        const newData = { ...metaData };
                        newData["document_metadata"]["added_taxes"][index] =
                          Number(v);

                        setMetaData(newData);

                        setUpdatedFields((prevFields) => {
                          return {
                            ...prevFields,
                            document_metadata: {
                              ...prevFields.document_metadata,
                              added_taxes:
                                newData["document_metadata"]["added_taxes"]
                            }
                          };
                        });
                      }}
                    />

                    <button
                      onClick={() => removeTax(index)}
                      disabled={index === 0}
                      className={`border-0 bg-transparent ${
                        index === 0 ? "hidden" : "flex"
                      }`}
                    >
                      <Trash2 className="text-[#F15156] h-4 w-4 " />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center   h-full">
              <p className="font-poppins font-normal text-sm text-[#121212]">
                Fees (+)
              </p>
              <div className="flex flex-col gap-y-4 ">
                {metaData?.document_metadata?.added_fees?.map((tax, index) => (
                  <div key={index} className=" flex  items-center gap-x-2  ">
                    <CustomInput
                      type="number"
                      max={100}
                      step="0.1"
                      value={tax}
                      className="w-[12rem] !text-xs border-[#E0E0E0] !rounded-md max-h-[2rem]"
                      onChange={(v) => {
                        // Update metadata only if the value is not empty
                        const newData = { ...metaData };
                        newData["document_metadata"]["added_fees"][index] =
                          Number(v);

                        setMetaData(newData);

                        setUpdatedFields((prevFields) => {
                          return {
                            ...prevFields,
                            document_metadata: {
                              ...prevFields.document_metadata,
                              added_fees:
                                newData["document_metadata"]["added_fees"]
                            }
                          };
                        });
                      }}
                    />

                    <button
                      onClick={() => removeFee(index)}
                      disabled={index === 0}
                      className={`border-0 bg-transparent ${
                        index === 0 ? "hidden" : "flex"
                      }`}
                    >
                      <Trash2 className="text-[#F15156] h-4 w-4 " />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center   h-full">
              <p className="font-poppins font-normal text-sm text-[#121212]">
                Discount (-)
              </p>
              <div className="flex flex-col gap-y-4 ">
                {metaData?.document_metadata?.added_discounts?.map(
                  (tax, index) => (
                    <div key={index} className=" flex  items-center gap-x-2  ">
                      <CustomInput
                        type="number"
                        max={100}
                        step="0.1"
                        value={tax}
                        className="w-[12rem] border-[#E0E0E0] !text-xs !rounded-md max-h-[2rem]"
                        onChange={(v) => {
                          // Update metadata only if the value is not empty
                          const newData = { ...metaData };
                          newData["document_metadata"]["added_discounts"][
                            index
                          ] = Number(v);

                          setMetaData(newData);

                          setUpdatedFields((prevFields) => {
                            return {
                              ...prevFields,
                              document_metadata: {
                                ...prevFields.document_metadata,
                                added_discounts:
                                  newData["document_metadata"][
                                    "added_discounts"
                                  ]
                              }
                            };
                          });
                        }}
                      />

                      <button
                        onClick={() => removeDiscount(index)}
                        disabled={index === 0}
                        className={`border-0 bg-transparent ${
                          index === 0 ? "hidden" : "flex"
                        }`}
                      >
                        <Trash2 className="text-[#F15156] h-4 w-4 " />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="my-4 flex items-center justify-between pl-4 font-poppins font-semibold text-sm text-[#121212] pr-4">
            <p>Total</p>
            <p
              className={` ${
                metaData?.document_metadata?.invoice_extracted_total ==
                calculatedsum
                  ? "text-primary fw-bolder border-success"
                  : "text-[#F15156]"
              }`}
            >
              $ {calculatedsum}
            </p>
          </div>
          <div
            className={`flex items-center justify-between pl-4 my-4 font-poppins font-normal text-sm text-[#121212] pr-2 `}
          >
            <p>Extracted Total</p>
            <CustomInput
              type="number"
              onChange={(v) => {
                const newData = { ...metaData };
                newData["document_metadata"]["invoice_extracted_total"] = v;
                setMetaData(newData);
                setUpdatedFields((prevFields) => {
                  return {
                    ...prevFields,
                    document_metadata: {
                      ...prevFields.document_metadata,
                      invoice_extracted_total: v
                    }
                  };
                });
                let copyObj = JSON.parse(JSON.stringify(metadata));
                if (copyObj?.data[0]) {
                  copyObj["data"][0].document_metadata.invoice_extracted_total =
                    v;
                } else {
                  copyObj["data"].document_metadata.invoice_extracted_total = v;
                }
                queryClient.setQueryData(
                  ["document-metadata", payload],
                  copyObj
                );
              }}
              className="max-w-[12rem] !max-h-[2rem] !rounded-md !text-xs"
              value={metaData?.document_metadata?.invoice_extracted_total}
            />
          </div>
          {metaData?.invoice_type !== "Summary Invoice" && (
            <div
              className={`flex items-center justify-between py-3 !text-[#121212] !font-poppins  my-4 !font-semibold !text-base px-4 ${
                metaData?.document_metadata?.invoice_extracted_total ==
                calculatedsum
                  ? "bg-green-100"
                  : "bg-[#FFEEEF]"
              }`}
            >
              <p>Difference</p>
              <p>
                ${" "}
                {metaData?.document_metadata?.invoice_extracted_total ==
                calculatedsum
                  ? 0
                  : (
                      Number(
                        metaData?.document_metadata?.invoice_extracted_total
                      ) - Number(calculatedsum)
                    ).toFixed(2)}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div
            className={`${
              metaData?.invoice_type == "Summary Invoice"
                ? "py-4 mx-2 my-4 rounded-xl border-[#D9D9D9]"
                : "my-4"
            } flex items-center justify-between pl-4 font-poppins font-normal text-sm text-[#121212] pr-2 border`}
          >
            <p>Extracted Total</p>
            <CustomInput
              type="number"
              onChange={(v) => {
                const newData = { ...metaData };
                newData["document_metadata"]["invoice_extracted_total"] = v;
                setMetaData(newData);
                setUpdatedFields((prevFields) => {
                  return {
                    ...prevFields,
                    document_metadata: {
                      ...prevFields.document_metadata,
                      invoice_extracted_total: v
                    }
                  };
                });
                let copyObj = JSON.parse(JSON.stringify(metadata));
                if (copyObj?.data[0]) {
                  copyObj["data"][0].document_metadata.invoice_extracted_total =
                    v;
                } else {
                  copyObj["data"].document_metadata.invoice_extracted_total = v;
                }
                queryClient.setQueryData(
                  ["document-metadata", payload],
                  copyObj
                );
              }}
              className="max-w-[12rem] !max-h-[2rem] !rounded-md !text-xs"
              value={metaData?.document_metadata?.invoice_extracted_total}
            />
          </div>
        </>
      )}
    </>
  );
};

export default HumanVerificationTable;