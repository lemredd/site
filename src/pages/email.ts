import type { APIContext } from "astro";
import { createTransport } from "nodemailer";

const transporter = createTransport({
	"service": "gmail",
	"host": "smtp.gmail.com",
	"auth": {
		"user": import.meta.env.SECRET_MAIL_EMAIL,
		"pass": import.meta.env.SECRET_MAIL_PASS
	}
});

export async function post({ request }: APIContext): Response {
	const data = await request.formData();
	const email = data.get("email");
	const body = data.get("body");
	const mail = {
		"from": String(email), // Useless when using Gmail as service and host
		"to": import.meta.env.SECRET_MAIL_EMAIL,
		"subject": `New email from ${email} - lemredd.pages.dev`,
		"text": String(body)
	};

	transporter.sendMail(mail, (error) => {
	// TODO: show status using URL search params
		if (error) return new Response(JSON.stringify(error), { "status": 500, "statusText": "something went wrong..." });
		return new Response(null, { "status": 200, "statusText": "email sent" });
	});
	
}
