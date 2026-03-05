const PDFDocument = require('pdfkit');

/**
 * Service to generate an invoice PDF
 * @param {Object} booking - Fully populated Booking object 
 * @param {Object} payment - Payment object
 * @returns {Promise<Buffer>} - Resolves with the PDF Buffer
 */
const generateInvoicePDF = (booking, payment) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            // Collect data chunks into array
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.on('error', (err) => reject(err));

            // --- PDF Drawing ---

            // Header
            doc.fontSize(25).text('Smart Hotel System', { align: 'center' });
            doc.moveDown();
            doc.fontSize(20).text('INVOICE', { align: 'center', underline: true });
            doc.moveDown(2);

            // Customer Info
            doc.fontSize(12).text(`Customer Name: ${booking.customerId.firstName} ${booking.customerId.lastName}`);
            doc.text(`Email: ${booking.customerId.email}`);
            doc.moveDown();

            // Booking Details
            doc.fontSize(14).text('Booking Details', { underline: true });
            doc.fontSize(12).text(`Room Number: ${booking.roomId.roomNumber} (${booking.roomId.type})`);
            doc.text(`Check-In: ${new Date(booking.checkInDate).toLocaleDateString()}`);
            doc.text(`Check-Out: ${new Date(booking.checkOutDate).toLocaleDateString()}`);
            doc.moveDown();

            // Payment Details
            doc.fontSize(14).text('Payment Summary', { underline: true });
            doc.fontSize(12).text(`Transaction ID: ${payment.transactionId}`);
            doc.text(`Payment Method: ${payment.method}`);
            doc.text(`Payment Status: ${payment.status}`);
            doc.moveDown();

            // Total
            doc.fontSize(16).text(`Total Amount: $${booking.totalAmount.toFixed(2)}`, { align: 'right', bold: true });

            // Footer
            doc.moveDown(4);
            doc.fontSize(10).text('Thank you for choosing Smart Hotel System. We hope you enjoy your stay!', { align: 'center' });

            // Finalize the PDF
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    generateInvoicePDF
};
