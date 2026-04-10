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

export const generatePaymentReceiptPDF = (data: ReceiptData) => {
    const doc = new jsPDF();

    // Colors & Styling
    const primaryColor = '#06b6d4'; // Cyan-500
    const secondaryColor = '#64748b'; // Slate-500
    const textColor = '#0f172a'; // Slate-900

    // Background / Header bar
    doc.setFillColor(6, 182, 212); // Cyan headers
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('PAYMENT RECEIPT', 14, 28);

    // System Name (right side)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('BoardingBook', 160, 28);

    // Content Area
    doc.setTextColor(textColor);

    // Receipt meta (Date, Receipt No)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 130, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString(), 160, 60);

    doc.setFont('helvetica', 'bold');
    doc.text('Receipt No:', 130, 68);
    doc.setFont('helvetica', 'normal');
    doc.text(data.receiptNumber, 160, 68);

    // Receipt details section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('Payment Details', 14, 90);

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 93, 196, 93);

    // Details Items
    doc.setTextColor(textColor);
    const startY = 105;
    const lineGap = 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Received From (Tenant):', 14, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(data.tenantName, 75, startY);

    doc.setFont('helvetica', 'bold');
    doc.text('Boarding Place:', 14, startY + lineGap);
    doc.setFont('helvetica', 'normal');
    doc.text(data.placeName, 75, startY + lineGap);

    doc.setFont('helvetica', 'bold');
    doc.text('Room Number:', 14, startY + lineGap * 2);
    doc.setFont('helvetica', 'normal');
    doc.text(data.roomNumber, 75, startY + lineGap * 2);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment For Month:', 14, startY + lineGap * 3);
    doc.setFont('helvetica', 'normal');
    doc.text(data.date, 75, startY + lineGap * 3);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment Method:', 14, startY + lineGap * 4);
    doc.setFont('helvetica', 'normal');
    doc.text(data.paymentMethod, 75, startY + lineGap * 4);

    // Amount Total Section
    doc.setFillColor(248, 250, 252); // Slate-50 background
    doc.rect(14, 160, 182, 30, 'F');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount Paid:', 20, 178);

    doc.setTextColor(primaryColor);
    doc.text(`Rs. ${data.amount.toLocaleString()}`, 140, 178);

    // Footer / Status
    const statusY = 205;

    // Status Badge Background
    doc.setFillColor(34, 197, 94); // Green-500
    doc.roundedRect(14, statusY, 130, 16, 3, 3, 'F');

    // Status Badge Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT SUCCESSFUL - AUTHORIZED', 20, statusY + 11);

    // Decorative Line
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setLineWidth(1);
    doc.line(14, 250, 196, 250);

    // Footer Text
    doc.setTextColor(secondaryColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a system-generated receipt. No signature is required.', 14, 260);
    doc.text('Thank you for choosing BoardingBook.', 14, 265);

    return doc;
};
