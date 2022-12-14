// Implements this plugin: https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/
// Will capture anything from a form with a 'data-static-form-name' attribute, for example: <form data-static-form-name="contact">
// No extra work necessary.
import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest: PagesFunction = mailChannelsPlugin({personalizations: emailPersonalizations, from: emailFrom, subject: emailSubject, content: emailContent, respondWith: responWithEmail });

function emailPersonalizations(request, formdata, name) {
  return [{to: [{ name: "ACME Support", email: "support@example.com" }]}]
}

function emailFrom(request, formData, name) {
  return {name: "ACME Support", email: "support@example.com"}
}

function responWithEmail(request, formData, name) {
  return new Response(`Thank you for submitting your enquiry. A member of the team will be in touch shortly.`)
}

function emailContent(request, formData, name) {
  return ["test content"]
}

function emailSubject(request, formData, name) {
  return "Test Subject 3382"
}