export function scrollToTopAndHighlightLandingCta() {
	const dispatch = () =>
		window.dispatchEvent(new CustomEvent("minuri:highlight-cta"));

	if (window.scrollY <= 5) {
		dispatch();
		return;
	}

	window.scrollTo({ top: 0, behavior: "smooth" });

	let done = false;
	let fallbackId: number | undefined;

	const teardown = () => {
		window.removeEventListener("scroll", onScroll);
		if (fallbackId !== undefined) window.clearTimeout(fallbackId);
	};

	const onScroll = () => {
		if (done || window.scrollY > 5) return;
		done = true;
		teardown();
		dispatch();
	};

	window.addEventListener("scroll", onScroll, { passive: true });

	fallbackId = window.setTimeout(() => {
		if (done) return;
		done = true;
		teardown();
		if (window.scrollY <= 5) dispatch();
	}, 1800);
}
