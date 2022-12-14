const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Get the form data from the request body
  const formData = JSON.parse(event.body);
  
  // Create a transporter object for sending email
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: '<your-gmail-account>@gmail.com',
      pass: '<your-gmail-password>'
    }
  });
  
  // Create the email message
  const email = {
    from: formData.email,
    to: 'info@cardiff.marketing',
    subject: `New form submission from ${formData.name}`,
    text: formData.message
  };
  
  // Send the email using the transporter object
  await transporter.sendMail(email);
  
  // Return a success response
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Form submission successful!'
    })
  };
};
