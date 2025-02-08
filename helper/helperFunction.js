exports.isToday = (date) => {
  let newDate = new Date(date);
  const today = new Date();

  // Compare year, month, and day
  return (
    newDate.getDate() === today.getDate() &&
    newDate.getMonth() === today.getMonth() &&
    newDate.getFullYear() === today.getFullYear()
  );
};
