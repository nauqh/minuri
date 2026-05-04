"use client";

import { useEffect } from "react";

export function ScrollbarController() {
	useEffect(() => {
		const show = () =>
			document.documentElement.classList.add("scrollbar-visible");
		const hide = () =>
			document.documentElement.classList.remove("scrollbar-visible");

		const onMouseMove = (e: MouseEvent) => {
			// clientWidth excludes the scrollbar in all browsers — anything
			// to the right of it is the scrollbar gutter.
			const contentWidth = document.documentElement.clientWidth;
			if (e.clientX >= contentWidth) {
				show();
			} else {
				hide();
			}
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseleave", hide);

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseleave", hide);
		};
	}, []);

	return null;
}
