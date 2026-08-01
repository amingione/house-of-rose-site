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
