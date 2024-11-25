const moment = require("moment");
const { isToday } = require("../helper/helperFunction");
const { createPayment, sendEmail, sendSms, getOrderStatus } = require("../helper/payment");
const Invoice = require("../model/invoice");

exports.createInvoice = async (req, res, next) => {
    try {
        const { amount, country_code, mobile_no, name, remark, sendAtSMS, sendAtWhatsapp, sendAtMail, saveAsDraft, email, draftId, type, invoice_start_date, repeat_every, frequencyUnit } = req.body;
        console.log("🚀 ~ exports.createInvoice= ~ type:", type)
        let user_id = req?.user?._id
        let newInvoice;
        console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 1)
        if (draftId) {
            newInvoice = await Invoice.findOneAndUpdate({ _id: draftId,user_id }, { $set: { amount, mobile_no, name, remark, email, country_code, type, isDraft: saveAsDraft, invoice_start_date, repeat_every, frequencyUnit } });
            console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 2)
        }
        else {
            newInvoice = new Invoice({
                amount, mobile_no, name, remark, email, country_code, type, isDraft: saveAsDraft, invoice_start_date, repeat_every, frequencyUnit, user_id,cronJobDone: true
            });
            await newInvoice.save();
            console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 3)
        }
        const url = `${"http://localhost:3000/payment?sessionId="}${newInvoice._id}`

        if (saveAsDraft) {
            console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 4)
            return res.send({
                message: "created successfully",
                invoice: newInvoice,
                // paymentResponse
            })
        }
        if (type == 1) {
            console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 5)
            
            if (sendAtMail) {
                console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 6)
                const res = await sendEmail(email,url,amount,req.user?.businessName)
            }
            if (sendAtSMS) {
                console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 6)
                const res = await sendSms(country_code + mobile_no, `You have received an order from ${req.user?.businessName} for an amount of ${amount} BHD. Pay using:${url}`)
            }
            console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 7)
            return res.send({
                message: "created successfully",
                invoice: newInvoice,
                url
                // paymentResponse
            })
        }
        if (isToday(invoice_start_date)) {
            console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 8)
            if (sendAtMail) {
                console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 9)
                const res = await sendEmail(email,url,amount,req.user?.businessName)
            }
            if (sendAtSMS) {
                console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 10)
                const res = await sendSms(country_code + mobile_no, `You have received an order from ${req.user?.businessName} for an amount of ${amount} BHD. Pay using:${url}`)
            }
            newInvoice.cronJobDone = true;

        }
        console.log("🚀 ~ exports.createInvoice= ~ newInvoice:", 11)
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
            url
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
exports.generatePaymentSeasonId = async (req,res,next)=>{
    try {
        const id = req.params.id;
        console.log("🚀 ~ exports.generatePaymentSeasonId= ~ id2:", id)
        // Create query object
        const query = {
            _id:id,
            isDraft: false,
            isDeleted: false,
        };
        const invoice = await Invoice.findOne(query).populate("user_id");
        if(!invoice){
            return res.status(404).json({
                message:"Invoice not found"
            })
        }
        if(invoice?.status == 2){
            invoice.status = 2;
            await invoice.save()
            return res.status(400).json({
                message:"Payment already is completed for this invoice"
            })
        }
        const result = await getOrderStatus(invoice?.user_id?.apiKey,invoice._id);
        if(result?.result == 'SUCCESS'){
            invoice.status = 2;
            await invoice.save()
            return res.status(400).json({
                message:"Payment is already completed"
            })
        }
        console.log("🚀 ~ exports.generatePaymentSeasonId= ~ result:", result)
        const season = await createPayment(invoice?.amount,"BHD",invoice?.user_id?.apiKey,invoice.user_id?.businessName,id,"invoice");
        res.send({
            data:invoice,
            season
        })
    } catch (error) {
        next(error)
    }
}
exports.checkPaymentStatus = async (req,res,next)=>{
    try {
        const id = req.params.id;
        console.log("🚀 ~ exports.checkPaymentStatus= ~ id:", id)
        // Create query object
        const query = {
            _id:id,
            isDraft: false,
            isDeleted: false,
        };
        const invoice = await Invoice.findOne(query).populate("user_id");
        if(!invoice){
            return res.status(404).json({
                message:"Invoice not found"
            })
        }
        const result = await getOrderStatus(invoice?.user_id?.apiKey,invoice._id);
        if(result?.result == 'SUCCESS'){
            invoice.status = 2;
            await invoice.save()
        }
        res.send({
            data:invoice,
            result
        })
    } catch (error) {
        next(error)
    }
}

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