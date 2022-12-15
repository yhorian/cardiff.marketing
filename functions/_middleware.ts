// Implements this plugin: https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/
// Will capture anything from a form with a 'data-static-form-name' attribute, for example: <form data-static-form-name="contact">
// No extra work necessary.
// Replace this with your details:
const myEmail = "info@cardiff.marketing"

import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

// Expects object literal with properties for: "Personalizations" with a 'to' field, "from": with name + email, "respondWith" as a response or promise of a response object.
// Optional Properties: subject, content. Define the subject/content for the email.
export const onRequest: PagesFunction = mailChannelsPlugin({personalizations: emailPersonalizations, from: emailFrom, subject: emailSubject,  respondWith: formResponse,});

function emailPersonalizations() {
  return [{to: [{ name: "Me", email: myEmail }],},]
}

function emailFrom(data) {
  return {name: `${ data.name } form`, email: myEmail}
}

function formResponse() {
  return Response.redirect('https://cardiff.marketing/about', 302)
}

function emailSubject(data) {
  return `${ data.name } form submission from: ` + data.formData.get("email")
}

// This is the default template you get if 'content' isn't set, I've just extracted it to make it easier to understand and edit.
function emailContent(data) {
  return `<!DOCTYPE html>
  <html>
    <body>
      <h1>New contact form submission</h1>
      <div>At ${new Date().toISOString()}, you received a new ${data.name} form submission from ${data.request.headers.get("CF-Connecting-IP")}:</div>
      <table>
      <tbody>
      ${[...data.formData.entries()].map(([field, value]) => `<tr><td><strong>${field}</strong></td><td>${value}</td></tr>`).join("\n")}
      </tbody>
      </table>
    </body>
  </html>`;
}
