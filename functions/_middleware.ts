import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const onRequest: PagesFunction = mailChannelsPlugin({
	"personalizations": [
		{
			"to": [{ "name": "ACME Support", "email": "support@example.com" }],
		},
	],
	"from": {
		"name": "ACME Support",
		"email": "support@example.com",
	},
	"respondWith": () => {
		return new Response(
			"Thank you for submitting your enquiry. A member of the team will be in touch shortly."
		);
	},
});
