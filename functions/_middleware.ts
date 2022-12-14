// Implements this plugin: https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/
// Will capture anything from a form with a 'data-static-form-name' attribute, for example: <form data-static-form-name="contact">
// No extra work necessary.
import mailchannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest = mailchannelsPlugin({
  personalizations: [
    {
      to: [{ name: "Cardiff Marketing", email: "info@cardiff.marketing" }],
    },
  ],
  from: { name: "Cardiff Marketing", email: "info@cardiff.marketing" },
  respondWith: () =>
    new Response(null, {
      status: 302,
      headers: { Location: "/about" },
    }),
});
