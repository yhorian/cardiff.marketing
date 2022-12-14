// Implements this plugin: https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/
// Will capture anything from a form with a 'data-static-form-name' attribute, for example: <form data-static-form-name="contact">
// No extra work necessary.
import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest: PagesFunction = mailChannelsPlugin({personalizations: emailPersonalizations, from: emailFrom, subject: emailSubject,  respondWith: responWithEmail, content: emailContent });

function emailPersonalizations(data) {
  return [{to: [{ name: "Info", email: "info@cardiff.marketing" }],},]
}

function emailFrom(data) {
  return {name: data.formData.get('name'), email: data.formData.get('email')}
}

function responWithEmail(data) {
  return new Response(null, {status: 302, headers: { Location: "/thank-you" },})
}

function emailSubject() {
  return "Test Subject " + Math.random()
}

function emailContent(data) {
  return [{type: "text/plain", value:"Message: " + data.formData.get('message'),},]
}