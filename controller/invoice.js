const moment = require("moment");
const { isToday } = require("../helper/helperFunction");
const { createPayment, sendEmail, sendSms } = require("../helper/payment");
const Invoice = require("../model/invoice");

exports.createInvoice = async (req, res, next) => {
    try {
        const { amount, country_code, mobile_no, name, remark, sendAtSMS, sendAtWhatsapp, sendAtMail, saveAsDraft, email, draftId, type, invoice_start_date, repeat_every, frequencyUnit } = req.body;
        let user_id = req?.user?._id
        let newInvoice;
        if (draftId) {
            newInvoice = await Invoice.findOneAndUpdate({ _id: draftId,user_id }, { $set: { amount, mobile_no, name, remark, email, country_code, type, isDraft: saveAsDraft, invoice_start_date, repeat_every, frequencyUnit } });
        }
        else {
            newInvoice = new Invoice({
                amount, mobile_no, name, remark, email, country_code, type, isDraft: saveAsDraft, invoice_start_date, repeat_every, frequencyUnit, user_id,cronJobDone: true
            });
            await newInvoice.save()
        }

        if (saveAsDraft) {
            return res.send({
                message: "created successfully",
                invoice: newInvoice,
                // paymentResponse
            })
        }
        if (type == 1) {
            if (sendAtMail) {
                const res = await sendEmail(email)
            }
            if (sendAtSMS) {
                const res = await sendSms(country_code + mobile_no, "Your invoice is created testing by Navdeep Singh")
            }
            return res.send({
                message: "created successfully",
                invoice: newInvoice,
                // paymentResponse
            })
        }
        if (isToday(invoice_start_date)) {
            if (sendAtMail) {
                const res = await sendEmail(email)
            }
            if (sendAtSMS) {
                const res = await sendSms(country_code + mobile_no, "Your invoice is created ")
            }
            newInvoice.cronJobDone = true;

        }
        const newDate = moment(invoice_start_date).add(repeat_every, frequencyUnit);
        let nextInvoice = new Invoice({
            amount, mobile_no, name, remark, email, country_code, type, isDraft: saveAsDraft, invoice_start_date, repeat_every, frequencyUnit,user_id
        });
        await nextInvoice.save()

        // const {data} = await createPayment(amount,"BHD",newInvoice._id);
        //     res.send(data)
        res.send({
            message: "created successfully",
            invoice: newInvoice,
            // paymentResponse
        })

    } catch (error) {
        next(error)
    }
}

exports.getInvoices = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, type, customerName, } = req.query;
        let user_id = req?.user?._id
        // Create query object
        const query = {
            isDraft: type === "drafts",
            isDeleted: false,
            user_id
        };

        // If customerName is provided, add it to the query with a case-insensitive search
        if (customerName) {
            query.customerName = { $regex: customerName, $options: "i" };
        }

        // Calculate total documents
        const totalInvoices = await Invoice.find(query).countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalInvoices / limit);

        // Fetch invoices with pagination
        const invoices = await Invoice.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 }); // Sort by creation date in descending order (latest first)

        // Determine if there's a next or previous page
        const isNext = page < totalPages;
        const isPrevious = page > 1;

        res.send({
            total: totalInvoices,
            page: Number(page),
            limit: Number(limit),
            totalPages,
            isNext,
            isPrevious,
            invoices
        });
    } catch (error) {
        next(error);
    }
};



exports.deleteInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find and delete the invoice
        const deletedInvoice = await Invoice.findOneAndUpdate({ _id: id,user_id:req.user._id }, { $set: { isDeleted: true } });

        if (!deletedInvoice) {
            return res.status(404).send({ message: "Invoice not found" });
        }

        res.send({ message: "Invoice deleted successfully", invoice: deletedInvoice });
    } catch (error) {
        next(error);
    }
};
