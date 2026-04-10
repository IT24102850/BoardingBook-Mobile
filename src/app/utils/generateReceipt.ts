import jsPDF from 'jspdf';

interface ReceiptData {
  tenantName: string;
  roomNumber: string;
  placeName: string;
  amount: number;
  date: string;
  receiptNumber: string;
  paymentMethod: string;
}

export function generatePaymentReceiptPDF(data: ReceiptData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header
  doc.setFontSize(20);
  doc.text('PAYMENT RECEIPT', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.text(data.placeName, pageWidth / 2, 28, { align: 'center' });

  // Receipt details
  doc.setFontSize(9);
  let yPosition = 40;
  doc.text(`Receipt #: ${data.receiptNumber}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Tenant: ${data.tenantName}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Room: ${data.roomNumber}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Date: ${data.date}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Payment Method: ${data.paymentMethod}`, 20, yPosition);

  // Amount box
  yPosition += 15;
  doc.setDrawColor(0, 150, 200);
  doc.rect(20, yPosition, pageWidth - 40, 20);
  doc.setFontSize(12);
  doc.setFont('', 'bold');
  doc.text(`Amount: Rs. ${data.amount.toLocaleString()}`, pageWidth / 2, yPosition + 10, { align: 'center' });

  // Footer
  doc.setFontSize(8);
  doc.text('Thank you for your payment', pageWidth / 2, pageHeight - 10, { align: 'center' });

  return doc;
}