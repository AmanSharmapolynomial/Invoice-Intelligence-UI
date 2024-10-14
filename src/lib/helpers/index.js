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
    data?.forEach(({ restaurant_id, restaurant_name }) => {
      if (restaurant_name === "") {
        formatted.push({
          label: restaurant_id,
          value: restaurant_id
        });
      } else {
        formatted.push({
          label: restaurant_name,
          value: restaurant_id
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
    data?.forEach(({ vendor_name, vendor_id, human_verified }) => {
      returnArray.push({
        label: vendor_name,
        value: vendor_id,
        human_verified: human_verified
      });
    });
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
    ?.map((word) => word[0].toUpperCase() + word.slice(1, word.length))
    .join(" ");
};
