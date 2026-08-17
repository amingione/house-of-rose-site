/**
 * Prevent stale CMS copy from republishing business-channel details that have
 * changed more recently than the underlying Sanity documents.
 */
export interface PublicCopyOptions {
	/** Exact-procedure exception confirmed by the owner/provider. */
	allowNoDowntime?: boolean;
}

export interface PublicCopyRisk {
	code: "clinical-claim-review" | "absolute-outcome-review" | "unsupported-treatment-review";
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

	const unsupportedTreatment = value.match(/\bstem[- ]cell (?:treatment|therapy)\b/i);
	if (unsupportedTreatment) {
		risks.push({
			code: "unsupported-treatment-review",
			message: "Remove or verify the unsupported treatment claim at its source.",
			match: unsupportedTreatment[0],
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
		.trim();
};

/**
 * Apply the public-channel guard to a Sanity result before it reaches a public
 * route. The recursion reports risky claims in nested Sanity values and applies
 * only exact entity-name normalization. Visit policy, geography, CTAs, and
 * clinical meaning must be corrected at their owning source instead of being
 * rewritten at runtime.
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
