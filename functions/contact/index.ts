export const onRequestPost: PagesFunction = logPostData;

async function logPostData(context) {
    const formData = await context.request.formData()
    const dataObj = {};
    for (let [key, value] of formData.entries()) {
        dataObj[key] = value;
    }
    console.log(dataObj);
    return new Response('All good here.')
}
