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

export const formatRestaurantsList = (data) => {
  let formatted = [];
  data &&
    data?.forEach(({ restaurant_id, restaurant_name }) => {
      formatted.push({
        label: restaurant_name,
        value: restaurant_id
      });
    });
  formatted.push({ label: "None", value: "none" });

  return formatted;
};

export const getValueFromLabel = (data, Value) => {
  let returnLabel = "";
  data &&
    data?.forEach(({ label, value }) => {
      if (value == Value) {
        returnLabel = value;
      }
    });
    return returnLabel;
};
