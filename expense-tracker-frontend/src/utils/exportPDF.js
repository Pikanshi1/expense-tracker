import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = (expenses) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Expense Report", 14, 20);

  const tableColumn = [
    "Title",
    "Amount",
    "Type",
    "Category",
    "Date",
  ];

  const tableRows = expenses.map((expense) => [
    expense.title,
    expense.amount,
    expense.type,
    expense.category,
    new Date(expense.date).toLocaleDateString(),
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
  });

  doc.save("expenses.pdf");
};