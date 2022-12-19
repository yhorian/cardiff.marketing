export default {
	async fetch(request) {
		// Parse the query string of the request
		const params = new URL(request.url).searchParams
		const state = params.get('state')
		const code = params.get('code')

		// Check if the request is the redirect from the GitHub OAuth flow
		if (state && code) {
			// Exchange the code for an access token
			const tokenResponse = await exchangeCodeForToken(code)
			const accessToken = tokenResponse.access_token

			// Use the access token to retrieve the user's profile
			const userResponse = await getUserProfile(accessToken)
			const user = userResponse.data

			// Set a cookie with the user's information to complete the login flow
			const cookie = `user=${JSON.stringify({
				avatar_url: user.avatar_url,
				name: user.name,
			})}`
			const response = new Response('', {
				headers: {
					'Set-Cookie': cookie,
				},
			})

			// Redirect the user back to the NetlifyCMS page
			return response.redirect(state)
		} else {
			// Otherwise, return the default response
			return new Response('Hello World! Nothing to see here.')
		}
	}
};


async function exchangeCodeForToken(code) {
	// Replace GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET with your own values
	const clientId = '97255fe0b08af260b1a2'
	const clientSecret = '857b7f02b2e54fdeac503901eb5575c1d1aa8cdc'

	const response = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			client_id: clientId,
			client_secret: clientSecret,
			code,
		}),
	})
	return await response.json()
}

async function getUserProfile(accessToken) {
	const response = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})
	return await response.json()
}