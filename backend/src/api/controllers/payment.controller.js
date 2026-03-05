const paymentService = require('../../core/services/payment.service');

/**
 * Controller to trigger payment simulation
 */
const createPayment = async (req, res, next) => {
    try {
        const customerId = req.user._id;

        const payment = await paymentService.simulatePayment(req.body, customerId);

        // If service didn't throw an error, payment simulation was successful
        res.status(201).json({
            status: 'success',
            message: 'Payment processed successfully.',
            data: { payment }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to download generated PDF invoice
 */
const getInvoice = async (req, res, next) => {
    try {
        const customerId = req.user._id;
        const { bookingId } = req.params;

        // Service returns raw PDF Buffer data
        const pdfBuffer = await paymentService.getInvoiceForBooking(bookingId, customerId);

        // 1. Set Headings so browser knows it's a downloading PDF file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Invoice_${bookingId}.pdf`
        );

        // 2. Transmit raw Buffer
        res.status(200).send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPayment,
    getInvoice
};
