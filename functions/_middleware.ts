// Implements this plugin: https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/
// Will capture anything from a form with a 'data-static-form-name' attribute, for example: <form data-static-form-name="contact">
// No extra work necessary.
import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest: PagesFunction = mailChannelsPlugin({personalizations: [
  {
    to: [{ name: "Info", email: "info@cardiff.marketing" }],
  },
], from: emailFrom(), subject: emailSubject(),  respondWith: responWithEmail() });

function emailPersonalizations() {
  return [{to: { name: "string", email: "string"}}]
}

function emailFrom() {
  return {name: "Enquiry", email: "eqnuiry@cardiff.marketing"}
}

function responWithEmail() {
  return new Response(`Thank you for submitting your enquiry. A member of the team will be in touch shortly.`)
}

function emailSubject() {
  return "Test Subject 3382"
}