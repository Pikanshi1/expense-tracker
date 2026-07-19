import * as XLSX from "xlsx";

export const exportToExcel = (expenses) => {
  const data = expenses.map((expense) => ({
    Title: expense.title,
    Amount: expense.amount,
    Type: expense.type,
    Category: expense.category,
    Date: new Date(expense.date).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Expenses"
  );

  XLSX.writeFile(workbook, "expenses.xlsx");
};