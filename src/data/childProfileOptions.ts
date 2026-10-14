// ── Child profile: tiles, questions and pick lists ──────────
// Edit the lists here — labels can change freely, but keep each `code` stable once real data exists:
// answers are stored as codes so they can be counted for (opt-in, anonymous) research.

export type SectionId =
  | "love" | "dislikes" | "diagnosis" | "hard" | "helps" | "communication" | "senses" | "school" | "safety";

export type GroupKind = "multi" | "single" | "text" | "diagnosis";

export interface Option { code: string; label: string }

export interface Group {
  id: string;
  label: string;
  kind: GroupKind;
  options?: Option[];
  /** Show the "+ Add your own" line under the list. */
  allowOwn?: boolean;
  placeholder?: string;
}

export interface Section {
  id: SectionId;
  title: string;
  /** Shown under the title inside the panel. */
  hint: string;
  groups: Group[];
}

const o = (pairs: [string, string][]): Option[] => pairs.map(([code, label]) => ({ code, label }));

export const DIAGNOSIS_STATUS = {
  diagnosed: "Diagnosed",
  awaiting: "Awaiting assessment",
  suspected: "Suspected",
} as const;
export type DiagnosisStatus = keyof typeof DIAGNOSIS_STATUS;

export const SECTIONS: Section[] = [
  {
    id: "love",
    title: "Things I love",
    hint: "Interests and favourite things — great for clubs and therapists to know.",
    groups: [{
      id: "likes", label: "Things I love", kind: "multi", allowOwn: true, options: o([
        ["dinosaurs", "Dinosaurs"], ["trains", "Trains"], ["vehicles", "Cars and vehicles"], ["animals", "Animals"],
        ["space", "Space"], ["science", "Science"], ["building", "Lego and building"], ["music", "Music"],
        ["dancing", "Dancing"], ["drawing", "Drawing and art"], ["swimming", "Swimming"], ["water_play", "Water play"],
        ["trampolining", "Trampolining"], ["outdoors", "Outdoors and nature"], ["sport", "Sport"],
        ["video_games", "Video games"], ["books", "Books and stories"], ["superheroes", "Superheroes"],
        ["cooking", "Cooking and baking"], ["numbers", "Numbers and maths"], ["puzzles", "Puzzles"],
        ["sensory_toys", "Sensory toys"], ["films", "Films and TV"], ["playground", "Playgrounds"],
      ]),
    }],
  },
  {
    id: "dislikes",
    title: "Not for me",
    hint: "Things that upset me or that I'd rather avoid.",
    groups: [{
      id: "dislikes", label: "Not for me", kind: "multi", allowOwn: true, options: o([
        ["loud_noises", "Loud noises"], ["crowds", "Crowds"], ["bright_lights", "Bright lights"],
        ["clothing", "Clothing labels and textures"], ["haircuts", "Haircuts"], ["hand_dryers", "Hand dryers"],
        ["waiting", "Waiting"], ["routine_changes", "Changes to routine"], ["unexpected_touch", "Unexpected touch"],
        ["smells", "Strong smells"], ["food_textures", "Mixed food textures"], ["busy_shops", "Busy shops"],
        ["teeth", "Teeth brushing"], ["new_people", "Meeting new people"], ["transitions", "Stopping a favourite activity"],
      ]),
    }],
  },
  {
    id: "diagnosis",
    title: "Diagnosis",
    hint: "Completely optional. You don't need a diagnosis, or to know what it might be.",
    groups: [{
      id: "diagnosis_stage", label: "Where are things at?", kind: "single", options: o([
        ["has_diagnosis", "We have a diagnosis"], ["waiting", "Waiting for an assessment"],
        ["not_sure", "We think something's going on, but we're not sure what"],
        ["no_diagnosis", "No diagnosis"], ["prefer_not", "Prefer not to say"],
      ]),
    }, {
      id: "diagnoses", label: "Tick any that apply, then say where you are with each", kind: "diagnosis", allowOwn: true, options: o([
        ["autism", "Autism"], ["adhd", "ADHD"], ["dyslexia", "Dyslexia"], ["dyspraxia", "Dyspraxia (DCD)"],
        ["dyscalculia", "Dyscalculia"], ["dysgraphia", "Dysgraphia"],
        ["dld", "Developmental language disorder"], ["speech_sound", "Speech sound disorder"],
        ["sensory_processing", "Sensory processing differences"], ["gdd", "Global developmental delay"],
        ["learning_disability", "Learning disability"], ["down_syndrome", "Down syndrome"],
        ["cerebral_palsy", "Cerebral palsy"], ["epilepsy", "Epilepsy"], ["hearing", "Hearing impairment"],
        ["visual", "Visual impairment"], ["tourettes", "Tourette's"], ["ocd", "OCD"], ["anxiety", "Anxiety"],
        ["pda", "PDA profile"], ["selective_mutism", "Selective mutism"], ["fasd", "FASD"],
        ["fragile_x", "Fragile X"], ["hypermobility", "Hypermobility"],
        ["rare_genetic", "Rare genetic condition"],
      ]),
    }],
  },
  {
    id: "hard",
    title: "What I find hard",
    hint: "What's tricky at the moment — no diagnosis needed.",
    groups: [{
      id: "struggles", label: "What I find hard", kind: "multi", allowOwn: true, options: o([
        ["speech", "Speech and communication"], ["friendships", "Friendships and social situations"],
        ["big_feelings", "Big feelings and meltdowns"], ["anxiety", "Anxiety and worries"], ["sleep", "Sleep"],
        ["eating", "Eating"], ["toileting", "Toileting"], ["attention", "Attention and focus"],
        ["learning", "Learning, reading and writing"], ["fine_motor", "Handwriting and fine motor skills"],
        ["coordination", "Movement and coordination"], ["sensory_overload", "Sensory overload"],
        ["transitions", "Transitions and change"], ["school", "School or EHCP"],
        ["school_attendance", "Going to school"],
      ]),
    }],
  },
  {
    id: "helps",
    title: "What helps me",
    hint: "What's working well — the things that make a good day more likely.",
    groups: [
      {
        id: "helps", label: "What's working well", kind: "multi", allowOwn: true, options: o([
          ["visual_timetable", "Visual timetable"], ["now_next", "Now-and-Next board"], ["ear_defenders", "Ear defenders"],
          ["fidget_toys", "Fidget toys"], ["movement_breaks", "Movement breaks"], ["quiet_space", "A quiet space"],
          ["social_stories", "Social stories"], ["timers", "Countdown timers"], ["weighted_blanket", "Weighted blanket"],
          ["routine", "A predictable routine"], ["choice_boards", "Choice boards"], ["makaton", "Makaton or signing"],
          ["therapy_strategies", "Therapy strategies"], ["one_to_one", "1:1 support"], ["warnings", "Warnings before changes"],
        ]),
      },
      { id: "calming", label: "When I'm overwhelmed, it helps to…", kind: "text", placeholder: "e.g. give me space, dim the lights, offer my headphones" },
    ],
  },
  {
    id: "communication",
    title: "How I communicate",
    hint: "How I get my message across, and how to tell how I'm feeling.",
    groups: [
      {
        id: "comms", label: "How I communicate", kind: "multi", allowOwn: true, options: o([
          ["sentences", "Full sentences"], ["some_words", "Some words"], ["signing", "Makaton or signing"],
          ["pecs", "PECS or symbols"], ["aac", "Communication device (AAC)"], ["non_speaking", "Non-speaking"],
          ["echolalia", "Repeating phrases (echolalia)"], ["gestures", "Pointing and gestures"],
        ]),
      },
      { id: "feelings", label: "How I show I'm happy, upset or in pain", kind: "text", placeholder: "e.g. flaps hands when excited, goes quiet when upset" },
    ],
  },
  {
    id: "senses",
    title: "Senses",
    hint: "What's too much for me, and what I seek out.",
    groups: [
      {
        id: "too_much", label: "Too much for me", kind: "multi", allowOwn: true, options: o([
          ["noise", "Noise"], ["light", "Bright light"], ["touch", "Light touch"], ["textures", "Textures"],
          ["smells", "Smells"], ["tastes", "Tastes"], ["crowds", "Busy places"], ["heat", "Heat"],
        ]),
      },
      {
        id: "seeks", label: "Things I seek out", kind: "multi", allowOwn: true, options: o([
          ["spinning", "Spinning"], ["deep_pressure", "Deep pressure"], ["chewing", "Chewing"], ["jumping", "Jumping"],
          ["rocking", "Rocking"], ["swinging", "Swinging"], ["water", "Water"], ["music", "Music"], ["touching", "Touching textures"],
        ]),
      },
    ],
  },
  {
    id: "school",
    title: "School & support",
    hint: "No school names — just the type of setting and the support in place.",
    groups: [
      {
        id: "school_type", label: "Setting", kind: "single", options: o([
          ["nursery", "Nursery or pre-school"], ["mainstream", "Mainstream school"], ["mainstream_unit", "Mainstream with a SEN unit"],
          ["special", "Special school"], ["home_ed", "Home educated"], ["not_in_school", "Not currently in school"],
        ]),
      },
      {
        id: "year_group", label: "Year group", kind: "single", options: o([
          ["preschool", "Pre-school"], ["reception", "Reception"], ["y1_2", "Year 1–2"], ["y3_6", "Year 3–6"],
          ["y7_9", "Year 7–9"], ["y10_11", "Year 10–11"], ["y12_plus", "Year 12+"],
        ]),
      },
      {
        id: "ehcp", label: "EHCP", kind: "single", options: o([
          ["none", "No EHCP"], ["applying", "Applying"], ["has", "Has an EHCP"], ["not_sure", "Not sure"],
        ]),
      },
      {
        id: "support_now", label: "Support we have now", kind: "multi", allowOwn: true, options: o([
          ["slt", "Speech and language therapy"], ["ot", "Occupational therapy"], ["physio", "Physiotherapy"],
          ["camhs", "CAMHS"], ["ed_psych", "Educational psychologist"], ["portage", "Portage"],
          ["play_therapy", "Play or music therapy"], ["sen_support", "SEN support at school"],
        ]),
      },
      {
        id: "waiting", label: "On a waiting list for", kind: "multi", allowOwn: true, options: o([
          ["assessment", "Assessment or diagnosis"], ["slt", "Speech and language therapy"], ["ot", "Occupational therapy"],
          ["camhs", "CAMHS"], ["ed_psych", "Educational psychologist"], ["ehcp", "EHCP decision"],
        ]),
      },
    ],
  },
  {
    id: "safety",
    title: "Safety & more",
    hint: "Things clubs and carers need to know, and anything else you'd like to say.",
    groups: [
      {
        id: "allergies", label: "Allergies", kind: "multi", allowOwn: true, options: o([
          ["none", "No allergies"], ["nuts", "Nuts"], ["dairy", "Dairy"], ["egg", "Egg"], ["gluten", "Gluten"],
          ["latex", "Latex"], ["plasters", "Plasters"],
        ]),
      },
      {
        id: "personal_care", label: "Needs help with personal care", kind: "single", options: o([
          ["no", "No"], ["sometimes", "Sometimes"], ["yes", "Yes"],
        ]),
      },
      { id: "hopes", label: "Our hopes", kind: "text", placeholder: "What would you love to happen next?" },
      { id: "anything_else", label: "Anything else I'd like you to know", kind: "text", placeholder: "Anything that helps people get to know me" },
    ],
  },
];

export const sectionById = (id: SectionId) => SECTIONS.find((s) => s.id === id)!;
