/**
 * Prevent stale CMS copy from republishing business-channel details that have
 * changed more recently than the underlying Sanity documents.
 */
export interface PublicCopyOptions {
	/** Exact-procedure exception confirmed by the owner/provider. */
	allowNoDowntime?: boolean;
}

export interface PublicCopyRisk {
	code: "clinical-claim-review" | "absolute-outcome-review";
	message: string;
	match: string;
}

/**
 * Report high-risk assertions without rewriting them into awkward substitute
 * prose. Voice is a writing decision; this check is only a truth/review signal.
 */
export const findPublicCopyRisks = (
	value: string,
	options: PublicCopyOptions = {},
): PublicCopyRisk[] => {
	const risks: PublicCopyRisk[] = [];
	const clinicalClaim = value.match(
		options.allowNoDowntime
			? /\b(?:pain[- ]free|FDA approved|clinically proven)\b/i
			: /\b(?:(?:no|zero)[- ]downtime|pain[- ]free|FDA approved|clinically proven)\b/i,
	);
	if (clinicalClaim) {
		risks.push({
			code: "clinical-claim-review",
			message: "Review the underlying clinical claim in its exact service context.",
			match: clinicalClaim[0],
		});
	}

	const absoluteOutcome = value.match(/\b(?:guaranteed results?|fully reversible results?)\b/i);
	if (absoluteOutcome) {
		risks.push({
			code: "absolute-outcome-review",
			message: "Verify or remove the absolute outcome claim at its source.",
			match: absoluteOutcome[0],
		});
	}

	return risks;
};

const reportedRiskCodes = new Set<PublicCopyRisk["code"]>();

const reportPublicCopyRisks = (value: string, options: PublicCopyOptions): void => {
	for (const risk of findPublicCopyRisks(value, options)) {
		if (reportedRiskCodes.has(risk.code)) continue;
		reportedRiskCodes.add(risk.code);
		globalThis.console.warn(
			`[public-copy preflight] ${risk.message} Example found: "${risk.match}"`,
		);
	}
};

export const alignPublicChannelCopy = (
	value: string,
	options: PublicCopyOptions = {},
): string => {
	reportPublicCopyRisks(value, options);

	return value
		.replaceAll("House of Rose LLC", "House of Rose Aesthetics LLC")
		.replace(/call\s*(?:or|\/)\s*text/gi, "call")
		.replace(/online booking menu/gi, "services menu")
		.replace(/online booking/gi, "services menu")
		.replace(/book online/gi, "review the services menu")
		.replace(/stem[- ]cell treatment/gi, "cell-based treatment")
		.replace(/stem[- ]cell therapy/gi, "cell-based therapy")
		// Keep the visit policy accurate without turning it into boilerplate.
		.replace(/\s*[—–;]\s*walk-ins?[^.]*\./gi, ".")
		.replace(/(?:^|\s+)walk-ins? (?:are )?(?:welcome|accepted)[^.]*\./gi, "")
		.replace(
			/Port Charlotte, Englewood, North Port, Venice, and the wider Charlotte County and Southwest Florida area/gi,
			"Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles",
		)
		.replace(
			/Punta Gorda, Port Charlotte, Englewood, North Port, and Venice/gi,
			"Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles",
		)
		.replace(
			/Port Charlotte, Englewood, Venice, North Port, and Cape Coral/gi,
			"Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles",
		)
		.replace(
			/Port Charlotte, North Port\s*(?:&|and)\s*Venice/gi,
			"Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles",
		)
		.replace(/Port Charlotte and North Port/gi, "Port Charlotte and Charlotte County")
		.trim();
};

/**
 * Apply the public-channel guard to a Sanity result before it reaches a public
 * route. Sanity responses are plain JSON, so recursively walking arrays and
 * records also covers Portable Text spans, SEO fields, FAQs, and referenced
 * service summaries without changing the stored source document.
 */
export const alignPublicContent = <T>(value: T, options: PublicCopyOptions = {}): T => {
	if (typeof value === "string") return alignPublicChannelCopy(value, options) as T;
	if (Array.isArray(value)) return value.map((item) => alignPublicContent(item, options)) as T;
	if (value !== null && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [key, alignPublicContent(item, options)]),
		) as T;
	}
	return value;
};
