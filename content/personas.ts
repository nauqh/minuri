export type PersonaId =
    | "sam"
    | "priya"
    | "jordan"
    | "chloe"
    | "tom"
    | "mei";

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
        id: "sam",
        name: "Sam",
        age: 19,
        origin: "Bendigo VIC",
        role: "Uni Fresher",
        tagline: "I'm surrounded by people but completely on my own.",
        situation:
            "First year at Monash Clayton. His mum handled every meal, appointment and bill at home. Never booked a GP, doesn't know what Myki zones are, surviving on $14 pad thai because he doesn't know where else to go.",
        accentColor: "#a07010",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fHww",
        journey: [
            ["your-first-48-hours-checklist", "your-first-grocery-run"],
            ["getting-myki-and-surviving-ptv", "finding-your-way-around-melbourne-in-week-one"],
            ["cooking-5-meals-youll-actually-eat", "cheap-eats-when-broke"],
            ["when-you-dont-know-anyone-yet", "surviving-the-first-weekend-alone"],
            ["finding-a-gp-before-you-need-one", "medicare-bulk-billing-and-mental-health-care-plans"],
            ["budgeting-on-what-you-actually-earn", "setting-up-utilities-without-overpaying"],
            ["making-friends-in-a-city-where-everyones-busy", "free-things-to-do-this-week"],
        ],
    },
    {
        id: "priya",
        name: "Priya",
        age: 22,
        origin: "India",
        role: "International Student",
        tagline: "I'm terrified of getting sick when I don't know how anything works here.",
        situation:
            "Studying at UniMelb, first time in Australia. No Medicare card, no idea how the healthcare system works. Managing housing admin for the first time with no family to call.",
        accentColor: "#1f8f88",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
        journey: [
            ["your-first-48-hours-checklist", "finding-a-gp-before-you-need-one"],
            ["medicare-bulk-billing-and-mental-health-care-plans", "managing-your-prescriptions-in-a-new-city"],
            ["emergency-vs-urgent-care-in-melbourne", "your-pharmacist-is-the-cheapest-first-stop"],
            ["your-bond-starts-on-day-one", "setting-up-utilities-without-overpaying"],
            ["getting-myki-and-surviving-ptv", "finding-your-way-around-melbourne-in-week-one"],
            ["when-you-dont-know-anyone-yet", "homesickness-nobody-warns-you-about"],
            ["finding-your-community", "volunteering-as-a-way-in"],
        ],
    },
    {
        id: "jordan",
        name: "Jordan",
        age: 24,
        origin: "Brisbane",
        role: "Career Starter",
        tagline: "I got the job. Now I need to get a life here.",
        situation:
            "Moved from Brisbane for his first full-time role in the CBD. Grew up with parents managing all admin. Time-poor and needs finances, home setup and daily logistics sorted without letting health slide.",
        accentColor: "#2f6fab",
        imageUrl: "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
        journey: [
            ["your-first-48-hours-checklist", "your-bond-starts-on-day-one"],
            ["budgeting-on-what-you-actually-earn", "super-and-your-first-paycheck"],
            ["setting-up-utilities-without-overpaying", "renting-without-getting-burned"],
            ["getting-myki-and-surviving-ptv", "night-transport-and-getting-home-safe"],
            ["cooking-5-meals-youll-actually-eat", "meal-prepping-on-a-tight-budget"],
            ["finding-a-gp-before-you-need-one", "when-to-see-a-psych-counsellor-or-friend"],
            ["making-friends-in-a-city-where-everyones-busy", "finding-your-community"],
        ],
    },
    {
        id: "chloe",
        name: "Chloe",
        age: 21,
        origin: "Sydney",
        role: "Anxious Transferee",
        tagline: "I need to know I'll be okay before I can think about anything else.",
        situation:
            "Transferred from Sydney to Melbourne mid-degree. Struggles with anxiety and finds sudden change overwhelming. Living alone for the first time — needs a safety net sorted before anything practical.",
        accentColor: "#6357a0",
        imageUrl: "https://images.unsplash.com/photo-1614204424926-196a80bf0be8?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
        journey: [
            ["crisis-lines-you-can-actually-call", "finding-a-gp-before-you-need-one"],
            ["emergency-vs-urgent-care-in-melbourne", "when-to-see-a-psych-counsellor-or-friend"],
            ["your-pharmacist-is-the-cheapest-first-stop", "managing-your-prescriptions-in-a-new-city"],
            ["when-you-dont-know-anyone-yet", "homesickness-nobody-warns-you-about"],
            ["sustaining-yourself-sleep-movement-disconnecting", "building-a-local-routine"],
            ["your-first-grocery-run", "cheap-eats-when-broke"],
            ["surviving-the-first-weekend-alone", "finding-your-community"],
        ],
    },
    {
        id: "tom",
        name: "Tom",
        age: 26,
        origin: "Melbourne",
        role: "First-Time Renter",
        tagline: "The practical gaps are bigger than I expected.",
        situation:
            "Lived with family until 26. Never signed a lease, set up a utility account, or thought about what a bond is. Moving into his first rental with a stable job but zero experience with admin his parents used to handle invisibly.",
        accentColor: "#3a5470",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXQlMjBtYW58ZW58MHx8MHx8fDA%3D",
        journey: [
            ["your-first-48-hours-checklist", "your-bond-starts-on-day-one"],
            ["renting-without-getting-burned", "tenant-rights-when-things-go-wrong"],
            ["setting-up-utilities-without-overpaying", "budgeting-on-what-you-actually-earn"],
            ["super-and-your-first-paycheck", "medicare-bulk-billing-and-mental-health-care-plans"],
            ["your-first-grocery-run", "cooking-5-meals-youll-actually-eat"],
            ["getting-myki-and-surviving-ptv", "cycling-melbourne-without-fear"],
            ["building-a-local-routine", "free-things-to-do-this-week"],
        ],
    },
    {
        id: "mei",
        name: "Mei",
        age: 20,
        origin: "China",
        role: "International Student",
        tagline: "Every dollar is accounted for. I can't afford to get this wrong.",
        situation:
            "Studying at RMIT. Grocery costs, transport costs and activity costs all matter. Needs to stretch her budget as far as possible, find free ways to spend time, and connect with community without spending money she doesn't have.",
        accentColor: "#c96b50",
        imageUrl: "https://images.unsplash.com/photo-1552699611-e2c208d5d9cf?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcnRyYWl0JTIwd29tYW58ZW58MHx8MHx8fDA%3D",
        journey: [
            ["your-first-grocery-run", "your-first-48-hours-checklist"],
            ["cheap-eats-when-broke", "meal-prepping-on-a-tight-budget"],
            ["getting-myki-and-surviving-ptv", "cycling-melbourne-without-fear"],
            ["finding-free-community-meals", "free-things-to-do-this-week"],
            ["finding-a-gp-before-you-need-one", "medicare-bulk-billing-and-mental-health-care-plans"],
            ["when-you-dont-know-anyone-yet", "finding-your-community"],
            ["volunteering-as-a-way-in", "homesickness-nobody-warns-you-about"],
        ],
    },
];
