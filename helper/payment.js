const axios =  require("axios")
const nodemailer =  require("nodemailer")
exports. createPayment = async (amount, currency, orderID) => {
    const paymentGatewayURL = 'https://afs.gateway.mastercard.com/ma';
    const merchantID = 'TEST100273870';
    const apiPassword = 'Bahbeta@2024';
    try {
        const response = await axios.post(`${paymentGatewayURL}/order`, {
            merchant: {
                id: merchantID,
                password: apiPassword,
            },
            order: {
                amount,
                currency,
                reference: orderID,
            },
        });
        console.log("🚀 ~ exports.createPayment= ~ response:", response)
                
        return response
    } catch (error) {
        console.log("🚀 ~ createPayment ~ error:", error)
        throw error
        
    }
}
exports.sendEmail = async(email, content) => {
    try {
      var transporter = nodemailer.createTransport({
        host: "smtp.postmarkapp.com",
        port: 587,
        auth: {
          user: "41cc5d94-4628-4eee-bef3-f525141a4910",
          pass: "41cc5d94-4628-4eee-bef3-f525141a4910"
        }
      });
      let mailOptions = {
        from: "contact@sportmeetapp.com", // sender address
        to: email, // recipient address
        subject: "Invoice Created Successfully", // Subject line
        text: "You have received an order from TRIP BEE TRAVEL AND TOURISM W.L.L for an amount of 103 BHD.\n Pay using: https://www.bahbeta.com/a/p/g/V0IyMzA5MjM2OTIxNTQ4NS0xMzA5NDE", // plain text body
        html: `<p>You have received an order from TRIP BEE TRAVEL AND TOURISM W.L.L for an amount of 103 BHD.</p>
        <p>Pay using: https://www.bahbeta.com/a/p/g/V0IyMzA5MjM2OTIxNTQ4NS0xMzA5NDE</p>` // HTML body
      };
     const response = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
      return response;
    } catch (err) {
      throw err;
    }
  },

  exports.sendSms= async (phoneNumber, messageText) => {
    try {
      console.log("phone number is",phoneNumber.slice(1))
      const clientId = "bahbeta80t6mi77915tv1wun";
      const password = "dvje1p2hzvyk6uc7bwcwi3pwdasi7iph";
      const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJJbmZpbml0byIsImlhdCI6MTcyNTU1NTY0Nywic3ViIjoiYmFoYmV0YTgwdDZtaTc3OTE1dHYxd3VuIn0.5XjMQ2ItKbu3qcQf4B9ZRi9h_4VEtgHthgufeYT6uP8";

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
              text: "You have received an order from TRIP BEE TRAVEL AND TOURISM W.L.L for an amount of 103 BHD.\n Pay using: https://www.bahbeta.com/a/p/g/V0IyMzA5MjM2OTIxNTQ4NS0xMzA5NDE", // The SMS text content
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