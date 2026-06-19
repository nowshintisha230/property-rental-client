// src/lib/pdf.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
}

// Generate Booking Summary PDF for Tenant
export async function generateBookingSummaryPDF(booking) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Header gradient simulation — blue rectangle
  doc.setFillColor(59, 130, 246); // blue-500
  doc.rect(0, 0, pageWidth, 40, "F");

  // Logo / Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("RentEasy", margin, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Booking Confirmation", margin, 30);

  // Booking ID top right
  doc.setFontSize(9);
  doc.text(
    `Booking ID: ${booking._id?.slice(-8).toUpperCase() || "N/A"}`,
    pageWidth - margin,
    20,
    { align: "right" }
  );
  doc.text(
    `Date: ${formatDate(booking.createdAt)}`,
    pageWidth - margin,
    28,
    { align: "right" }
  );

  // Reset color
  doc.setTextColor(31, 41, 55); // gray-800

  // Section: Property Information
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Property Information", margin, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const propertyTitle =
    booking.propertySnapshot?.title ||
    booking.propertyId?.title ||
    "N/A";
  const propertyLocation =
    booking.propertySnapshot?.location ||
    booking.propertyId?.location ||
    "N/A";
  const propertyType =
    booking.propertySnapshot?.propertyType ||
    booking.propertyId?.propertyType ||
    "N/A";

  autoTable(doc, {
    startY: 60,
    margin: { left: margin, right: margin },
    head: [],
    body: [
      ["Property Title", propertyTitle],
      ["Location", propertyLocation],
      ["Property Type", propertyType],
      ["Rent Amount", formatCurrency(booking.amount)],
    ],
    theme: "striped",
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        fillColor: [239, 246, 255],
        textColor: [30, 64, 175],
        cellWidth: 60,
      },
      1: {
        textColor: [31, 41, 55],
      },
    },
  });

  // Section: Booking Details
  const afterPropertyTable = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Booking Details", margin, afterPropertyTable);

  autoTable(doc, {
    startY: afterPropertyTable + 5,
    margin: { left: margin, right: margin },
    head: [],
    body: [
      ["Move-in Date", formatDate(booking.moveInDate)],
      ["Contact Number", booking.contactNumber || "N/A"],
      ["Booking Status", booking.status?.toUpperCase() || "N/A"],
      ["Payment Status", booking.paymentStatus?.toUpperCase() || "N/A"],
      [
        "Additional Notes",
        booking.additionalNotes || "No additional notes",
      ],
    ],
    theme: "striped",
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        fillColor: [239, 246, 255],
        textColor: [30, 64, 175],
        cellWidth: 60,
      },
    },
  });

  // Section: Tenant Information
  const afterBookingTable = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Tenant Information", margin, afterBookingTable);

  const tenantName =
    booking.tenantSnapshot?.name || booking.tenantId?.name || "N/A";
  const tenantEmail =
    booking.tenantSnapshot?.email || booking.tenantId?.email || "N/A";

  autoTable(doc, {
    startY: afterBookingTable + 5,
    margin: { left: margin, right: margin },
    head: [],
    body: [
      ["Tenant Name", tenantName],
      ["Email", tenantEmail],
    ],
    theme: "striped",
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        fillColor: [239, 246, 255],
        textColor: [30, 64, 175],
        cellWidth: 60,
      },
    },
  });

  // Owner info
  const afterTenantTable = doc.lastAutoTable.finalY + 10;
  const ownerName =
    booking.ownerSnapshot?.name || booking.ownerId?.name || "N/A";
  const ownerEmail =
    booking.ownerSnapshot?.email || booking.ownerId?.email || "N/A";

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Owner Information", margin, afterTenantTable);

  autoTable(doc, {
    startY: afterTenantTable + 5,
    margin: { left: margin, right: margin },
    head: [],
    body: [
      ["Owner Name", ownerName],
      ["Owner Email", ownerEmail],
    ],
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: {
        fontStyle: "bold",
        fillColor: [239, 246, 255],
        textColor: [30, 64, 175],
        cellWidth: 60,
      },
    },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, pageHeight - 25, pageWidth, 25, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text(
    "This is an auto-generated booking confirmation from RentEasy.",
    pageWidth / 2,
    pageHeight - 14,
    { align: "center" }
  );
  doc.text(
    `Generated on ${new Date().toLocaleString()}`,
    pageWidth / 2,
    pageHeight - 7,
    { align: "center" }
  );

  doc.save(`booking-${booking._id?.slice(-8) || "summary"}.pdf`);
}

// Generate Earnings PDF for Owner
export async function generateEarningsPDF(transactions, ownerName, period) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Header
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 45, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("RentEasy", margin, 18);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Earnings Report", margin, 28);
  doc.text(`Owner: ${ownerName}`, margin, 37);

  doc.text(
    `Period: ${period || "All Time"}`,
    pageWidth - margin,
    22,
    { align: "right" }
  );
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    pageWidth - margin,
    30,
    { align: "right" }
  );

  // Total earnings summary
  const totalEarnings = transactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Total Earnings", margin, 60);

  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246);
  doc.text(formatCurrency(totalEarnings), margin, 73);

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `from ${transactions.length} transaction${transactions.length !== 1 ? "s" : ""}`,
    margin,
    82
  );

  // Transactions table
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Transaction History", margin, 97);

  autoTable(doc, {
    startY: 102,
    margin: { left: margin, right: margin },
    head: [
      ["Transaction ID", "Property", "Tenant", "Amount", "Date"],
    ],
    body: transactions.map((t) => [
      t.transactionId || t._id?.slice(-8).toUpperCase() || "N/A",
      t.propertySnapshot?.title || t.propertyId?.title || "N/A",
      t.tenantSnapshot?.name || t.tenantId?.name || "N/A",
      formatCurrency(t.amount),
      formatDate(t.createdAt),
    ]),
    theme: "striped",
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [239, 246, 255] },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, pageHeight - 22, pageWidth, 22, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text(
    "Confidential — RentEasy Earnings Report",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );

  doc.save(`earnings-report-${new Date().toISOString().split("T")[0]}.pdf`);
}