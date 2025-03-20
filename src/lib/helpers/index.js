export const formatData = (data) => {
  let formatted = [];
  data &&
    data?.forEach(({ id, username }) => {
      formatted.push({
        label: username,
        value: id
      });
    });
  formatted.push({ label: "None", value: "none" });

  return formatted;
};

export const getUserNameFromId = (users, ID) => {
  return users.find(({ id }) => id == ID)?.username ?? "Verified By";
};

export const formatRestaurantsList = (data = []) => {
  let formatted = [];
  data &&
    data?.forEach(({ restaurant_id, restaurant_name,tier }) => {
      if (restaurant_name === "") {
        formatted.push({
          label: restaurant_id,
          value: restaurant_id,
          tier:tier
        });
      } else {
        formatted.push({
          label: restaurant_name,
          value: restaurant_id,
          tier:tier
        });
      }
    });
  formatted.push({ label: "None", value: "none" });

  return formatted;
};

export const getValueFromLabel = (data = [], Value = "") => {
  let returnLabel = "";
  data &&
    data?.forEach(({ label, value }) => {
      if (value == Value) {
        returnLabel = value;
      }
    });
  return returnLabel;
};

export const vendorNamesFormatter = (data = []) => {
  let returnArray = [];

  data?.length > 0 &&
    data?.forEach(
      ({ vendor_name, vendor_id, human_verified, archive_status }) => {
        returnArray.push({
          label: vendor_name,
          value: vendor_id,
          human_verified: human_verified,
          archived_status: archive_status
        });
      }
    );
  returnArray.push({
    label: "None",
    value: "none"
  });
  return returnArray;
};

export const makeKeyValueFromKey = (data = [], toLower = false) => {
  let returnArray = [];

  data?.forEach((item) => {
    returnArray.push({
      label: item,
      value: toLower ? item.toLowerCase() : item
    });
  });
  returnArray.push({
    label: "None",
    value: null
  });
  return returnArray;
};

export const formatCombineVendorsArray = (data = []) => {
  let toReturn = [];
  data?.length > 0 &&
    data?.forEach(({ vendor, matching_score, documents_count }) => {
      toReturn.push({
        vendor_id: vendor["vendor_id"],
        vendor_name: vendor["vendor_name"],
        human_verified: vendor["human_verified"],
        matching_score,
        documents_count
      });
    });

  return toReturn;
};

export const keysCapitalizer = (str) => {
  return str
    .split("_")
    ?.map((word) => word[0]?.toUpperCase() + word?.slice(1, word.length))
    .join(" ");
};

export function formatRawDataTable(rawTable) {
  const columns = [];

  // Get the number of columns by finding the length of the first row
  const numColumns = rawTable && Object?.keys(rawTable?.[0]).length;

  // Initialize each column array
  for (let i = 0; i < numColumns; i++) {
    columns.push([]);
  }

  // Iterate through each row
  for (const key in rawTable) {
    for (let col = 0; col < numColumns; col++) {
      // Push the text value into the corresponding column array
      const cell = rawTable[key][col];
      columns[col].push(cell ? cell.text : null);
    }
  }

  // Check for duplicates in columns
  const uniqueColumns = Array.from(new Set(columns.map(JSON.stringify))).map(
    JSON.parse
  );

  return uniqueColumns;
}

export const findVendorNameById = (data, id) => {
  return data?.find((it) => it?.vendor_id == id)?.["vendor_name"];
};

export const findVendorIdByVendorName = (data, name) => {
  return data?.find(
    (it) =>
      it?.vendor_name?.toLowerCase()?.trim() == name?.toLowerCase()?.trim()
  )?.["vendor_id"];
};

export function formatDateToReadable(dateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  if (!dateString) {
    return;
  }

  const [year, month, day] = dateString?.split("-");
  const monthName = months[parseInt(month, 10) - 1];

  return `${monthName.slice(0, 3)} ${parseInt(day, 10)}, ${year}`;
}

export function formatDateTime(timestamp) {
  const date = new Date(timestamp);

  // Format the date part
  const options = { year: "numeric", month: "long", day: "numeric" };
  const datePart = date.toLocaleDateString("en-US", options);

  // Format the time part
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const timePart = `${hours}:${minutes}:${seconds}`;

  return `${datePart?.split(",")?.join("")}  ${timePart}`;
}

export function formatDateTimeToReadable(dateTimeString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  if (!dateTimeString) {
    return;
  }

  const date = new Date(dateTimeString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const year = date.getFullYear();
  const monthName = months[date.getMonth()];
  const day = date.getDate();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const amPm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  return `${monthName.slice(0, 3)} ${day}, ${year} ${hours}:${minutes} ${amPm}`;
}

export function calculateTimeDifference(dueDate) {
  const now = new Date();
  const timeDiff = dueDate - now;

  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (timeDiff <= 0) {
    return `Due  ${hours}h ${minutes}m ago`;
  }
  return `${hours}h ${minutes}m`;
}

export const headerNamesFormatter = (header_names) => {
  return header_names?.map(
    ({ is_required_for_item_master, is_default_in_item_master, ...rest }) => {
      let pair = {
        label: rest?.column_name,
        value: rest?.column_name
      };
      return pair;
    }
  );
};

export const categoryNamesFormatter = (categories) => {
  if(!categories){
    return []
  }
  return categories?.map((c) => {
    let obj = {
      label: c?.name,
      value: c?.category_id
    };
    return obj;
  });
};

export const columnsSorter = (columns) => {
  let columns_order = [
    "category",
    "item_code",
    "item_description",
    "quantity",
    "unit_of_measure",
    "pack",
    "size",
    "upc",
    "brand",
    "vintage",
    "origin",
    "extended_price"
  ];

  return columns?.sort((a, b) => {
    return columns_order.indexOf(a) - columns_order.indexOf(b);
  });
};

