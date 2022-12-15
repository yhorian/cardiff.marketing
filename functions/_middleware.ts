// Implements this plugin: https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/
// Will capture anything from a form with a 'data-static-form-name' attribute, for example: <form data-static-form-name="contact">
// No extra work necessary.
// Replace this with your details:
const myEmail = "info@cardiff.marketing"

import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest: PagesFunction = mailChannelsPlugin({personalizations: emailPersonalizations, from: emailFrom, subject: emailSubject,  respondWith: responWithEmail,});

function emailPersonalizations() {
  return [{to: [{ name: "Me", email: myEmail }],},]
}

function emailFrom() {
  return {name: "Form Submission", email: myEmail}
}

function responWithEmail() {
  return Response.redirect("/about", 302)
}

function emailSubject(data) {
  return "Cardiff.Marketing Enquiry from: " + data.formData.get("name")
}
