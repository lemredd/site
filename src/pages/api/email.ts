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

export async function post({ request }: APIContext): Promise<Response> {
	const data = await request.formData();
	const email = data.get("email");
	const body = data.get("body");
	const mail = {
		"from": String(email), // Useless when using Gmail as service and host
		"to": import.meta.env.SECRET_MAIL_EMAIL,
		"subject": `New email from ${email} - lemredd.pages.dev`,
		"text": String(body)
	};

	return await new Promise((resolve, reject) => {
		transporter.sendMail(mail, (error, info) => {
		// TODO: show status using URL search params
			if (error) reject(error);
			else resolve(info);
		});
	})
		.then(() => new Response(JSON.stringify({ "status": 200 }), { "status": 200 }))
		.catch(error => new Response(JSON.stringify(error), { "status": 500 }));
}
