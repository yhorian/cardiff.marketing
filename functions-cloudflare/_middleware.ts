// Using V2 of mailchannel plugin
const myEmail = "info@cardiff.marketing"
import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest: PagesFunction = mailChannelsPlugin({personalizations: emailPersonalizations, from: emailFrom, subject: emailSubject,  respondWith: formResponse});

function emailPersonalizations() {
  return [{to: [{ name: "Me", email: myEmail }],},]
}
function emailFrom(data) {
  return {name: `${ data.name } form`, email: myEmail}
}
function formResponse() {
  return Response.redirect('https://cardiff.marketing/thank-you/', 302)
}

function emailSubject(data) {
  return `${ data.name } form submission from: ` + data.formData.get("email")
}

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