const axios = require('axios');
const base64 = require('base-64');
const nodemailer =  require("nodemailer");
const { merchantId, mailHost, mailPort, mailUser, mailPass, mail, smsClientID, smsPass, smsToken } = require('../config/env');
exports. createPayment = async (amount, currency,apiPassword,merchantName,orderId,description) => {
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
        interaction: {
          displayControl:{billingAddress :"HIDE",shipping :"HIDE"},
            operation: "PURCHASE",
            merchant: {
                name: merchantName
            },
        },
        order: {
            currency: currency,
            amount: amount,
            id: orderId,
            description: description,
            address:"HIDE"
        }
    };
    const response = await axios.post(url, data, {
      headers: {
          'Content-Type': 'text/plain',
          'Authorization': `Basic ${encodedAuthString}`
      }
  })
        // console.log("🚀 ~ exports.createPayment= ~ response:", response)
                
        return response.data
    } catch (error) {
        console.log("🚀 ~ createPayment ~ error:", error)
        throw error
        
    }
}
exports. getOrderStatus = async (apiPassword,orderId) => {
  console.log("🚀 ~ exports.getOrderStatus= ~ apiPassword,orderId:", apiPassword,orderId)
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
        'Content-Type': 'text/plain',
        'Authorization': `Basic ${encodedAuthString}`
    }
  })
                
        return response.data
    } catch (error) {
        // console.log("🚀 ~ createPayment ~ error:", error)
        // throw error
        
    }
}
exports.sendEmail = async(email, url,amount,businessName) => {
    try {
      let transporter = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        auth: {
          user: mailUser,
          pass: mailPass
        }
      });
      let mailOptions = {
        from: mail, // sender address
        to: email, // recipient address
        subject: "Invoice Created Successfully", // Subject line
        text: `You have received an order from ${businessName} for an amount of ${amount} BHD.\n Pay using: ${url}`, // plain text body
        html: `<p>You have received an order from businessName for an amount of ${amount} BHD.</p>
        <p>Pay using: </p>
        <a href=${url}>click here</a>
        ` // HTML body
      };
     const response = await transporter.sendMail(mailOptions);
      console.log("🚀 ~ exports.sendEmail=async ~ response:", response)
      return response;
    } catch (err) {
      throw err;
    }
  },

  exports.sendSms= async (phoneNumber, messageText) => {
    try {
      console.log("phone number is",phoneNumber.slice(1))
      const clientId = smsClientID;
      const password = smsPass;
      const token = smsToken;

      // Construct the data payload
      const data = {
        apiver: "1.0",
        sms: {
          ver: "2.0",
          dlr: {
            url: "" // Optional: Leave as an empty string if not required
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
                  tag: "Clientsoptionalinformation" // Optional: Tag for message
                }
              ]
            }
          ]
        }
      };

      // Send the request to the API
      const response = await axios.post(
        "https://meapi.goinfinito.me/unified/v2/send",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          params: {
            clientid: clientId,
            clientpassword: password
          }
        }
      );

      // Check the response status
      console.log("Response:", response.data,response.data.messageack,response.data.messageack.guids[0].errors);

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
        error.response ? error.response.data : error.message
      );
    }
  }