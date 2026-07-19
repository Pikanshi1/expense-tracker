import { saveAs } from "file-saver";

export const exportToCSV = (expenses) => {
  if (!expenses.length) return;

  const headers = [
    "Title",
    "Amount",
    "Type",
    "Category",
    "Date",
  ];

  const rows = expenses.map((expense) => [
    expense.title,
    expense.amount,
    expense.type,
    expense.category,
    new Date(expense.date).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "expenses.csv");
};