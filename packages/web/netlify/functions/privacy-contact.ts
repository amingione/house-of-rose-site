const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "House of Rose Privacy Support <support@updates.houseofrosefl.com>";
const DEFAULT_TO = "info@houseofrosefl.com";
const PRIVACY_PAGE_URL = "https://houseofrosefl.com/privacy-policy/";

interface PrivacyContactSubmission {
	name: string;
	email: string;
	subject: string;
	message: string;
	website: string;
}

const getField = (formData: FormData, key: keyof PrivacyContactSubmission): string => {
	const value = formData.get(key);
	return typeof value === "string" ? value.trim() : "";
};

const escapeHtml = (value: string): string =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");

const renderResponse = (title: string, message: string, status: number): Response =>
	new Response(
		`<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>${escapeHtml(title)} | House of Rose</title>
		<style>
			body { margin: 0; font-family: Georgia, serif; background: #fbf6f0; color: #2a2421; }
			main { min-height: 100vh; display: grid; place-items: center; padding: 2rem; }
			section { max-width: 38rem; border: 1px solid #ead1cc; background: rgba(255,255,255,.72); padding: 2rem; }
			p { font-family: Arial, sans-serif; line-height: 1.6; color: rgba(42,36,33,.72); }
			a { color: #9f3f4d; text-transform: uppercase; letter-spacing: .16em; font: 700 .75rem Arial, sans-serif; }
		</style>
	</head>
	<body>
		<main>
			<section>
				<h1>${escapeHtml(title)}</h1>
				<p>${escapeHtml(message)}</p>
				<a href="/privacy-policy/#privacy-contact">Return to privacy policy</a>
			</section>
		</main>
	</body>
</html>`,
		{
			status,
			headers: { "Content-Type": "text/html; charset=utf-8" },
		},
	);

export default async (request: Request): Promise<Response> => {
	if (request.method !== "POST") {
		return renderResponse("Method Not Allowed", "Please submit the privacy form from the privacy policy page.", 405);
	}

	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		return renderResponse(
			"Message Not Sent",
			"Privacy support is not configured yet. Please try again later.",
			500,
		);
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return renderResponse(
			"Request Not Sent",
			"The submitted form could not be read. Please return and try again.",
			400,
		);
	}
	const submission: PrivacyContactSubmission = {
		name: getField(formData, "name"),
		email: getField(formData, "email"),
		subject: getField(formData, "subject"),
		message: getField(formData, "message"),
		website: getField(formData, "website"),
	};

	if (submission.website) {
		return renderResponse("Request Received", "Thank you. Your privacy request has been received.", 200);
	}

	if (!submission.name || !submission.email || !submission.subject || !submission.message) {
		return renderResponse("Missing Information", "Please complete every required field before sending.", 400);
	}

	const from = process.env.PRIVACY_SUPPORT_FROM ?? DEFAULT_FROM;
	const to = process.env.PRIVACY_SUPPORT_TO ?? DEFAULT_TO;
	const safeName = escapeHtml(submission.name);
	const safeEmail = escapeHtml(submission.email);
	const safeSubject = escapeHtml(submission.subject);
	const safeMessage = escapeHtml(submission.message).replaceAll("\n", "<br />");

	const resendResponse = await fetch(RESEND_ENDPOINT, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from,
			to: [to],
			reply_to: submission.email,
			subject: `Privacy Policy Request: ${submission.subject}`,
			text: [
				"New privacy policy request",
				"",
				`Name: ${submission.name}`,
				`Email: ${submission.email}`,
				`Subject: ${submission.subject}`,
				"",
				submission.message,
				"",
				`Privacy policy: ${PRIVACY_PAGE_URL}`,
			].join("\n"),
			html: `<h2>New privacy policy request</h2>
<p><strong>Name:</strong> ${safeName}</p>
<p><strong>Email:</strong> ${safeEmail}</p>
<p><strong>Subject:</strong> ${safeSubject}</p>
<p><strong>Message:</strong><br />${safeMessage}</p>
<p><a href="${PRIVACY_PAGE_URL}">View privacy policy</a></p>`,
			tags: [
				{ name: "source", value: "privacy-policy" },
				{ name: "domain", value: "updates.houseofrosefl.com" },
			],
		}),
	});

	if (!resendResponse.ok) {
		const errorBody = await resendResponse.text().catch(() => "(unreadable)");
		console.error(`[privacy-contact] Resend error ${resendResponse.status}: ${errorBody}`);
		return renderResponse(
			"Message Not Sent",
			"Privacy support could not send your request. Please try again later.",
			502,
		);
	}

	return renderResponse("Request Sent", "Thank you. Your privacy request has been sent to House of Rose.", 200);
};
