import type { GuideTopicSlug } from "@/content/guides";

type SpeciesDayTemplate = {
  day: number;
  theme: string;
  shortLabel: string;
  topicSlug: GuideTopicSlug;
  guideSlugs: string[];
  narrative: string;
};

export type SpeciesPlan = {
  days: SpeciesDayTemplate[];
};

export const SPECIES_PLANS: Record<string, SpeciesPlan> = {
  // Independent, self-directed — practical first, social last
  pioneer: {
    days: [
      {
        day: 1,
        theme: "Arrive & Sort",
        shortLabel: "Arrive",
        topicSlug: "home-admin",
        guideSlugs: ["your-first-48-hours-checklist", "your-bond-starts-on-day-one"],
        narrative:
          "You've landed. Before anything else, take twenty minutes with this checklist — it's not about doing everything, it's about knowing what the first few days actually require of you.",
      },
      {
        day: 2,
        theme: "Start Moving",
        shortLabel: "Move",
        topicSlug: "getting-around",
        guideSlugs: ["getting-myki-and-surviving-ptv", "finding-your-way-around-melbourne-in-week-one"],
        narrative:
          "Melbourne opens up once you know how to move through it. Today is about getting your Myki sorted and learning the five routes that will carry you through the first month.",
      },
      {
        day: 3,
        theme: "Stock the Kitchen",
        shortLabel: "Food",
        topicSlug: "food-eating",
        guideSlugs: ["your-first-grocery-run", "cheap-eats-when-broke"],
        narrative:
          "Your kitchen is your cheapest ally. One grocery run and a short list of nearby cheap eats means you never have to make food a daily decision.",
      },
      {
        day: 4,
        theme: "Money & Shelter",
        shortLabel: "Admin",
        topicSlug: "home-admin",
        guideSlugs: ["budgeting-on-what-you-actually-earn", "renting-without-getting-burned"],
        narrative:
          "A budget and a lease you understand are two quiet forms of protection. Today you build one and check the other.",
      },
      {
        day: 5,
        theme: "Health Baseline",
        shortLabel: "Health",
        topicSlug: "health-wellbeing",
        guideSlugs: ["finding-a-gp-before-you-need-one", "medicare-bulk-billing-and-mental-health-care-plans"],
        narrative:
          "Finding a GP and understanding Medicare is admin — but it's the kind that protects future you. Today you do both while you're healthy enough to do them calmly.",
      },
      {
        day: 6,
        theme: "Build a Rhythm",
        shortLabel: "Routine",
        topicSlug: "getting-around",
        guideSlugs: ["building-a-local-routine", "cycling-melbourne-without-fear"],
        narrative:
          "Routine is what turns a new city into home. Today you identify the recurring patterns — a route, a place, a time — that will make Melbourne feel familiar.",
      },
      {
        day: 7,
        theme: "Step Out",
        shortLabel: "Connect",
        topicSlug: "social-belonging",
        guideSlugs: ["when-you-dont-know-anyone-yet", "free-things-to-do-this-week"],
        narrative:
          "You've sorted the essentials. Now the city asks something different: to show up somewhere, for something. One small step outward is all today needs.",
      },
    ],
  },

  // Health-conscious, grounded — health first, connection last
  settler: {
    days: [
      {
        day: 1,
        theme: "Ground Yourself",
        shortLabel: "Health",
        topicSlug: "health-wellbeing",
        guideSlugs: ["finding-a-gp-before-you-need-one", "medicare-bulk-billing-and-mental-health-care-plans"],
        narrative:
          "Start with health. Getting a GP and understanding Medicare is the foundation everything else rests on — especially in a city you don't know yet.",
      },
      {
        day: 2,
        theme: "Make It Home",
        shortLabel: "Home",
        topicSlug: "home-admin",
        guideSlugs: ["your-first-48-hours-checklist", "renting-without-getting-burned"],
        narrative:
          "A place that feels safe is what you're building this week. Today you get familiar with the basics of your rental and the checklist of essentials that make a new space liveable.",
      },
      {
        day: 3,
        theme: "Tend to Yourself",
        shortLabel: "Wellbeing",
        topicSlug: "health-wellbeing",
        guideSlugs: ["sustaining-yourself-sleep-movement-and-disconnecting", "when-to-see-a-psych-counsellor-or-friend"],
        narrative:
          "Arriving somewhere new costs energy you can't always see. Today is about the quieter kind of health — sleep, movement, knowing where to go when things get hard.",
      },
      {
        day: 4,
        theme: "Feed Yourself Well",
        shortLabel: "Food",
        topicSlug: "food-eating",
        guideSlugs: ["your-first-grocery-run", "cooking-5-meals-youll-actually-eat"],
        narrative:
          "A reliable grocery run and five meals you actually eat is more grounding than it sounds. Food is routine, and routine is stability.",
      },
      {
        day: 5,
        theme: "Know Your Options",
        shortLabel: "Care",
        topicSlug: "health-wellbeing",
        guideSlugs: ["emergency-vs-urgent-care-in-melbourne", "your-pharmacist-is-the-cheapest-first-stop"],
        narrative:
          "Before you need them, find them. Your nearest urgent care. Your pharmacist. These are the small preparations that change the shape of a hard day.",
      },
      {
        day: 6,
        theme: "Get Moving",
        shortLabel: "Move",
        topicSlug: "getting-around",
        guideSlugs: ["getting-myki-and-surviving-ptv", "building-a-local-routine"],
        narrative:
          "Melbourne rewards people who learn to move through it. Today you get mobile and start identifying the rhythm that will carry you through the weeks ahead.",
      },
      {
        day: 7,
        theme: "Reach Out",
        shortLabel: "Connect",
        topicSlug: "social-belonging",
        guideSlugs: ["when-you-dont-know-anyone-yet", "homesickness-nobody-warns-you-about"],
        narrative:
          "You've been careful with yourself this week. Today you extend that care outward — one small connection, one honest acknowledgment of where you are.",
      },
    ],
  },

  // Practical, admin-first — sorted before social
  builder: {
    days: [
      {
        day: 1,
        theme: "First Things First",
        shortLabel: "Setup",
        topicSlug: "home-admin",
        guideSlugs: ["your-first-48-hours-checklist", "your-bond-starts-on-day-one"],
        narrative:
          "Today is the most practical day of your week, and that's exactly right. Your checklist and your bond documentation are the two things that protect everything else.",
      },
      {
        day: 2,
        theme: "Money Foundation",
        shortLabel: "Money",
        topicSlug: "home-admin",
        guideSlugs: ["budgeting-on-what-you-actually-earn", "super-and-your-first-paycheck"],
        narrative:
          "A budget that reflects what you actually earn and a super fund you've chosen — not just defaulted into — give you real control from day one.",
      },
      {
        day: 3,
        theme: "Get Mobile",
        shortLabel: "Move",
        topicSlug: "getting-around",
        guideSlugs: ["getting-myki-and-surviving-ptv", "finding-your-way-around-melbourne-in-week-one"],
        narrative:
          "Sorted. Mobile. A Myki and a working knowledge of your key routes — that's today done right.",
      },
      {
        day: 4,
        theme: "Admin Complete",
        shortLabel: "Admin",
        topicSlug: "home-admin",
        guideSlugs: ["setting-up-utilities-without-overpaying", "tenant-rights-when-things-go-wrong"],
        narrative:
          "Utilities and tenant rights are the kind of unsexy knowledge that saves you real money and real stress later. Today you lock them in.",
      },
      {
        day: 5,
        theme: "Health Sorted",
        shortLabel: "Health",
        topicSlug: "health-wellbeing",
        guideSlugs: ["finding-a-gp-before-you-need-one", "emergency-vs-urgent-care-in-melbourne"],
        narrative:
          "One GP. One Medicare card. It takes forty minutes and it's done. Today you protect future you from a harder version of the same task.",
      },
      {
        day: 6,
        theme: "Feed Yourself",
        shortLabel: "Food",
        topicSlug: "food-eating",
        guideSlugs: ["your-first-grocery-run", "meal-prepping-on-a-tight-budget"],
        narrative:
          "Your kitchen deserves the same attention as your spreadsheet. A grocery run and a meal prep session means next week costs you less and decides itself.",
      },
      {
        day: 7,
        theme: "Open the Door",
        shortLabel: "Connect",
        topicSlug: "social-belonging",
        guideSlugs: ["when-you-dont-know-anyone-yet", "finding-your-community"],
        narrative:
          "You've built something solid this week. Now one door worth opening: a community, a place, a person. Just one.",
      },
    ],
  },

  // Socially driven — connection before admin
  openheart: {
    days: [
      {
        day: 1,
        theme: "You're Not Alone",
        shortLabel: "Belong",
        topicSlug: "social-belonging",
        guideSlugs: ["when-you-dont-know-anyone-yet", "homesickness-nobody-warns-you-about"],
        narrative:
          "Before the admin, before the logistics — this. The loneliness and the homesickness are real, and naming them is the first step. You're not the only one who's felt this way in week one.",
      },
      {
        day: 2,
        theme: "Get the Basics",
        shortLabel: "Basics",
        topicSlug: "home-admin",
        guideSlugs: ["your-first-48-hours-checklist", "renting-without-getting-burned"],
        narrative:
          "The practical stuff won't wait forever. Today you work through the essentials so they stop sitting in the background of everything else.",
      },
      {
        day: 3,
        theme: "Eat & Find People",
        shortLabel: "Food",
        topicSlug: "food-eating",
        guideSlugs: ["your-first-grocery-run", "finding-free-community-meals"],
        narrative:
          "Food is where connection starts in this city. Community meals, markets, the café where people actually talk — today you find the ones near you.",
      },
      {
        day: 4,
        theme: "How to Meet People",
        shortLabel: "Friends",
        topicSlug: "social-belonging",
        guideSlugs: ["making-friends-in-a-city-where-everyones-busy", "surviving-the-first-weekend-alone"],
        narrative:
          "Making friends in a new city requires two things: repeated exposure and low-pressure settings. Today you find your options before you need them.",
      },
      {
        day: 5,
        theme: "Start Moving",
        shortLabel: "Move",
        topicSlug: "getting-around",
        guideSlugs: ["getting-myki-and-surviving-ptv", "building-a-local-routine"],
        narrative:
          "Melbourne opens up when you can move through it. Your Myki and a local routine are what let you get to the places where connection happens.",
      },
      {
        day: 6,
        theme: "Find Your People",
        shortLabel: "Community",
        topicSlug: "social-belonging",
        guideSlugs: ["finding-your-community", "volunteering-as-a-way-in"],
        narrative:
          "There's a community here that shares your language, your values, or your interests. Today you start looking — and volunteering is one of the most efficient ways in.",
      },
      {
        day: 7,
        theme: "Celebrate Being Here",
        shortLabel: "Celebrate",
        topicSlug: "social-belonging",
        guideSlugs: ["free-things-to-do-this-week", "finding-a-gp-before-you-need-one"],
        narrative:
          "You made it through your first week. Today has one task: go somewhere. A free event, a park, a market. Melbourne's been waiting to meet you.",
      },
    ],
  },
};
