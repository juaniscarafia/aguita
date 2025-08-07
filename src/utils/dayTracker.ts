export const isNewDay = (): boolean => {
  const lastDate = localStorage.getItem("last-used-date");
  const today = new Date().toDateString();

  if (lastDate !== today) {
    localStorage.setItem("last-used-date", today);
    return true;
  }

  return false;
};