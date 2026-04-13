import { NearMeView } from "@/components/near-me/near-me-view";
import { parseTopic } from "@/lib/near-me";

type NearMePageProps = {
	searchParams: Promise<{ category?: string; suburb?: string }>;
};

export default async function NearMePage({ searchParams }: NearMePageProps) {
	const query = await searchParams;
	const initialTopic = parseTopic(query.category);
	const initialSuburb = query.suburb ?? "";

	return (
		<NearMeView initialTopic={initialTopic} initialSuburb={initialSuburb} />
	);
}
