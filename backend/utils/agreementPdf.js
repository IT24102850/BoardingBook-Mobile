const BASE64_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const encodeBase64 = (input) => {
  let output = '';
  let index = 0;

  while (index < input.length) {
    const byte1 = input.charCodeAt(index++) & 0xff;
    const byte2 = index < input.length ? input.charCodeAt(index++) & 0xff : NaN;
    const byte3 = index < input.length ? input.charCodeAt(index++) & 0xff : NaN;

    const enc1 = byte1 >> 2;
    const enc2 = ((byte1 & 3) << 4) | ((Number.isNaN(byte2) ? 0 : byte2) >> 4);
    const enc3 = Number.isNaN(byte2) ? 64 : (((byte2) & 15) << 2) | ((Number.isNaN(byte3) ? 0 : byte3) >> 6);
    const enc4 = Number.isNaN(byte3) ? 64 : byte3 & 63;

    output += BASE64_TABLE.charAt(enc1);
    output += BASE64_TABLE.charAt(enc2);
    output += enc3 === 64 ? '=' : BASE64_TABLE.charAt(enc3);
    output += enc4 === 64 ? '=' : BASE64_TABLE.charAt(enc4);
  }

  return output;
};

const escapePdfText = (value) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const buildPdf = (lines) => {
  const safeLines = lines.map((line) => escapePdfText(line));
  let textSection = 'BT\n/F1 12 Tf\n50 790 Td\n';

  safeLines.forEach((line, index) => {
    if (index === 0) {
      textSection += `(${line}) Tj\n`;
    } else {
      textSection += `0 -16 Td\n(${line}) Tj\n`;
    }
  });

  textSection += 'ET\n';

  const streamObject = `4 0 obj\n<< /Length ${textSection.length} >>\nstream\n${textSection}endstream\nendobj\n`;

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    streamObject,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [];

  objects.forEach((objectContent) => {
    offsets.push(pdf.length);
    pdf += objectContent;
  });

  const xrefPosition = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.forEach((offset) => {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF`;

  return pdf;
};

const generateAgreementPdfDataUri = (booking) => {
  const signatures = booking.agreement?.studentSignatures || {};
  const signatureLines = booking.studentNames.map((name) => {
    const signedAt = signatures[name];
    return `${name}: ${signedAt ? `Signed at ${signedAt}` : 'Pending'}`;
  });

  const lines = [
    'BoardingBook Rental Agreement',
    `Agreement ID: ${booking.agreement?.agreementId || 'N/A'}`,
    `Booking ID: ${booking.id}`,
    `Booking type: ${booking.bookingType}`,
    `Requester: ${booking.requesterName}`,
    `Students: ${booking.studentNames.join(', ')}`,
    `Room details: ${booking.roomDetails}`,
    `Rent: Rs. ${Number(booking.monthlyRent).toLocaleString()} / month`,
    `Period: ${booking.periodStart} to ${booking.periodEnd}`,
    'Student signatures:',
    ...signatureLines,
    `Owner confirmation: ${booking.agreement?.ownerConfirmedAt || 'Pending'}`,
  ];

  const pdf = buildPdf(lines);
  const base64Pdf = encodeBase64(pdf);
  return `data:application/pdf;base64,${base64Pdf}`;
};

module.exports = {
  generateAgreementPdfDataUri,
};
