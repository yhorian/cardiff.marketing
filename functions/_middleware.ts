import staticFormsPlugin from "@cloudflare/pages-plugin-static-forms";

export const onRequest: PagesFunction = staticFormsPlugin({
  respondWith: ({ formData, name }) => {
    const email = formData.get('email')
    return Response.redirect('https://cardiff.marketing/about', 302)
  }
}); 
