// Implements this plugin: https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/
// Will capture anything from a form with a 'data-static-form-name' attribute, for example: <form data-static-form-name="contact">
// No extra work necessary.
import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest: PagesFunction = mailChannelsPlugin({personalizations: formEmailArray});

function formEmailArray(request, formdata, name) {
    let personalizations = { personalizations:[
      {
        to: [{ name: "ACME Support", email: "support@example.com" }],
      },
    ],
    from: {
      name: "ACME Support",
      email: "support@example.com",
    },
    respondWith: () => {
      return new Response(
        `Thank you for submitting your enquiry. A member of the team will be in touch shortly.`
      );
    },
  }
  return personalizations
}