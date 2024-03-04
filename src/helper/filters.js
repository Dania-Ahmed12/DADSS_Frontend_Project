export const extractUniqueValues = (data, attribute) => {
  if (data) {
    return [...new Set(data.map((item) => item[attribute]))].map(
      (value) => ({
        text: value,
        value: value,
      })
    );
  }
  else {
    return [];
  }
};
