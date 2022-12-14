// Implements this plugin: https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/
// Will capture anything from a form with a 'data-static-form-name' attribute, for example: <form data-static-form-name="contact">
// No extra work necessary.
import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest: PagesFunction = mailChannelsPlugin({personalizations: emailPersonalizations, from: emailFrom, subject: emailSubject,  respondWith: responWithEmail, content: emailContent });

function emailPersonalizations(data) {
  console.log(data);
  return [{to: [{ name: "Info", email: "info@cardiff.marketing" }],},]
}

function emailFrom(data) {
  console.log(data);
  return {name: "Enquiries", email: "enquiry@cardiff.marketing"}
}

function responWithEmail(data) {
  console.log(data);
  return new Response(`Thank you for submitting your enquiry. A member of the team will be in touch shortly.`)
}

function emailSubject() {
  return "Test Subject " + Math.random()
}

function emailContent(data) {
  return [{type: "text/plain", value: JSON.stringify(data),},]
}