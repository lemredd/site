import { defineMiddleware } from "astro:middleware";
import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

interface EnvironmentVariables {
	SECRET_MAIL_EMAIL: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const onRequest = defineMiddleware((context, next) => {
	console.log(context.request.url);

	return next();
});

// https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels/
// eslint-disable-next-line @typescript-eslint/naming-convention
//export const onRequest: PagesFunction<EnvironmentVariables> = context => mailChannelsPlugin({
//	"personalizations": [
//		{
//			"to": [{ "name": "Jarlem Red de Peralta", "email": context.env.SECRET_MAIL_EMAIL }],
//		},
//	],
//	"from": ({ formData }) => {
//		const email = String(formData.get("email"));
//
//		return {
//			"name": email,
//			email
//		};
//	},
//	"respondWith": () => {
//		return new Response(
//			"Thank you for submitting your enquiry. A member of the team will be in touch shortly."
//		);
//	},
//})(context);
