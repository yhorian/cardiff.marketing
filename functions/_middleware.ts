// Implements this plugin: https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/
// Will capture anything from a form with a 'data-static-form-name' attribute, for example: <form data-static-form-name="contact">
// No extra work necessary.
// replace this with your email:
const myEmail = "info@cardiff.marketing"
import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest: PagesFunction = mailChannelsPlugin({personalizations: emailPersonalizations, from: emailFrom, subject: emailSubject,  respondWith: () =>
  new Response(null, {
    status: 302,
    headers: { Location: "/about" },
  })
});

function emailPersonalizations(data) {
  return [{to: [{ name: "Me", email: myEmail }],},]
}

function emailFrom(data) {
  return {name: "Form Submission", email: myEmail}
}

function responWithEmail(data) {
  return new Response(null, {status: 302, headers: { Location: "/about" },})
}

function emailSubject() {
  return "Test Subject " + Math.random()
}
