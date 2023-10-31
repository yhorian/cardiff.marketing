// Tail the log with: npx wrangler pages deployment tail --project-name cardiff-marketing-site
// develop with: npx wrangler pages dev ./_site
// .dev.vars contains secrets locally.

const MAILGUN_URL = `https://api.mailgun.net/v3/cardiff.marketing/messages`;

export const onRequestPost: PagesFunction = logPostData;

async function logPostData(context) {
    let formData = await context.request.formData();
    const token = formData.get('cf-turnstile-response') ? formData.get('cf-turnstile-response').toString() : false;
    const secret = context.env.TURNSTILE_KEY ? context.env.TURNSTILE_KEY.toString() : false;
    const ip = context.request.headers.get('CF-Connecting-IP');
    let turnstileResult = await turnstileCheck(token, secret, ip)
    if (!turnstileResult) { return new Response("Turnstile Check Failed.") }
    formData.delete('cf-turnstile-response')
    let html =  `<!DOCTYPE html>
        <html>
          <body>
            <h1>New contact form submission</h1>
            <div>At ${new Date().toISOString()}, you received a new ${context.name} form submission from ${ip}:</div>
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
    let response = await fetch(MAILGUN_URL, {
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

async function turnstileCheck(token, secret, ip) {
    if (!token) {
        console.log("Turnstile Failure: No Token " + ip);
        return false
    };
    if (!secret) {
        console.log("Turnstile Failure: No Secret " + ip);
        return false
    }
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
        console.log("Turnstile Token Failure from " + ip);
        return false;
    }
    console.log("Turnstile success!")
    return true;
}
