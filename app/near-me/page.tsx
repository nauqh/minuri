import { NearMeView } from "@/components/near-me/near-me-view";
import { NearMeEntry } from "@/components/near-me/near-me-entry";
import { parseTopic } from "@/lib/near-me";

type NearMePageProps = {
	searchParams: Promise<{
		category?: string;
		suburb?: string;
		from?: string;
		topic?: string;
	}>;
};

export default async function NearMePage({ searchParams }: NearMePageProps) {
	const query = await searchParams;
	const initialTopic = parseTopic(query.topic ?? query.category);
	const initialSuburb = query.suburb ?? "";
	const fromGuide = query.from ?? null;

	if (!initialSuburb.trim()) {
		return <NearMeEntry />;
	}

	return (
		<NearMeView
			initialTopic={initialTopic}
			initialSuburb={initialSuburb}
			fromGuide={fromGuide}
		/>
	);
}
