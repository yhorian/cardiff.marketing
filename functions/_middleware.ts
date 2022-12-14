// Implements this plugin: https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/
// Will capture anything from a form with a 'data-static-form-name' attribute, for example: <form data-static-form-name="contact">
// No extra work necessary.
import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest: PagesFunction = mailChannelsPlugin({personalizations: emailPersonalizations, from: emailFrom, subject: emailSubject,  respondWith: responWithEmail, content: emailContent });

function emailPersonalizations(data) {
  return [{to: [{ name: JSON.stringify(data), email: "info@cardiff.marketing" }],},]
}

function emailFrom(data) {
  return {name: "Enquiries", email: "enquiry@cardiff.marketing"}
}

function responWithEmail(data) {
  let someData = data.formData()
  return new Response(JSON.stringify(someData))
}

function emailSubject() {
  return "Test Subject " + Math.random()
}

function emailContent(data) {
  return [{type: "text/plain", value:"Thanks " + data.name.contact + " we appreciate the email. " + data.formData,},]
}