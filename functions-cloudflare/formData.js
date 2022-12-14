addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Check if the request is a form submit
  if (request.method === 'POST' && request.url === 'https://cardiff.marketing/form') {
    // Get the form data from the request body
    const formData = await request.formData()

    // Create the email message with the form data
    let emailBody = ''
    for (const [name, value] of formData) {
      emailBody += `${name}: ${value}\n`
    }

    // Send the email with the form data
    await sendEmail('info@cardiff.marketing', 'Form submission from cardiff.marketing', emailBody)

    // Return a success response
    return new Response('Success', {
      status: 200,
    })
  } else {
    // Return a not found response
    return new Response('Not found', {
      status: 404,
    })
  }
}
const apiKey = '<your-mailgun-api-key>'
const domain = '<your-mailgun-domain>'
const mailgun = require('mailgun-js')({ apiKey, domain })

async function sendEmail(to, subject, body) {
  // Construct the email data
  const emailData = {
    from: 'info@cardiff.marketing',
    to,
    subject,
    text: body,
  }

  // Send the email using the Mailgun API
  await mailgun.messages().send(emailData)
}