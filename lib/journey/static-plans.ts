import type { GuideTopicSlug } from "@/content/guides";
import type { WeekPlanLLM, DayPlanLLM } from "@/lib/journey/week-plan-store";

export type ArchetypeKey =
  | "first-timer"
  | "far-from-home"
  | "solo-arrival"
  | "reluctant-grownup";

type StaticVariant = { days: DayPlanLLM[] };

const PLANS: Record<ArchetypeKey, { a: StaticVariant; b: StaticVariant }> = {
  "first-timer": {
    // Variant A — practical-first (admin / food / transport selected)
    a: {
      days: [
        {
          day: 1,
          theme: "Home Base",
          short_label: "Home",
          topic: "home-admin",
          narrative:
            "Before you do anything else, document your room and read your lease. These two things protect you for the entire tenancy — ten minutes each, months of security.",
          guides: [
            "your-first-48-hours-checklist",
            "your-bond-starts-on-day-one",
            "renting-without-getting-burned",
          ],
          tasks: [
            "Complete at least 3 items from today's checklist before you sleep.",
            "Take 20 timestamped photos of your room today and email them to yourself.",
            "Read your lease tonight and highlight any clause you don't understand.",
          ],
          memory_line: "What's one thing about your place that surprised you?",
          stamp_label: "First Night",
        },
        {
          day: 2,
          theme: "Feed Yourself",
          short_label: "Food",
          topic: "food-eating",
          narrative:
            "A stocked kitchen is your cheapest support system. Find the supermarket, buy something simple, and build a shortlist of meals you'll actually make — not impressive meals, just reliable ones.",
          guides: [
            "your-first-grocery-run",
            "cheap-eats-when-broke",
            "cooking-5-meals-youll-actually-eat",
          ],
          tasks: [
            "Walk to your nearest supermarket and buy ingredients for 3 simple meals.",
            "Save your 3 cheapest nearby meal options in your phone maps right now.",
            "Write down 5 meals you can reliably cook and buy the ingredients for one.",
          ],
          memory_line: "What did you cook or eat today — easier or harder than expected?",
          stamp_label: null,
        },
        {
          day: 3,
          theme: "Get Moving",
          short_label: "Transport",
          topic: "getting-around",
          narrative:
            "A Myki and thirty minutes with the PTV app unlocks Melbourne. Knowing your five most-used locations and how to get home at night means you're no longer depending on luck.",
          guides: [
            "getting-myki-and-surviving-ptv",
            "finding-your-way-around-melbourne-in-week-one",
            "night-transport-and-getting-home-safe",
          ],
          tasks: [
            "Buy a Myki card at a 7-Eleven or station today and top it up with $20.",
            "Add your 5 most-used locations to your phone maps and plan a route between them.",
            "Find the last train and last tram from your nearest station and save them.",
          ],
          memory_line: "Where did you go today using public transport?",
          stamp_label: null,
        },
        {
          day: 4,
          theme: "Health Sorted",
          short_label: "Health",
          topic: "health-wellbeing",
          narrative:
            "Finding a GP while you're healthy takes ten calm minutes. Doing it sick takes three times as long. Today you set up your healthcare basics — GP, Medicare, pharmacy.",
          guides: [
            "finding-a-gp-before-you-need-one",
            "medicare-bulk-billing-and-mental-health-care-plans",
            "your-pharmacist-is-the-cheapest-first-stop",
          ],
          tasks: [
            "Book a GP appointment online today — even if you feel completely fine.",
            "Check your Medicare eligibility and confirm your GP bulk-bills.",
            "Walk into your nearest pharmacy and introduce yourself — ask about their free advice service.",
          ],
          memory_line: "Did anything about Australian healthcare surprise you today?",
          stamp_label: null,
        },
        {
          day: 5,
          theme: "Money Admin",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "The second wave of admin: your budget, electricity plan, and super. Knowing where your money goes is the difference between managing and being constantly surprised.",
          guides: [
            "budgeting-on-what-you-actually-earn",
            "setting-up-utilities-without-overpaying",
            "super-and-your-first-paycheck",
          ],
          tasks: [
            "List your monthly income and your 5 biggest recurring expenses right now.",
            "Compare two electricity plans on the Victorian Energy Compare website and pick one.",
            "Check if your employer has enrolled you in super — and pick your own fund if not.",
          ],
          memory_line: "What's one financial thing you feel clearer about now?",
          stamp_label: null,
        },
        {
          day: 6,
          theme: "Look Up",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "You've been heads down sorting the practical. Today you look up. Melbourne has a lot of free things to do alone — and those are also where you meet people, without any pressure to.",
          guides: [
            "when-you-dont-know-anyone-yet",
            "free-things-to-do-this-week",
            "making-friends-in-a-city-where-everyones-busy",
          ],
          tasks: [
            "Find one regular local thing — a class, a market, a run club — and put the next date in your calendar.",
            "Find one free event or place in Melbourne this week and add it to your calendar.",
            "Find one low-pressure recurring social option near you and sign up or bookmark it.",
          ],
          memory_line: "Was there a moment today where the city felt a little more like yours?",
          stamp_label: null,
        },
        {
          day: 7,
          theme: "Your Routine",
          short_label: "Routine",
          topic: "getting-around",
          narrative:
            "Week one done. Today isn't about learning something new — it's about turning what you know into a routine. One café, one tram stop, one walk that's starting to feel like yours.",
          guides: [
            "building-a-local-routine",
            "cycling-melbourne-without-fear",
          ],
          tasks: [
            "Write down one recurring weekly thing — a walk, a market, a café — and add it to your calendar.",
            "Plan one safe cycling route near you using the Melways cycle path map.",
          ],
          memory_line: "What's one thing from this week you'd want to repeat?",
          stamp_label: null,
        },
      ],
    },
    // Variant B — connection-first (social / health selected)
    b: {
      days: [
        {
          day: 1,
          theme: "First Meal",
          short_label: "Food",
          topic: "food-eating",
          narrative:
            "Before you figure out anything else, feed yourself. Find the nearest supermarket, buy something simple, make one meal. A stocked kitchen already feels more like home than an empty one.",
          guides: [
            "your-first-grocery-run",
            "cheap-eats-when-broke",
          ],
          tasks: [
            "Walk to your nearest supermarket and buy ingredients for 3 simple meals.",
            "Save your 3 cheapest nearby meal options in your phone maps right now.",
          ],
          memory_line: "Where did you get your first proper meal here?",
          stamp_label: "First Night",
        },
        {
          day: 2,
          theme: "Find Your Spot",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "You don't need to know anyone to be around people. Day two is about finding your first comfortable public spot — a café, a park, a library — somewhere you can sit without it feeling strange.",
          guides: [
            "when-you-dont-know-anyone-yet",
            "surviving-the-first-weekend-alone",
            "free-things-to-do-this-week",
          ],
          tasks: [
            "Find one regular local thing — a class, a market, a run club — and put the next date in your calendar.",
            "Plan Saturday now: one outdoor activity and one meal out, even if you go alone.",
            "Find one free event or place in Melbourne this week and add it to your calendar.",
          ],
          memory_line: "Was there a place today where you felt slightly less like a stranger?",
          stamp_label: null,
        },
        {
          day: 3,
          theme: "Admin Done",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "The admin doesn't disappear by ignoring it. Bond photos, lease clauses, renter rights — thirty minutes today protects months of your rent money. Then you can stop thinking about it.",
          guides: [
            "your-first-48-hours-checklist",
            "your-bond-starts-on-day-one",
            "renting-without-getting-burned",
          ],
          tasks: [
            "Complete at least 3 items from today's checklist before you sleep.",
            "Take 20 timestamped photos of your room today and email them to yourself.",
            "Read your lease tonight and highlight any clause you don't understand.",
          ],
          memory_line: "What's one thing you sorted today that you can stop worrying about?",
          stamp_label: null,
        },
        {
          day: 4,
          theme: "Safety Net",
          short_label: "Health",
          topic: "health-wellbeing",
          narrative:
            "Register for a GP while you're well. Save Beyond Blue's number even if you won't need it. Know where urgent care is. None of this is dramatic — it's just the safety net you deserve to have in place.",
          guides: [
            "finding-a-gp-before-you-need-one",
            "crisis-lines-you-can-actually-call",
            "sustaining-yourself-sleep-movement-and-disconnecting",
          ],
          tasks: [
            "Book a GP appointment online today — even if you feel completely fine.",
            "Save 1800 512 348 (Beyond Blue) in your phone right now.",
            "Pick one thing — a 20-minute walk, a phone-free hour, or a consistent sleep time — and commit to it this week.",
          ],
          memory_line: "How are you actually feeling today?",
          stamp_label: null,
        },
        {
          day: 5,
          theme: "Get Moving",
          short_label: "Transport",
          topic: "getting-around",
          narrative:
            "Melbourne rewards people who learn how to move through it. Get your Myki sorted, map your five most-used locations, and know how to get home when it's late. The city gets smaller every time you navigate it confidently.",
          guides: [
            "getting-myki-and-surviving-ptv",
            "finding-your-way-around-melbourne-in-week-one",
            "night-transport-and-getting-home-safe",
          ],
          tasks: [
            "Buy a Myki card at a 7-Eleven or station today and top it up with $20.",
            "Add your 5 most-used locations to your phone maps and plan a route between them.",
            "Find the last train and last tram from your nearest station and save them.",
          ],
          memory_line: "Where did you travel today? Did you get lost?",
          stamp_label: null,
        },
        {
          day: 6,
          theme: "Find Your People",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "Day six is about taking connection from 'being around people' to 'actually meeting them'. One recurring option is all it takes — the same place, the same time, and eventually familiar faces.",
          guides: [
            "making-friends-in-a-city-where-everyones-busy",
            "finding-your-community",
            "volunteering-as-a-way-in",
          ],
          tasks: [
            "Find one low-pressure recurring social option near you and sign up or bookmark it.",
            "Search for one group that shares your language, culture, or interest in Melbourne and save the details.",
            "Browse Seek Volunteer and save one opportunity that fits your schedule.",
          ],
          memory_line: "Did you speak to anyone new today?",
          stamp_label: null,
        },
        {
          day: 7,
          theme: "Money Admin",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "Last day — the money stuff. Budget, utilities, super. Thirty minutes now means you stop being surprised at the end of each month.",
          guides: [
            "budgeting-on-what-you-actually-earn",
            "setting-up-utilities-without-overpaying",
            "super-and-your-first-paycheck",
          ],
          tasks: [
            "List your monthly income and your 5 biggest recurring expenses right now.",
            "Compare two electricity plans on the Victorian Energy Compare website and pick one.",
            "Check if your employer has enrolled you in super — and pick your own fund if not.",
          ],
          memory_line: "What's one thing about this week that surprised you?",
          stamp_label: null,
        },
      ],
    },
  },

  "far-from-home": {
    // Variant A — emotion-acknowledging first
    a: {
      days: [
        {
          day: 1,
          theme: "Name It",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "The first day is the hardest to name. You're not lost — you know where you are. But the people who make you feel like yourself are very far away. That's worth acknowledging before you do anything else.",
          guides: [
            "homesickness-nobody-warns-you-about",
            "when-you-dont-know-anyone-yet",
            "surviving-the-first-weekend-alone",
          ],
          tasks: [
            "Write one paragraph about what you miss and one about what you're looking forward to.",
            "Find one regular local thing — a class, a market, a run club — and put the next date in your calendar.",
            "Plan Saturday now: one outdoor activity and one meal out, even if you go alone.",
          ],
          memory_line: "Who did you talk to today from home?",
          stamp_label: "First Night",
        },
        {
          day: 2,
          theme: "Feed Yourself",
          short_label: "Food",
          topic: "food-eating",
          narrative:
            "There's something grounding about a meal in your own kitchen. Find the supermarket, make something simple, and give your space a smell that isn't a stranger's.",
          guides: [
            "your-first-grocery-run",
            "cheap-eats-when-broke",
            "finding-free-community-meals",
          ],
          tasks: [
            "Walk to your nearest supermarket and buy ingredients for 3 simple meals.",
            "Save your 3 cheapest nearby meal options in your phone maps right now.",
            "Find one free community meal near your suburb and note the day and time.",
          ],
          memory_line: "Did anything about eating here feel comforting or strange?",
          stamp_label: null,
        },
        {
          day: 3,
          theme: "Admin Done",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "The practical still has to happen. Bond photos, lease, renter rights — getting these sorted means you can stop carrying the anxiety of things left undone.",
          guides: [
            "your-first-48-hours-checklist",
            "your-bond-starts-on-day-one",
            "renting-without-getting-burned",
          ],
          tasks: [
            "Complete at least 3 items from today's checklist before you sleep.",
            "Take 20 timestamped photos of your room today and email them to yourself.",
            "Read your lease tonight and highlight any clause you don't understand.",
          ],
          memory_line: "What's one thing that made your place feel more like yours today?",
          stamp_label: null,
        },
        {
          day: 4,
          theme: "Learn the City",
          short_label: "Transport",
          topic: "getting-around",
          narrative:
            "Learning to move through Melbourne is how it stops feeling foreign. Your tram route, your five key locations, your local corner — these become the geography of a life, not just a temporary place.",
          guides: [
            "getting-myki-and-surviving-ptv",
            "finding-your-way-around-melbourne-in-week-one",
            "building-a-local-routine",
          ],
          tasks: [
            "Buy a Myki card at a 7-Eleven or station today and top it up with $20.",
            "Add your 5 most-used locations to your phone maps and plan a route between them.",
            "Write down one recurring weekly thing — a walk, a market, a café — and add it to your calendar.",
          ],
          memory_line: "Is there a street or spot that's already starting to feel familiar?",
          stamp_label: null,
        },
        {
          day: 5,
          theme: "Look After Yourself",
          short_label: "Health",
          topic: "health-wellbeing",
          narrative:
            "Being far from the people who usually look after you means you become that person for yourself. A GP, your mental health options, and one sustainable daily habit — the care you owe yourself.",
          guides: [
            "finding-a-gp-before-you-need-one",
            "when-to-see-a-psych-counsellor-or-friend",
            "sustaining-yourself-sleep-movement-and-disconnecting",
          ],
          tasks: [
            "Book a GP appointment online today — even if you feel completely fine.",
            "Find one free counselling option near you (headspace, uni, or community) and save the number.",
            "Pick one thing — a 20-minute walk, a phone-free hour, or a consistent sleep time — and commit to it this week.",
          ],
          memory_line: "What's one thing you did today that was just for you?",
          stamp_label: null,
        },
        {
          day: 6,
          theme: "Build Something New",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "You can't replace what you left. But you can build something new alongside it — one community, one recurring thing, one thread worth pulling.",
          guides: [
            "making-friends-in-a-city-where-everyones-busy",
            "finding-your-community",
            "volunteering-as-a-way-in",
          ],
          tasks: [
            "Find one low-pressure recurring social option near you and sign up or bookmark it.",
            "Search for one group that shares your language, culture, or interest in Melbourne and save the details.",
            "Browse Seek Volunteer and save one opportunity that fits your schedule.",
          ],
          memory_line: "Is there someone or somewhere here that made you feel a little less far away?",
          stamp_label: null,
        },
        {
          day: 7,
          theme: "The Foundation",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "Week one ends with the practical that makes staying sustainable — your budget, utilities, and super. The quiet infrastructure of a life you're choosing to build here.",
          guides: [
            "budgeting-on-what-you-actually-earn",
            "setting-up-utilities-without-overpaying",
            "super-and-your-first-paycheck",
          ],
          tasks: [
            "List your monthly income and your 5 biggest recurring expenses right now.",
            "Compare two electricity plans on the Victorian Energy Compare website and pick one.",
            "Check if your employer has enrolled you in super — and pick your own fund if not.",
          ],
          memory_line: "What's one thing about this week that felt like it was actually yours?",
          stamp_label: null,
        },
      ],
    },
    // Variant B — comfort-first, slower emotional arc
    b: {
      days: [
        {
          day: 1,
          theme: "First Meal",
          short_label: "Food",
          topic: "food-eating",
          narrative:
            "Before anything else, feed yourself something familiar. A stocked kitchen in a new place already feels more like somewhere you live — not just somewhere you're staying.",
          guides: [
            "your-first-grocery-run",
            "cheap-eats-when-broke",
            "cooking-5-meals-youll-actually-eat",
          ],
          tasks: [
            "Walk to your nearest supermarket and buy ingredients for 3 simple meals.",
            "Save your 3 cheapest nearby meal options in your phone maps right now.",
            "Write down 5 meals you can reliably cook and buy the ingredients for one.",
          ],
          memory_line: "What's the first thing you cooked or ate that felt like home?",
          stamp_label: "First Night",
        },
        {
          day: 2,
          theme: "Secure Your Space",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "Your room is yours — legally. Bond photos and a read-through of your lease protect the space you're building your new normal in.",
          guides: [
            "your-first-48-hours-checklist",
            "your-bond-starts-on-day-one",
            "renting-without-getting-burned",
          ],
          tasks: [
            "Complete at least 3 items from today's checklist before you sleep.",
            "Take 20 timestamped photos of your room today and email them to yourself.",
            "Read your lease tonight and highlight any clause you don't understand.",
          ],
          memory_line: "Is your place starting to feel any more like home?",
          stamp_label: null,
        },
        {
          day: 3,
          theme: "Name What You Feel",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "The longing for what you left is real and doesn't need explaining. Alongside it, there's one small thing you can do this week to be around people here — even one low-pressure option.",
          guides: [
            "homesickness-nobody-warns-you-about",
            "when-you-dont-know-anyone-yet",
            "surviving-the-first-weekend-alone",
          ],
          tasks: [
            "Write one paragraph about what you miss and one about what you're looking forward to.",
            "Find one regular local thing — a class, a market, a run club — and put the next date in your calendar.",
            "Plan Saturday now: one outdoor activity and one meal out, even if you go alone.",
          ],
          memory_line: "Did you do anything today that wasn't just surviving?",
          stamp_label: null,
        },
        {
          day: 4,
          theme: "Learn the City",
          short_label: "Transport",
          topic: "getting-around",
          narrative:
            "Knowing how to move through Melbourne matters. A Myki and a mental map of your key locations turns a foreign city into something navigable — which is a version of belonging.",
          guides: [
            "getting-myki-and-surviving-ptv",
            "finding-your-way-around-melbourne-in-week-one",
            "night-transport-and-getting-home-safe",
          ],
          tasks: [
            "Buy a Myki card at a 7-Eleven or station today and top it up with $20.",
            "Add your 5 most-used locations to your phone maps and plan a route between them.",
            "Find the last train and last tram from your nearest station and save them.",
          ],
          memory_line: "Where did you explore today?",
          stamp_label: null,
        },
        {
          day: 5,
          theme: "Look After Yourself",
          short_label: "Health",
          topic: "health-wellbeing",
          narrative:
            "Being far from home means setting up your own support network. A GP and knowing your mental health options is how you build the professional version of someone looking out for you.",
          guides: [
            "finding-a-gp-before-you-need-one",
            "medicare-bulk-billing-and-mental-health-care-plans",
            "when-to-see-a-psych-counsellor-or-friend",
          ],
          tasks: [
            "Book a GP appointment online today — even if you feel completely fine.",
            "Check your Medicare eligibility and confirm your GP bulk-bills.",
            "Find one free counselling option near you (headspace, uni, or community) and save the number.",
          ],
          memory_line: "How are you doing, honestly?",
          stamp_label: null,
        },
        {
          day: 6,
          theme: "Find Your People",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "Melbourne has community in every suburb — cultural, creative, casual. Today you find one thing that might become yours.",
          guides: [
            "making-friends-in-a-city-where-everyones-busy",
            "finding-your-community",
            "free-things-to-do-this-week",
          ],
          tasks: [
            "Find one low-pressure recurring social option near you and sign up or bookmark it.",
            "Search for one group that shares your language, culture, or interest in Melbourne and save the details.",
            "Find one free event or place in Melbourne this week and add it to your calendar.",
          ],
          memory_line: "Was there a moment today where Melbourne felt a bit less unfamiliar?",
          stamp_label: null,
        },
        {
          day: 7,
          theme: "Your Routine",
          short_label: "Routine",
          topic: "getting-around",
          narrative:
            "Routine is the slow alchemy of turning somewhere new into somewhere yours. One walk, one regular café, one route you stop thinking about — that's how this city starts to feel like home.",
          guides: [
            "building-a-local-routine",
            "cycling-melbourne-without-fear",
          ],
          tasks: [
            "Write down one recurring weekly thing — a walk, a market, a café — and add it to your calendar.",
            "Plan one safe cycling route near you using the Melways cycle path map.",
          ],
          memory_line: "What part of this week would you want to keep doing?",
          stamp_label: null,
        },
      ],
    },
  },

  "solo-arrival": {
    // Variant A — social-forward
    a: {
      days: [
        {
          day: 1,
          theme: "Find Your Ground",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "Everyone who has a full life in Melbourne started from zero. The first move isn't finding friends — it's finding the places where friends eventually happen.",
          guides: [
            "when-you-dont-know-anyone-yet",
            "surviving-the-first-weekend-alone",
            "free-things-to-do-this-week",
          ],
          tasks: [
            "Find one regular local thing — a class, a market, a run club — and put the next date in your calendar.",
            "Plan Saturday now: one outdoor activity and one meal out, even if you go alone.",
            "Find one free event or place in Melbourne this week and add it to your calendar.",
          ],
          memory_line: "Did you talk to anyone today, even briefly?",
          stamp_label: "First Night",
        },
        {
          day: 2,
          theme: "Feed Yourself",
          short_label: "Food",
          topic: "food-eating",
          narrative:
            "Eating alone in a new city is its own thing. Markets and community meals are comfortable solo experiences that also happen to be full of people — both at once.",
          guides: [
            "your-first-grocery-run",
            "cheap-eats-when-broke",
            "finding-free-community-meals",
          ],
          tasks: [
            "Walk to your nearest supermarket and buy ingredients for 3 simple meals.",
            "Save your 3 cheapest nearby meal options in your phone maps right now.",
            "Find one free community meal near your suburb and note the day and time.",
          ],
          memory_line: "Where did you eat today — alone or with someone?",
          stamp_label: null,
        },
        {
          day: 3,
          theme: "Get Moving",
          short_label: "Transport",
          topic: "getting-around",
          narrative:
            "Knowing how to move independently gives you options. Options are the raw material of a social life. Get your Myki and learn your five key locations — then you're not waiting for someone to show you around.",
          guides: [
            "getting-myki-and-surviving-ptv",
            "finding-your-way-around-melbourne-in-week-one",
            "night-transport-and-getting-home-safe",
          ],
          tasks: [
            "Buy a Myki card at a 7-Eleven or station today and top it up with $20.",
            "Add your 5 most-used locations to your phone maps and plan a route between them.",
            "Find the last train and last tram from your nearest station and save them.",
          ],
          memory_line: "Where did you end up today that you hadn't planned?",
          stamp_label: null,
        },
        {
          day: 4,
          theme: "Home Base",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "The practical needs doing. Bond photos, lease, renter rights — thirty minutes to secure your home base so you can focus on building everything else.",
          guides: [
            "your-first-48-hours-checklist",
            "your-bond-starts-on-day-one",
            "renting-without-getting-burned",
          ],
          tasks: [
            "Complete at least 3 items from today's checklist before you sleep.",
            "Take 20 timestamped photos of your room today and email them to yourself.",
            "Read your lease tonight and highlight any clause you don't understand.",
          ],
          memory_line: "Does your place feel more stable today than it did on day one?",
          stamp_label: null,
        },
        {
          day: 5,
          theme: "Safety Net",
          short_label: "Health",
          topic: "health-wellbeing",
          narrative:
            "When you're building a life from scratch, it's easy to let your own wellbeing slide. A GP and a crisis line mean you're not doing this entirely alone — even when it feels that way.",
          guides: [
            "finding-a-gp-before-you-need-one",
            "crisis-lines-you-can-actually-call",
            "sustaining-yourself-sleep-movement-and-disconnecting",
          ],
          tasks: [
            "Book a GP appointment online today — even if you feel completely fine.",
            "Save 1800 512 348 (Beyond Blue) in your phone right now.",
            "Pick one thing — a 20-minute walk, a phone-free hour, or a consistent sleep time — and commit to it this week.",
          ],
          memory_line: "Have you been looking after yourself this week?",
          stamp_label: null,
        },
        {
          day: 6,
          theme: "Go Deeper",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "By now you have some footing. Day six is about taking one deliberate step toward a recurring social thing — not a crowd, just one option that repeats.",
          guides: [
            "making-friends-in-a-city-where-everyones-busy",
            "finding-your-community",
            "volunteering-as-a-way-in",
          ],
          tasks: [
            "Find one low-pressure recurring social option near you and sign up or bookmark it.",
            "Search for one group that shares your language, culture, or interest in Melbourne and save the details.",
            "Browse Seek Volunteer and save one opportunity that fits your schedule.",
          ],
          memory_line: "What's one thing you did this week that you'd call 'showing up'?",
          stamp_label: null,
        },
        {
          day: 7,
          theme: "Your Routine",
          short_label: "Routine",
          topic: "getting-around",
          narrative:
            "A routine is how you stop being a visitor. One regular spot, one familiar route — that's how a city becomes somewhere you actually live.",
          guides: [
            "building-a-local-routine",
            "cycling-melbourne-without-fear",
          ],
          tasks: [
            "Write down one recurring weekly thing — a walk, a market, a café — and add it to your calendar.",
            "Plan one safe cycling route near you using the Melways cycle path map.",
          ],
          memory_line: "Is there anywhere that's starting to feel like yours?",
          stamp_label: null,
        },
      ],
    },
    // Variant B — practical-first, slower social build
    b: {
      days: [
        {
          day: 1,
          theme: "Home Base",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "You're here. Your room is yours. Make it secure first — bond photos, lease, your rights as a renter. That takes the uncertainty out of your foundation.",
          guides: [
            "your-first-48-hours-checklist",
            "your-bond-starts-on-day-one",
            "renting-without-getting-burned",
          ],
          tasks: [
            "Complete at least 3 items from today's checklist before you sleep.",
            "Take 20 timestamped photos of your room today and email them to yourself.",
            "Read your lease tonight and highlight any clause you don't understand.",
          ],
          memory_line: "How does your room feel right now?",
          stamp_label: "First Night",
        },
        {
          day: 2,
          theme: "Feed Yourself",
          short_label: "Food",
          topic: "food-eating",
          narrative:
            "A stocked kitchen and three reliable meals — not impressive meals, just reliable ones — is the quiet infrastructure of not feeling stranded.",
          guides: [
            "your-first-grocery-run",
            "cheap-eats-when-broke",
            "cooking-5-meals-youll-actually-eat",
          ],
          tasks: [
            "Walk to your nearest supermarket and buy ingredients for 3 simple meals.",
            "Save your 3 cheapest nearby meal options in your phone maps right now.",
            "Write down 5 meals you can reliably cook and buy the ingredients for one.",
          ],
          memory_line: "What did you make or eat today?",
          stamp_label: null,
        },
        {
          day: 3,
          theme: "Find Your Spot",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "Knowing no one is a real starting point, not a failure. Today you find one comfortable public place where it doesn't feel strange to just be — a café, a park, a library.",
          guides: [
            "when-you-dont-know-anyone-yet",
            "free-things-to-do-this-week",
            "homesickness-nobody-warns-you-about",
          ],
          tasks: [
            "Find one regular local thing — a class, a market, a run club — and put the next date in your calendar.",
            "Find one free event or place in Melbourne this week and add it to your calendar.",
            "Write one paragraph about what you miss and one about what you're looking forward to.",
          ],
          memory_line: "Was there a place today where you felt like you could stay?",
          stamp_label: null,
        },
        {
          day: 4,
          theme: "Get Moving",
          short_label: "Transport",
          topic: "getting-around",
          narrative:
            "Being mobile is how Melbourne opens up. Your Myki and five key locations let you navigate on your own terms — no one's schedule but yours.",
          guides: [
            "getting-myki-and-surviving-ptv",
            "finding-your-way-around-melbourne-in-week-one",
            "night-transport-and-getting-home-safe",
          ],
          tasks: [
            "Buy a Myki card at a 7-Eleven or station today and top it up with $20.",
            "Add your 5 most-used locations to your phone maps and plan a route between them.",
            "Find the last train and last tram from your nearest station and save them.",
          ],
          memory_line: "Where did you go today that was new?",
          stamp_label: null,
        },
        {
          day: 5,
          theme: "Health Sorted",
          short_label: "Health",
          topic: "health-wellbeing",
          narrative:
            "Healthcare sorted while you're healthy: GP, Medicare, nearest pharmacy. Three tasks, one afternoon, long-term peace of mind.",
          guides: [
            "finding-a-gp-before-you-need-one",
            "medicare-bulk-billing-and-mental-health-care-plans",
            "your-pharmacist-is-the-cheapest-first-stop",
          ],
          tasks: [
            "Book a GP appointment online today — even if you feel completely fine.",
            "Check your Medicare eligibility and confirm your GP bulk-bills.",
            "Walk into your nearest pharmacy and introduce yourself — ask about their free advice service.",
          ],
          memory_line: "Is there something health-related you've been avoiding dealing with?",
          stamp_label: null,
        },
        {
          day: 6,
          theme: "Go Deeper",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "By now you have some footing. Day six is about taking one intentional step toward the social life you're building — one recurring thing that puts you around people who share something with you.",
          guides: [
            "making-friends-in-a-city-where-everyones-busy",
            "finding-your-community",
            "volunteering-as-a-way-in",
          ],
          tasks: [
            "Find one low-pressure recurring social option near you and sign up or bookmark it.",
            "Search for one group that shares your language, culture, or interest in Melbourne and save the details.",
            "Browse Seek Volunteer and save one opportunity that fits your schedule.",
          ],
          memory_line: "Did you speak to someone new today?",
          stamp_label: null,
        },
        {
          day: 7,
          theme: "Money Admin",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "Budget, utilities, super. Knowing where you stand financially means you stop white-knuckling every week.",
          guides: [
            "budgeting-on-what-you-actually-earn",
            "setting-up-utilities-without-overpaying",
            "super-and-your-first-paycheck",
          ],
          tasks: [
            "List your monthly income and your 5 biggest recurring expenses right now.",
            "Compare two electricity plans on the Victorian Energy Compare website and pick one.",
            "Check if your employer has enrolled you in super — and pick your own fund if not.",
          ],
          memory_line: "What's the one thing from this week that surprised you?",
          stamp_label: null,
        },
      ],
    },
  },

  "reluctant-grownup": {
    // Variant A — grounded, practical-first
    a: {
      days: [
        {
          day: 1,
          theme: "This Is Yours",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "You might not have chosen every part of how you got here. But this is your place now — legally, officially, yours. Starting with the admin means you're not leaving the important stuff to chance.",
          guides: [
            "your-first-48-hours-checklist",
            "your-bond-starts-on-day-one",
            "renting-without-getting-burned",
          ],
          tasks: [
            "Complete at least 3 items from today's checklist before you sleep.",
            "Take 20 timestamped photos of your room today and email them to yourself.",
            "Read your lease tonight and highlight any clause you don't understand.",
          ],
          memory_line: "Is there one thing about your space that already feels like it might be okay?",
          stamp_label: "First Night",
        },
        {
          day: 2,
          theme: "Feed Yourself",
          short_label: "Food",
          topic: "food-eating",
          narrative:
            "Feeding yourself properly is one of the first things that starts to feel like an actual life rather than an extended crisis. Find the supermarket and five meals you can reliably make.",
          guides: [
            "your-first-grocery-run",
            "cheap-eats-when-broke",
            "cooking-5-meals-youll-actually-eat",
          ],
          tasks: [
            "Walk to your nearest supermarket and buy ingredients for 3 simple meals.",
            "Save your 3 cheapest nearby meal options in your phone maps right now.",
            "Write down 5 meals you can reliably cook and buy the ingredients for one.",
          ],
          memory_line: "What did you eat today, and who made it?",
          stamp_label: null,
        },
        {
          day: 3,
          theme: "Get Moving",
          short_label: "Transport",
          topic: "getting-around",
          narrative:
            "Mobility is a form of control. Knowing your tram routes and your five key locations means you're not dependent on circumstances to get anywhere. That matters.",
          guides: [
            "getting-myki-and-surviving-ptv",
            "finding-your-way-around-melbourne-in-week-one",
            "building-a-local-routine",
          ],
          tasks: [
            "Buy a Myki card at a 7-Eleven or station today and top it up with $20.",
            "Add your 5 most-used locations to your phone maps and plan a route between them.",
            "Write down one recurring weekly thing — a walk, a market, a café — and add it to your calendar.",
          ],
          memory_line: "Where did you go today that was entirely your choice?",
          stamp_label: null,
        },
        {
          day: 4,
          theme: "Look Up",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "You're not obligated to have a full social life yet. But being around people — even strangers in a café or a park — is different from being alone in your room. Today you find one place that doesn't require anything from you.",
          guides: [
            "when-you-dont-know-anyone-yet",
            "free-things-to-do-this-week",
            "making-friends-in-a-city-where-everyones-busy",
          ],
          tasks: [
            "Find one regular local thing — a class, a market, a run club — and put the next date in your calendar.",
            "Find one free event or place in Melbourne this week and add it to your calendar.",
            "Find one low-pressure recurring social option near you and sign up or bookmark it.",
          ],
          memory_line: "Was there a moment today that felt unexpectedly okay?",
          stamp_label: null,
        },
        {
          day: 5,
          theme: "Your Safety Net",
          short_label: "Health",
          topic: "health-wellbeing",
          narrative:
            "The transition you're in is genuinely hard, even when it looks manageable from the outside. Finding a GP and knowing your mental health options changes what's available to you on a hard night.",
          guides: [
            "finding-a-gp-before-you-need-one",
            "crisis-lines-you-can-actually-call",
            "when-to-see-a-psych-counsellor-or-friend",
          ],
          tasks: [
            "Book a GP appointment online today — even if you feel completely fine.",
            "Save 1800 512 348 (Beyond Blue) in your phone right now.",
            "Find one free counselling option near you (headspace, uni, or community) and save the number.",
          ],
          memory_line: "How are you actually doing?",
          stamp_label: null,
        },
        {
          day: 6,
          theme: "Pull a Thread",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "Not every arrival is chosen. But staying — actively staying, finding your people, making something of where you are — that's a choice you make every day. Today you find one thread to pull.",
          guides: [
            "finding-your-community",
            "volunteering-as-a-way-in",
            "homesickness-nobody-warns-you-about",
          ],
          tasks: [
            "Search for one group that shares your language, culture, or interest in Melbourne and save the details.",
            "Browse Seek Volunteer and save one opportunity that fits your schedule.",
            "Write one paragraph about what you miss and one about what you're looking forward to.",
          ],
          memory_line: "Is there anything here that's starting to feel like it might be yours?",
          stamp_label: null,
        },
        {
          day: 7,
          theme: "The Foundation",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "Financial clarity is grounding. Knowing what you earn, what you spend, and that your future self is being looked after — that's not boring, it's the scaffolding of a life.",
          guides: [
            "budgeting-on-what-you-actually-earn",
            "setting-up-utilities-without-overpaying",
            "super-and-your-first-paycheck",
          ],
          tasks: [
            "List your monthly income and your 5 biggest recurring expenses right now.",
            "Compare two electricity plans on the Victorian Energy Compare website and pick one.",
            "Check if your employer has enrolled you in super — and pick your own fund if not.",
          ],
          memory_line: "What's one decision from this week that you made entirely for yourself?",
          stamp_label: null,
        },
      ],
    },
    // Variant B — exploration-first, city as discovery
    b: {
      days: [
        {
          day: 1,
          theme: "Just Move",
          short_label: "Transport",
          topic: "getting-around",
          narrative:
            "Before the admin, before the unpacking — move. Get a Myki. Take a tram somewhere. Melbourne makes more sense when you're moving through it.",
          guides: [
            "getting-myki-and-surviving-ptv",
            "finding-your-way-around-melbourne-in-week-one",
            "night-transport-and-getting-home-safe",
          ],
          tasks: [
            "Buy a Myki card at a 7-Eleven or station today and top it up with $20.",
            "Add your 5 most-used locations to your phone maps and plan a route between them.",
            "Find the last train and last tram from your nearest station and save them.",
          ],
          memory_line: "Where did you end up today?",
          stamp_label: "First Night",
        },
        {
          day: 2,
          theme: "Explore the Food",
          short_label: "Food",
          topic: "food-eating",
          narrative:
            "Explore the food first — the markets, the cheap local places, the things worth trying. A neighbourhood reveals itself through what you eat in it. This isn't just about groceries.",
          guides: [
            "your-first-grocery-run",
            "cheap-eats-when-broke",
            "cooking-5-meals-youll-actually-eat",
          ],
          tasks: [
            "Walk to your nearest supermarket and buy ingredients for 3 simple meals.",
            "Save your 3 cheapest nearby meal options in your phone maps right now.",
            "Write down 5 meals you can reliably cook and buy the ingredients for one.",
          ],
          memory_line: "What's the best thing you ate today, and where?",
          stamp_label: null,
        },
        {
          day: 3,
          theme: "Admin Done",
          short_label: "Admin",
          topic: "home-admin",
          narrative:
            "Bond photos, lease, renter rights — getting these done this week means you can stop carrying the anxiety of things left undone.",
          guides: [
            "your-first-48-hours-checklist",
            "your-bond-starts-on-day-one",
            "renting-without-getting-burned",
          ],
          tasks: [
            "Complete at least 3 items from today's checklist before you sleep.",
            "Take 20 timestamped photos of your room today and email them to yourself.",
            "Read your lease tonight and highlight any clause you don't understand.",
          ],
          memory_line: "What's one thing you sorted today that you'd been putting off?",
          stamp_label: null,
        },
        {
          day: 4,
          theme: "Health Sorted",
          short_label: "Health",
          topic: "health-wellbeing",
          narrative:
            "Independence means you're the one who arranges your own healthcare now. A bulk-billing GP and a clear understanding of Medicare — before you need it urgently.",
          guides: [
            "finding-a-gp-before-you-need-one",
            "medicare-bulk-billing-and-mental-health-care-plans",
            "sustaining-yourself-sleep-movement-and-disconnecting",
          ],
          tasks: [
            "Book a GP appointment online today — even if you feel completely fine.",
            "Check your Medicare eligibility and confirm your GP bulk-bills.",
            "Pick one thing — a 20-minute walk, a phone-free hour, or a consistent sleep time — and commit to it this week.",
          ],
          memory_line: "What are you doing to look after yourself this week?",
          stamp_label: null,
        },
        {
          day: 5,
          theme: "Be Somewhere",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "You don't have to have your social life figured out yet. But being somewhere that isn't your room — a market, a park — is the difference between being in Melbourne and just existing in it.",
          guides: [
            "when-you-dont-know-anyone-yet",
            "surviving-the-first-weekend-alone",
            "free-things-to-do-this-week",
          ],
          tasks: [
            "Find one regular local thing — a class, a market, a run club — and put the next date in your calendar.",
            "Plan Saturday now: one outdoor activity and one meal out, even if you go alone.",
            "Find one free event or place in Melbourne this week and add it to your calendar.",
          ],
          memory_line: "Was there a moment today that felt genuinely good?",
          stamp_label: null,
        },
        {
          day: 6,
          theme: "Go Deeper",
          short_label: "Connect",
          topic: "social-belonging",
          narrative:
            "Day six is about going deeper — not just being around people, but finding one recurring thing that could become a regular part of your life here.",
          guides: [
            "making-friends-in-a-city-where-everyones-busy",
            "finding-your-community",
            "volunteering-as-a-way-in",
          ],
          tasks: [
            "Find one low-pressure recurring social option near you and sign up or bookmark it.",
            "Search for one group that shares your language, culture, or interest in Melbourne and save the details.",
            "Browse Seek Volunteer and save one opportunity that fits your schedule.",
          ],
          memory_line: "Did anything feel like the beginning of something?",
          stamp_label: null,
        },
        {
          day: 7,
          theme: "Make It Yours",
          short_label: "Routine",
          topic: "getting-around",
          narrative:
            "The week ends the way a life here starts — turning the new into the familiar. One regular route, one recurring thing, one spot that's becoming yours. That's the beginning of choosing to stay.",
          guides: [
            "building-a-local-routine",
            "cycling-melbourne-without-fear",
          ],
          tasks: [
            "Write down one recurring weekly thing — a walk, a market, a café — and add it to your calendar.",
            "Plan one safe cycling route near you using the Melways cycle path map.",
          ],
          memory_line: "What part of this week felt most like you?",
          stamp_label: null,
        },
      ],
    },
  },
};

const PERSONAL_TOPICS: GuideTopicSlug[] = ["social-belonging", "health-wellbeing"];

export function buildStaticWeekPlan(
  archetype: string,
  selectedTopics: GuideTopicSlug[],
): WeekPlanLLM {
  const key: ArchetypeKey =
    archetype in PLANS ? (archetype as ArchetypeKey) : "first-timer";
  const plans = PLANS[key];
  const usePersonal = selectedTopics.some((t) => PERSONAL_TOPICS.includes(t));
  const variant = usePersonal ? plans.b : plans.a;
  return { days: variant.days };
}
