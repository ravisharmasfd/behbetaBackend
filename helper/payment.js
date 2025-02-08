const axios = require("axios");
const base64 = require("base-64");
const nodemailer = require("nodemailer");
const {
  merchantId,
  mailHost,
  mailPort,
  mailUser,
  mailPass,
  mail,
  smsClientID,
  smsPass,
  smsToken,
} = require("../config/env");
let transporter = nodemailer.createTransport({
  host: mailHost,
  port: mailPort,
  auth: {
    user: mailUser,
    pass: mailPass,
  },
});
exports.createPayment = async (
  amount,
  currency,
  apiPassword,
  merchantName,
  orderId,
  description,
) => {
  const merchantID = merchantId;
  // const apiPassword = '7ebe83414d4b2608412bcff38d54764a';
  // const merchantName = 'Navdeep';
  // const orderId = '<order_ID>';
  // const description = '<description_of_order>';
  const authString = `merchant.${merchantID}:${apiPassword}`;
  const encodedAuthString = base64.encode(authString);
  const url = `https://afs.gateway.mastercard.com/api/rest/version/72/merchant/${merchantID}/session`;
  try {
    const data = {
      apiOperation: "INITIATE_CHECKOUT",
      checkoutMode: "WEBSITE",
      interaction: {
        displayControl: { billingAddress: "HIDE", shipping: "HIDE" },
        operation: "PURCHASE",
        merchant: {
          name: merchantName,
        },
      },
      order: {
        currency: currency,
        amount: amount,
        id: orderId,
        description: description,
      },
    };
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Basic ${encodedAuthString}`,
      },
    });
    // console.log("🚀 ~ exports.createPayment= ~ response:", response)

    return response.data;
  } catch (error) {
    console.log("🚀 ~ createPayment ~ error:", error?.response?.data);
    throw error;
  }
};
exports.getOrderStatus = async (apiPassword, orderId) => {
  console.log(
    "🚀 ~ exports.getOrderStatus= ~ apiPassword,orderId:",
    apiPassword,
    orderId,
  );
  const merchantID = merchantId;
  // const apiPassword = '7ebe83414d4b2608412bcff38d54764a';
  // const merchantName = 'Navdeep';
  // const orderId = '<order_ID>';
  // const description = '<description_of_order>';
  const authString = `merchant.${merchantID}:${apiPassword}`;
  const encodedAuthString = base64.encode(authString);
  const url = `https://afs.gateway.mastercard.com/api/rest/version/100/merchant/${merchantID}/order/${orderId}`;
  try {
    //   const data = {
    //     apiOperation: "INITIATE_CHECKOUT",
    //     interaction: {
    //         operation: "PURCHASE",
    //         merchant: {
    //             name: merchantName
    //         }
    //     },
    //     order: {
    //         currency: currency,
    //         amount: amount,
    //         id: orderId,
    //         description: description
    //     }
    // };
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Basic ${encodedAuthString}`,
      },
    });

    return response.data;
  } catch (error) {
    // console.log("🚀 ~ createPayment ~ error:", error)
    // throw error
  }
};
(exports.sendEmail = async (email, url, amount, businessName) => {
  try {
    let mailOptions = {
      from: mail, // sender address
      to: email, // recipient address
      subject: "Invoice Created Successfully", // Subject line
      text: `You have received an order from ${businessName} for an amount of ${amount} BHD.\n Pay using: ${url}`, // plain text body
      html: `<p>You have received an order from businessName for an amount of ${amount} BHD.</p>
        <p>Pay using: </p>
        <a href=${url}>click here</a>
        `, // HTML body
    };
    const response = await transporter.sendMail(mailOptions);
    console.log("🚀 ~ exports.sendEmail=async ~ response:", response);
    return response;
  } catch (err) {
    console.log("🚀 ~ exports.sendEmail=async ~ err:", err);
    throw err;
  }
}),
  (exports.sendInviteEmail = async (email, user, name) => {
    try {
      let mailOptions = {
        from: mail, // sender address
        to: email, // recipient address
        subject: "You are invited to join Bahbeta by " + user?.first_name,
        html: `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <link rel="stylesheet"
        href="https://gistcdn.githack.com/mfd/09b70eb47474836f25a21660282ce0fd/raw/e06a670afcb2b861ed2ac4a1ef752d062ef6b46b/Gilroy.css">
</head>

<body style="  font-family:  'Gilroy', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div
        style="max-width: 650px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <tbody>
                <tr>
                    <td style="text-align: center;display: flex;width: 100%;justify-content: center;">
                        <h3 style="color: #009cf6; font-size: 33px; margin: 0px; align-self: center;">Welcome to</h3>
                        <img src="./logo.png">
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <div
                            style=" border: 1px solid; border-radius: 50%; display: flex; margin: 0px auto; width: 48px;padding: 11px; justify-content: center;">
                            <img src="./smalllogo.png" height="40px" width="40px">
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
                <tr>
                    <td style="  width: 100%; padding: 0px 20px;">
                        <h4 style="margin-bottom: 10px; padding: 0; text-align:center;">Hi! ${name}
                        </h4>
                        <p style="text-align: center; color: #898383;">Invitation to Join Bahbeta <br /> Your Simplified
                            Electronic Invoicing Solution</p>
                      <p>You’ve been invited by <b> ${user?.first_name} </b> to join Bahbeta, an electronic
                            invoicing
                            platform designed to provide simple, efficient, & accessible invoicing, wherever your
                            customers may be.</p>
                        <h4 style="margin: 0; padding: 0;"> Effortlessly Send Digital Invoices to Your Customers
                            Through:
                        </h4>
                        <ul style="margin: 0; padding: 0;">
                            <li><b> SMS</b> – Fast, direct delivery to their phones</li>
                            <li><b> Email</b> – Professional and seamless communication</li>
                            <li><b> WhatsApp</b> – Fast, direct delivery to their phones</li>
                            <li><b> Copy Link</b> – Share easily across your social media platforms!</li>
                        </ul>
                        <p>Bahbeta make invoicing simple, efficient, and accessible wherever your customers are!</p>

                        <div style="text-align: center;">
                            <a href="https://bahbeta-merchant-panel.vercel.app/login" type="button" style="font-family:  'Gilroy', sans-serif; background-color: #0a99e8;
                            color: white;
                            padding: 9px;
                            border: 0px;
                            font-size: 16px;">Accept Invitation</a>
                        </div>

                        <p style="color: #0a99e8; text-align: center;">Download now and Enjoy using BBPAY APP!!!</p>
                        <h4 style="text-align: center;">Unlock Your Ideal eInvoicing Solution with Powerful Features!
                        </h4>
                        <p>
                            Get started today—simply download the app and log in using your phone number and password.
                        </p>
                        <p>Experience seamless invoicing like never before!</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
                <td style="width: 50%; text-align: center;"><img src="./app.png"
                        style="width: 180px; margin: 0px auto;" /></td>
                <td style="width: 50%; text-align: center;"><img src="./play.png"
                        style="width: 180px; margin: 0px auto;" /></td>
            </tr>
            <tr>
                <td style="width: 50%; text-align: center;">
                    <h4> Stay in Touch </h4>
                </td>
                <td style="width: 50%; text-align: center;">
                    <h4>24 X 7 Assistance</h4>
                </td>
            </tr>
        </table>
        <table style="width: 100%;">
            <tbody>
                <tr style="width: 100%;">
                    <td style="display: flex; margin: 0px auto; width: 100%;     justify-content: center;">
                        <p>Unsubscribe /</p>
                        <p>Privacy policy /</p>
                        <p>Help</p>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <img src="./socal.png" style="text-align: center;" />
                    </td>
                </tr>
                <tr style="background: #2d2e33;
    color: white;">
                    <td style="padding: 8px; text-align: center;">
                        <p style="margin: 0; padding: 0;"><b>Copyright © 2024 Bahbeta | Powered by Bahbeta</b></p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>`, // HTML body
      };
      const response = await transporter.sendMail(mailOptions);
      console.log("🚀 ~ exports.sendEmail=async ~ response:", response);
      return response;
    } catch (err) {
      throw err;
    }
  }),
  (exports.sendSms = async (phoneNumber, messageText) => {
    try {
      console.log("phone number is", phoneNumber.slice(1));
      const clientId = smsClientID;
      const password = smsPass;
      const token = smsToken;

      // Construct the data payload
      const data = {
        apiver: "1.0",
        sms: {
          ver: "2.0",
          dlr: {
            url: "", // Optional: Leave as an empty string if not required
          },
          messages: [
            {
              udh: "0",
              coding: 1,
              text: messageText, // The SMS text content
              property: 0,
              id: "ko95k321333891f160a007dhttBAHBETA80T", // A unique identifier for the message
              addresses: [
                {
                  from: "BahBeta", // Your sender ID
                  to: phoneNumber.slice(1), // The recipient's phone number from the request body
                  seq: "1", // Sequence number
                  tag: "Clientsoptionalinformation", // Optional: Tag for message
                },
              ],
            },
          ],
        },
      };

      // Send the request to the API
      const response = await axios.post(
        "https://meapi.goinfinito.me/unified/v2/send",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            clientid: clientId,
            clientpassword: password,
          },
        },
      );

      // Check the response status
      console.log(
        "Response:",
        response.data,
        response.data.messageack,
        response.data.messageack.guids[0].errors,
      );

      // Handle success or failure
      if (response.data.statuscode === 200) {
        console.log("Message sent successfully!");
      } else {
        console.error("Failed to send message:", response.data);
      }
    } catch (error) {
      // Handle errors in the request
      console.error(
        "Error:",
        error.response ? error.response.data : error.message,
      );
    }
  });
