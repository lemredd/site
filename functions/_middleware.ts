import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

interface EnvironmentVariables {
	SECRET_MAIL_EMAIL: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const onRequest: PagesFunction = mailChannelsPlugin({
	"personalizations": [
		{
			"to": [{ "name": "ACME Support", "email": "support@example.com" }],
		},
	],
	"from": ({ formData }) => {
		const email = String(formData.get("email"));

		return {
			"name": email,
			email
		};
	},
	"respondWith": () => {
		return new Response(
			"Thank you for submitting your enquiry. A member of the team will be in touch shortly."
		);
	},
});
