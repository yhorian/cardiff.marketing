import staticFormsPlugin from "pages-plugin-mailchannels-bugfix";

export const onRequest: PagesFunction = pages-plugin-mailchannels-bugfix({
  respondWith: ({ formData, name }) => {
    const email = formData.get('email')
    return Response.redirect('https://cardiff.marketing/about', 302)
  }
}); 
