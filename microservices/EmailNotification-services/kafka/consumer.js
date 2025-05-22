const kafka = require("../kafka/client");
const { sendEmail } = require("../utils/email");
const consumer = kafka.consumer({ groupId: "email-group" });

const startConsumer = async () => {
  await consumer.connect();

  // Subscribe to all the topics (order events and user registration)
  await consumer.subscribe({ topic: "order.placed", fromBeginning: false });
  await consumer.subscribe({
    topic: "order.status.updated",
    fromBeginning: false,
  });
  await consumer.subscribe({ topic: "order.deleted", fromBeginning: false });
  await consumer.subscribe({ topic: "user.registered", fromBeginning: false }); // Subscribe to user registration event

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`📩 [${topic}] Message Received:`, data);

      let recipientEmail= "";
      let emailSubject = "";
      let emailBody = "";

      // Handling different event topics
      switch (topic) {
        case "order.placed":
          const { user_name, order_id, total_price, user_email, items } = data;
          recipientEmail = user_email;
          emailSubject = "✅ Order Placed Successfully";
          emailBody = `
                        Hi ${user_name},<br/><br/>
                        Thank you for your order!<br/>
                        Your order with ID <strong>${order_id}</strong> has been placed successfully.<br/>
                        <strong>Total:</strong> $${total_price}<br/><br/>
                        <h3>Order Details:</h3>
                        <ul>
                            ${items
                              .map(
                                (item) =>
                                  `<li>${item.name} - $${item.price} - ${item.description}</li>`
                              )
                              .join("")}
                        </ul>
                        We’ll notify you once it's shipped.<br/><br/>
                        Regards,<br/>My App Team
                    `;
          break;

        case "order.status.updated":
          emailSubject = "📦 Order Status Updated";
          emailBody = `Hi, your order ${data.order_id} status is now "${data.status}".`;
          break;

        case "order.deleted":
          emailSubject = "❌ Order Cancelled";
          emailBody = `Hi, your order ${data.order_id} has been cancelled. Please contact support if needed.`;
          break;
        case "user.registered":
          // Handle user registration email
          emailSubject = "Welcome to Our Service!";
          emailBody = `Hi ${data.name},\n\nThank you for registering with us! Your account has been created successfully.`;
          break;
      }
      // Send the email
      const result = await sendEmail(recipientEmail, emailSubject, emailBody);
      // Log the result
      if (result.success) {
        console.log(
          `✅ Email sent to ${recipientEmail} (messageId: ${result.messageId})`
        );
      } else {
        console.error(`❌ Email failed to ${recipientEmail}: ${result.error}`);
      }
    },
  });
};

module.exports = { startConsumer };
