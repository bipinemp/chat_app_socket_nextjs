export default function FormatDate(date: string) {
  const newDate = new Date(date);
  const formattedDate = newDate.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  });

  return formattedDate;
}
