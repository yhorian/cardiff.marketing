// Tail the log with: npx wrangler pages deployment tail --project-name cardiff-marketing-site
// develop with: npx wrangler pages dev ./_site

const MAILGUN_URL = `https://api.mailgun.net/v3/cardiff.marketing/messages`;

export const onRequestPost: PagesFunction = logPostData;

async function logPostData(context) {
    var formData = await context.request.formData();
    if (!turnstileCheck(formData, context)) { return new Response("Turnstile Check Failed.") }
    var html =  `<!DOCTYPE html>
        <html>
          <body>
            <h1>New contact form submission</h1>
            <div>At ${new Date().toISOString()}, you received a new ${context.name} form submission from ${context.request.headers.get("CF-Connecting-IP")}:</div>
            <table>
            <tbody>
            ${[...formData.entries()].map(([field, value]) => `<tr><td><strong>${field}</strong></td><td>${value}</td></tr>`).join("\n")}
            </tbody>
            </table>
          </body>
        </html>`;
    let data = new URLSearchParams();
    data.append('from', formData.get('email'));
    data.append('to', 'info@cardiff.marketing');
    data.append('subject', 'From Contact Form');
    data.append('html', html);
    var response = await fetch(MAILGUN_URL, {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + btoa("api:" + context.env.MAILGUN_KEY),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
    })
    if (response.status == 200) {  return new Response('', {
        status: 302,
        statusText: 'Found',
        headers: {
          'Location': '/thank-you',
        },
      })}
    console.log(response.status)
    console.log(await response.text())
    return new Response('There was a problem sending the email. An error has been logged.', {
        status: 512
    })
}

async function turnstileCheck(formData, context) {
    let env = context.env;
    let token, secret;
    token = formData.get('cf-turnstile-response') ? formData.get('cf-turnstile-response').toString() : false;
    secret = env.TURNSTILE_KEY ? env.TURNSTILE_KEY.toString() : false;
    if (!token) {
        return new Response(`Turnstile = true - but no token found. Check the widget is rendering inside the <form> of your page: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/.`, {
            status: 512
        })
    };
    if (!secret) {
        return new Response(`Turnstile token found - but no secrey key set. Set an Environment variable with your Turnstile secret called "TURNSTILE_KEY" under Pages > Settings > Environment variables.`, {
            status: 512
        });
    }
    let ip = context.request.headers.get('CF-Connecting-IP');
    let captchaData = new FormData();
    captchaData.append('secret', secret);
    captchaData.append('response', token);
    captchaData.append('remoteip', ip);
    let url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    let result = await fetch(url, {
        body: captchaData,
        method: 'POST',
    });
    let outcome = await result.json();
    if (!outcome.success) {
        console.log("Token Failure from " + ip);
        return false;
    }
    formData.delete("cf-turnstile-response");
    return true;
}