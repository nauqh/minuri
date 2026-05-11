export type PersonaId =
    | "mei"
    | "daniel"
    | "priya"
    | "sam"
    | "aiko"
    | "marcus";

export type Persona = {
    id: PersonaId;
    name: string;
    age: number;
    origin: string;
    role: string;
    tagline: string;
    situation: string;
    accentColor: string;
    imageUrl: string;
    journey: string[][];
};

export const PERSONAS: Persona[] = [
    {
        id: "mei",
        name: "Mei",
        age: 21,
        origin: "Shanghai",
        role: "International Student",
        tagline: "I left everything familiar. Where do I even start?",
        situation:
            "First-ever time living alone. Arrived two weeks before semester with a student visa and a list of things to figure out when she got there. Capable and organised — missing the local context everyone else takes for granted.",
        accentColor: "#c96b50",
        imageUrl: "https://images.unsplash.com/photo-1514355315815-2b64b0216b14?w=600&h=800&q=80&fit=crop&auto=format",
        journey: [
            ["your-first-grocery-run", "getting-myki-and-surviving-ptv"],
            ["when-you-dont-know-anyone-yet"],
            ["cooking-5-meals-youll-actually-eat"],
            ["medicare-bulk-billing-and-mental-health-care-plans"],
            ["making-friends-in-a-city-where-everyones-busy"],
            ["homesickness-nobody-warns-you-about"],
            ["when-to-see-a-psych-counsellor-or-friend"],
        ],
    },
    {
        id: "daniel",
        name: "Daniel",
        age: 25,
        origin: "Brisbane",
        role: "Interstate Graduate",
        tagline: "I got the job. Now I need to get a life here.",
        situation:
            "Landed his first real job at a Melbourne design studio. Lived independently since 18, but Melbourne has its own systems and rhythms. His entire social infrastructure is still back in Brisbane.",
        accentColor: "#2f6fab",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&q=80&fit=crop&auto=format",
        journey: [
            ["your-first-48-hours-checklist", "getting-myki-and-surviving-ptv"],
            ["surviving-the-first-weekend-alone"],
            ["finding-your-way-around-melbourne-in-week-one"],
            ["super-and-your-first-paycheck"],
            ["budgeting-on-what-you-actually-earn"],
            ["building-a-local-routine"],
            ["making-friends-in-a-city-where-everyones-busy", "finding-your-community"],
        ],
    },
    {
        id: "priya",
        name: "Priya",
        age: 34,
        origin: "Bangalore",
        role: "Skilled Migrant",
        tagline: "My family needs stability. I need to figure out how everything works here.",
        situation:
            "Arrived with her partner and two-year-old on a skilled visa. Starts a PM role in three weeks. Managed a household and career for years — the local procedural knowledge is the gap.",
        accentColor: "#1f8f88",
        imageUrl: "https://images.unsplash.com/photo-1667382137349-0f5cb5818a7c?w=600&h=800&q=80&fit=crop&auto=format",
        journey: [
            ["your-first-48-hours-checklist", "your-bond-starts-on-day-one"],
            ["finding-a-gp-before-you-need-one"],
            ["emergency-vs-urgent-care-in-melbourne"],
            ["medicare-bulk-billing-and-mental-health-care-plans"],
            ["setting-up-utilities-without-overpaying"],
            ["renting-without-getting-burned"],
            ["tenant-rights-when-things-go-wrong", "finding-your-community"],
        ],
    },
    {
        id: "sam",
        name: "Sam",
        age: 23,
        origin: "Bristol",
        role: "Working Holiday",
        tagline: "I'm here for the adventure. Just need to not run out of money.",
        situation:
            "Here for 12 months on a Working Holiday visa. Not anxious — excited. Needs efficiency: how to get around without draining $20/day on transport, where to eat well under $10.",
        accentColor: "#a07010",
        imageUrl: "https://images.unsplash.com/photo-1754347913567-67f94dccfccc?w=600&h=800&q=80&fit=crop&auto=format",
        journey: [
            ["getting-myki-and-surviving-ptv", "night-transport-and-getting-home-safe"],
            ["cheap-eats-when-broke"],
            ["finding-your-way-around-melbourne-in-week-one"],
            ["free-things-to-do-this-week"],
            ["cycling-melbourne-without-fear"],
            ["meal-prepping-on-a-tight-budget"],
            ["volunteering-as-a-way-in"],
        ],
    },
    {
        id: "aiko",
        name: "Aiko",
        age: 28,
        origin: "Yangon",
        role: "Humanitarian Arrival",
        tagline: "I made it here. Now I need to find my footing.",
        situation:
            "Arrived three months ago through a humanitarian visa pathway. Has caseworker support for housing — the ongoing daily questions she navigates alone. More resilient than most; exhausted in ways hard to describe.",
        accentColor: "#6357a0",
        imageUrl: "https://images.unsplash.com/photo-1617187703472-9508e9d3d198?w=600&h=800&q=80&fit=crop&auto=format",
        journey: [
            ["crisis-lines-you-can-actually-call", "when-you-dont-know-anyone-yet"],
            ["finding-a-gp-before-you-need-one"],
            ["finding-free-community-meals"],
            ["emergency-vs-urgent-care-in-melbourne"],
            ["your-pharmacist-is-the-cheapest-first-stop"],
            ["finding-your-community"],
            ["volunteering-as-a-way-in", "homesickness-nobody-warns-you-about"],
        ],
    },
    {
        id: "marcus",
        name: "Marcus",
        age: 41,
        origin: "London",
        role: "Professional Expat",
        tagline: "I'm senior at work. But here I don't know the basics.",
        situation:
            "Relocated for a senior ops role. Salary solid, accommodation sorted. Discovering that professional competence doesn't transfer into social ease — and nobody warned him about superannuation.",
        accentColor: "#3a5470",
        imageUrl: "https://images.unsplash.com/photo-1764084052707-f0d560ad67cf?w=600&h=800&q=80&fit=crop&auto=format",
        journey: [
            ["your-bond-starts-on-day-one", "your-first-48-hours-checklist"],
            ["super-and-your-first-paycheck"],
            ["renting-without-getting-burned"],
            ["setting-up-utilities-without-overpaying"],
            ["tenant-rights-when-things-go-wrong"],
            ["building-a-local-routine"],
            ["when-to-see-a-psych-counsellor-or-friend", "finding-your-community"],
        ],
    },
];
