/**
 * Prevent stale CMS copy from republishing business-channel details that have
 * changed more recently than the underlying Sanity documents.
 */
export const alignPublicChannelCopy = (value: string): string =>
	value
		.replaceAll("House of Rose LLC", "House of Rose Aesthetics LLC")
		.replace(/call\s*(?:or|\/)\s*text/gi, "call")
		.replace(/online booking menu/gi, "services menu")
		.replace(/online booking/gi, "services menu")
		.replace(/book online/gi, "review the services menu")
		.replace(/stem[- ]cell treatment/gi, "cell-based treatment")
		.replace(/stem[- ]cell therapy/gi, "cell-based therapy")
		.replace(
			/instant, camera-ready glow with zero downtime[^.]*\.?/gi,
			"A customizable facial for visible hydration, surface texture, and a fresh, well-rested look.",
		)
		.replace(
			/an instant, no[- ]downtime lift\s*[-—]\s*warm radiofrequency that tightens and firms the face, jawline, and neck\.?/gi,
			"Warm radiofrequency considered for the appearance of firmness across the face, jawline, and neck.",
		)
		.replace(
			/the most natural glow there is\s*[-—]\s*your own growth factors, layered over a Glo2Facial\.?/gi,
			"An adjunct that pairs your own platelet-derived factors with a Glo2Facial when clinically appropriate.",
		)
		.replace(
			/the no[- ]downtime peel that resurfaces tone, texture, and glow\s*[-—]\s*walk in dull,?\s*walk out[^.]*\.?/gi,
			"A professional peel focused on visible surface tone and texture.",
		)
		.replace(/walk in dull,?\s*walk out[^.]*\./gi, "A professional peel focused on surface tone and texture.")
		.replace(/\bthe no[- ]downtime peel\b/gi, "A professional peel")
		.replace(/\ba no[- ]downtime resurfacing peel\b/gi, "a professional resurfacing peel")
		.replace(/\bno[- ]downtime resurfacing\b/gi, "professional resurfacing")
		.replace(/\bno[- ]downtime lift\b/gi, "radiofrequency treatment")
		.replace(/\bno-peel,?\s*no[- ]downtime resurfacer\b/gi, "professional resurfacing peel")
		.replace(
			/\b(?:with )?no needles and (?:no|zero)[- ]downtime\b/gi,
			"without needles; recovery expectations are reviewed beforehand",
		)
		.replace(
			/\bzero needles and zero[- ]downtime\b/gi,
			"without needles, with recovery expectations discussed beforehand",
		)
		.replace(
			/\b(?:zero|almost no|essentially no)[- ]downtime\b/gi,
			"recovery expectations reviewed in advance",
		)
		.replace(/\bno[- ]downtime\b/gi, "recovery expectations reviewed in advance")
		.replace(/\bpain[- ]free\b/gi, "with comfort considerations discussed beforehand")
		.replace(/\bguaranteed results?\b/gi, "results that vary by person")
		.replace(/\bglowy\b/gi, "fresh-looking")
		.replace(/\bglowing\b/gi, "healthy-looking")
		.replace(/\bglow\b/gi, "healthy-looking finish")
		.replace(/\bradiance\b/gi, "even-looking tone")
		.replace(/\bradiant\b/gi, "even-looking")
		.replace(/\bflawless\b/gi, "even-looking")
		.replace(/\bageless\b/gi, "long-term")
		.replace(/\bluxury\b|\bluxe\b/gi, "considered")
		.replace(/\bpremium\b/gi, "professional")
		.replace(/\bboutique\b/gi, "medical aesthetics")
		.replace(/\bpamper(?:ing|ed)?\b/gi, "care for")
		.replace(/\bindulge(?:nt)?\b/gi, "choose")
		.replace(/\btreat yourself\b/gi, "make time for care")
		.replace(/\bbest version of yourself\b/gi, "your stated goals")
		.replace(/\bturn back (?:the )?(?:time|clock)\b/gi, "address visible concerns")
		.replace(/\binstant transformation\b/gi, "measured change")
		.replace(/\bplastic[- ]surgery[- ]grade\b/gi, "provider-selected")
		.replace(/\bmedical[- ]grade\b/gi, "professional")
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
		.replace(
			/fully reversible results/gi,
			"potentially adjustable results when clinically appropriate",
		);

/**
 * Apply the public-channel guard to a Sanity result before it reaches a public
 * route. Sanity responses are plain JSON, so recursively walking arrays and
 * records also covers Portable Text spans, SEO fields, FAQs, and referenced
 * service summaries without changing the stored source document.
 */
export const alignPublicContent = <T>(value: T): T => {
	if (typeof value === "string") return alignPublicChannelCopy(value) as T;
	if (Array.isArray(value)) return value.map((item) => alignPublicContent(item)) as T;
	if (value !== null && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [key, alignPublicContent(item)]),
		) as T;
	}
	return value;
};
