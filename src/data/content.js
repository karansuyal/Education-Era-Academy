// ============================================================
// EDIT ME: This is the ONLY file you should need to touch to
// update text content across the whole site — name, phone,
// batches, faculty, results, fees, FAQs, blog posts, quiz.
// Components just read from here and render it.
// ============================================================

export const siteInfo = {
  name: "Education Era",
  nameSuffix: "Academy",
  tagline: "Foundation to Final Rank.",
  phone: "+91 8191837568",
  whatsappNumber: "+91 8191837568", // country code + number, no + or spaces
  email: "maheshkumar750023@gmail.com",
  address: "Awas Vikas, Rudrapur, Uttarakhand",
  mapEmbedUrl: "", // paste a Google Maps embed src URL here to show a map
}

export const stats = [
  { num: "1,200+", label: "students mentored" },
  { num: "90%", label: "selection / improvement rate" },
  { num: "10", label: "years teaching in Rudrapur" },
]

export const whyPoints = [
  { code: "RN-01", title: "Small batch size", desc: "Capped batches so every student is actually seen — not just seated." },
  { code: "RN-02", title: "Daily doubt clearing", desc: "An hour set aside every evening, no appointment needed, no extra fee." },
  { code: "RN-03", title: "Weekly test + rank card", desc: "Every Saturday a test, every Monday a rank card — progress is visible, not assumed." },
  { code: "RN-04", title: "Parent updates", desc: "Monthly attendance and performance shared directly with parents." },
]

export const batches = [
  {
    code: "BATCH / FND-9-10",
    title: "Foundation — Class 9 & 10",
    desc: "Maths, Science, English — building fundamentals for board exams and future competitive prep.",
    meta: ["Mon–Sat · 2 hrs/day", "Weekly tests"],
    featured: false,
  },
  {
    code: "BATCH / SCI-11-12",
    title: "Class 11 & 12 — Science (PCM/PCB)",
    desc: "Maths, Physics, Chemistry, aligned to boards with competitive-exam problem solving built in.",
    meta: ["Mon–Sat · 2 hrs/day", "Board + entrance pattern"],
    featured: true,
  },
  {
    code: "BATCH / GOVT-EXAM",
    title: "Government Exam Preparation",
    desc: "SSC/CGL, Army(Agniveer,Airforce), State PSC — reasoning, quant, GK & English.",
    meta: ["Morning & evening slots", "Mock tests every week"],
    featured: false,
  },
]

// ============================================================
// NOTES SECTION — Class -> Subject -> Chapters -> Notes/Video
// EDIT ME:
// - Chapter names below follow the NCERT (CBSE-aligned, Uttarakhand
//   board) 2025-26 syllabus. NCERT is currently rolling out revised
//   "rationalized" textbooks year by year — if your session's book has
//   different chapter names/order, just edit the `title` values below,
//   the structure will keep working exactly the same.
// - `youtubeId` = the part after "v=" in a YouTube URL
//   (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ -> "dQw4w9WgXcQ").
//   You can set one video per subject, or per chapter if you want to be
//   more specific — both fields exist below.
// - For each note, `link` should point to a PDF placed in public/notes/
//   (e.g. put the file at public/notes/physics-ch1.pdf and set
//   link: "/notes/physics-ch1.pdf"). Leave link: "" to hide the
//   download button and show "Coming soon" instead.
// ============================================================

// helper so we don't have to repeat { id, title, notes: [], youtubeId: '' }
// for every single chapter by hand
const mkChapters = (titles) =>
  titles.map((title, i) => ({ id: `ch-${i + 1}`, title, youtubeId: "", notes: [] }))

export const classesData = [
  {
    id: "class-9",
    label: "Class 9",
    subjects: [
      {
        id: "class-9-maths",
        name: "Mathematics",
        youtubeId: "", // EDIT ME: subject-level video (optional)
        chapters: mkChapters([
          "Number Systems",
          "Polynomials",
          "Coordinate Geometry",
          "Linear Equations in Two Variables",
          "Introduction to Euclid's Geometry",
          "Lines and Angles",
          "Triangles",
          "Quadrilaterals",
          "Circles",
          "Heron's Formula",
          "Surface Areas and Volumes",
          "Statistics",
        ]),
      },
      {
        id: "class-9-science",
        name: "Science",
        youtubeId: "",
        chapters: mkChapters([
          "Matter in Our Surroundings",
          "Is Matter Around Us Pure",
          "Atoms and Molecules",
          "Structure of the Atom",
          "The Fundamental Unit of Life",
          "Tissues",
          "Motion",
          "Force and Laws of Motion",
          "Gravitation",
          "Work and Energy",
          "Sound",
          "Improvement in Food Resources",
        ]),
      },
    ],
  },
  {
    id: "class-10",
    label: "Class 10",
    subjects: [
      {
        id: "class-10-maths",
        name: "Mathematics",
        youtubeId: "",
        chapters: mkChapters([
          "Real Numbers",
          "Polynomials",
          "Pair of Linear Equations in Two Variables",
          "Quadratic Equations",
          "Arithmetic Progressions",
          "Triangles",
          "Coordinate Geometry",
          "Introduction to Trigonometry",
          "Some Applications of Trigonometry",
          "Circles",
          "Areas Related to Circles",
          "Surface Areas and Volumes",
          "Statistics",
          "Probability",
        ]),
      },
      {
        id: "class-10-science",
        name: "Science",
        youtubeId: "",
        chapters: mkChapters([
          "Chemical Reactions and Equations",
          "Acids, Bases and Salts",
          "Metals and Non-metals",
          "Carbon and its Compounds",
          "Life Processes",
          "Control and Coordination",
          "How do Organisms Reproduce?",
          "Heredity and Evolution",
          "Light — Reflection and Refraction",
          "The Human Eye and the Colourful World",
          "Electricity",
          "Magnetic Effects of Electric Current",
          "Our Environment",
        ]),
      },
    ],
  },
  {
    id: "class-11",
    label: "Class 11",
    subjects: [
      {
        id: "class-11-maths",
        name: "Mathematics",
        youtubeId: "KEddsa_lXLU", // set from your latest YouTube link
        chapters: mkChapters([
          "Sets",
          "Relations and Functions",
          "Trigonometric Functions",
          "Complex Numbers and Quadratic Equations",
          "Linear Inequalities",
          "Permutations and Combinations",
          "Binomial Theorem",
          "Sequences and Series",
          "Straight Lines",
          "Conic Sections",
          "Introduction to Three Dimensional Geometry",
          "Limits and Derivatives",
          "Statistics",
          "Probability",
        ]),
      },
      {
        id: "class-11-physics",
        name: "Physics",
        youtubeId: "",
        chapters: mkChapters([
          "Units and Measurements",
          "Motion in a Straight Line",
          "Motion in a Plane",
          "Laws of Motion",
          "Work, Energy and Power",
          "System of Particles and Rotational Motion",
          "Gravitation",
          "Mechanical Properties of Solids",
          "Mechanical Properties of Fluids",
          "Thermal Properties of Matter",
          "Thermodynamics",
          "Kinetic Theory",
          "Oscillations",
          "Waves",
        ]),
      },
      {
        id: "class-11-chemistry",
        name: "Chemistry",
        youtubeId: "",
        chapters: mkChapters([
          "Some Basic Concepts of Chemistry",
          "Structure of Atom",
          "Classification of Elements and Periodicity in Properties",
          "Chemical Bonding and Molecular Structure",
          "States of Matter",
          "Thermodynamics",
          "Equilibrium",
          "Redox Reactions",
          "The p-Block Elements (Group 13 & 14)",
          "Organic Chemistry — Some Basic Principles and Techniques",
          "Hydrocarbons",
        ]),
      },
    ],
  },
  {
    id: "class-12",
    label: "Class 12",
    subjects: [
      {
        id: "class-12-maths",
        name: "Mathematics",
        youtubeId: "",
        chapters: mkChapters([
          "Relations and Functions",
          "Inverse Trigonometric Functions",
          "Matrices",
          "Determinants",
          "Continuity and Differentiability",
          "Application of Derivatives",
          "Integrals",
          "Application of Integrals",
          "Differential Equations",
          "Vector Algebra",
          "Three Dimensional Geometry",
          "Linear Programming",
          "Probability",
        ]),
      },
      {
        id: "class-12-physics",
        name: "Physics",
        youtubeId: "",
        chapters: mkChapters([
          "Electric Charges and Fields",
          "Electrostatic Potential and Capacitance",
          "Current Electricity",
          "Moving Charges and Magnetism",
          "Magnetism and Matter",
          "Electromagnetic Induction",
          "Alternating Current",
          "Electromagnetic Waves",
          "Ray Optics and Optical Instruments",
          "Wave Optics",
          "Dual Nature of Radiation and Matter",
          "Atoms",
          "Nuclei",
          "Semiconductor Electronics",
        ]),
      },
      {
        id: "class-12-chemistry",
        name: "Chemistry",
        youtubeId: "",
        chapters: mkChapters([
          "The Solid State",
          "Solutions",
          "Electrochemistry",
          "Chemical Kinetics",
          "The p-Block Elements",
          "The d and f Block Elements",
          "Coordination Compounds",
          "Haloalkanes and Haloarenes",
          "Alcohols, Phenols and Ethers",
          "Aldehydes, Ketones and Carboxylic Acids",
          "Amines",
          "Biomolecules",
        ]),
      },
    ],
  },
  {
    id: "government",
    label: "Government Exam",
    subjects: [
      {
        id: "govt-reasoning",
        name: "Reasoning",
        youtubeId: "",
        chapters: mkChapters([
          "Analogy & Classification",
          "Series Completion",
          "Coding-Decoding",
          "Blood Relations",
          "Direction Sense",
          "Syllogism",
          "Puzzle & Seating Arrangement",
        ]),
      },
      {
        id: "govt-quant",
        name: "Quantitative Aptitude",
        youtubeId: "",
        chapters: mkChapters([
          "Number System",
          "Percentage",
          "Profit & Loss",
          "Simple & Compound Interest",
          "Time, Speed & Distance",
          "Ratio & Proportion",
          "Data Interpretation",
        ]),
      },
      {
        id: "govt-english",
        name: "English",
        youtubeId: "",
        chapters: mkChapters([
          "Reading Comprehension",
          "Error Spotting",
          "Fill in the Blanks",
          "Synonyms & Antonyms",
          "Para Jumbles",
        ]),
      },
      {
        id: "govt-ga",
        name: "General Awareness",
        youtubeId: "",
        chapters: mkChapters([
          "Static GK",
          "Current Affairs",
          "Indian Polity",
          "Geography",
          "History",
        ]),
      },
    ],
  },
]

export const faculty = [
  { initials: "PS", name: "Prof. — Physics", detail: "M.Sc. Physics · 10+ years teaching Class 11-12 & competitive exam physics." },
  { initials: "CM", name: "Prof. — Chemistry", detail: "M.Sc. Chemistry · Specialist in Organic & Physical Chemistry for boards." },
  { initials: "MT", name: "Prof. — Mathematics", detail: "M.Sc. Maths · Focus on problem-solving speed for competitive exams." },
  { initials: "GA", name: "Prof. — Reasoning & GA", detail: "Govt. exam specialist · 8+ years training SSC & Banking aspirants." },
]

export const results = [
  { tag: "AIR 412", name: "Student Name", exam: "SSC CGL 2025" },
  { tag: "98.2%", name: "Student Name", exam: "Class 12 Boards, Science" },
  { tag: "Selected", name: "Student Name", exam: "IBPS PO 2025" },
  { tag: "96.8%", name: "Student Name", exam: "Class 10 Boards" },
]

export const testimonials = [
  { quote: "The weekly rank card kept me honest about where I actually stood, not where I thought I stood.", author: "Class 12 student" },
  { quote: "Doubt sessions in the evening meant I never carried a confusion into the next chapter.", author: "SSC aspirant" },
  { quote: "Small batch meant the teacher actually knew my name and my weak topics.", author: "Class 10 student" },
]

// Gallery: type is "image" or "video".
// For a video hosted directly on your own site (recommended, no YouTube
// needed): put the file in public/videos/ and set `src` to its path,
// e.g. src: "/videos/teaching-demo.mp4"
// (You can still use youtubeId instead of src if you ever want to embed
// a YouTube video — src takes priority if both are set.)
export const galleryItems = [
  { type: "image", label: "Classroom", caption: "Main classroom, Batch SCI-11-12" },
  { type: "image", label: "Library", caption: "Reference library & reading room" },
  { type: "image", label: "Lab", caption: "Science practical lab" },
  {
    type: "video",
    label: "Teaching Demo",
    caption: "A short teaching clip from one of our classes",
    src: "/videos/teaching-demo.mp4", // EDIT ME: put your real video file at public/videos/teaching-demo.mp4
    poster: "", // optional: path to a thumbnail image, e.g. "/videos/teaching-demo-poster.jpg"
  },
  { type: "image", label: "Result Day", caption: "Rank card distribution, March 2026" },
  { type: "image", label: "Doubt Session", caption: "Evening doubt-clearing in progress" },
]

export const faqs = [
  {
    q: "How do I book a free demo class?",
    a: "Use the enquiry form on the Contact section, or message us directly on WhatsApp. We'll confirm a slot within 24 hours.",
  },
  {
    q: "What is the batch size?",
    a: "Every batch is capped so each student gets individual attention — ask us the current number for the batch you're interested in.",
  },
  {
    q: "Do you provide study materials?",
    a: "Yes — We provide well-structured notes, practice questions, assignments, and regular test series to help students prepare effectively.",
  },
  {
    q: "Do you offer EMI / installment payment?",
    a: "Yes, fees can be split into monthly installments — see the Fees section below for details.",
  },
  {
    q: "Do you offer online classes?",
    a: "Yes. All recorded classes are uploaded to our official YouTube channel, allowing students to learn anytime, anywhere and revise lessons whenever needed.",
  },
]

export const feePlans = [
  {
    name: "Foundation — Class 9 & 10",
    priceFull: "₹12,000",
    priceEmi: "₹1,000 x 12 months",
    includes: ["All subjects", "Printed study material", "Weekly tests"],
  },
  {
    name: "Class 11 & 12 — Science",
    priceFull: "₹18,000",
    priceEmi: "₹1,500 x 12 months",
    includes: ["PCM/PCB full syllabus", "Entrance-pattern practice", "Doubt sessions"],
    featured: true,
  },
  {
    name: "Government Exam Prep",
    priceFull: "₹6,000",
    priceEmi: "₹1,000 x 6 months",
    includes: ["Reasoning + Quant + GK + English", "Weekly mock tests", "Previous year papers"],
  },
]
// EDIT ME: these are placeholder amounts — replace with your real fee structure.

export const blogPosts = [
  {
    id: "admissions-2026-open",
    date: "2026-07-01",
    title: "Admissions open for Batch 2026",
    excerpt: "New Foundation, Science and Government Exam batches start in August — seats are limited per batch.",
    content: `Admissions for the 2026 academic batches are now open across all three programs — Foundation (Class 9-10), Science (Class 11-12), and Government Exam Preparation. Batches are capped to keep class sizes small, so early registration is recommended. A free demo class is available for all new students before enrolling. Visit the centre or message us on WhatsApp to book a slot.`,
  },
  {
    id: "march-2026-results",
    date: "2026-03-20",
    title: "March 2026 result highlights",
    excerpt: "Our Class 10 and 12 board batches posted strong results this session — see the highlights.",
    content: `This session's board exam batches delivered strong results across both Class 10 and Class 12, with several students crossing 95% and multiple selections in government exam batches including SSC and Banking. Full rank cards are shared with enrolled students individually; a summary is available in the Results section of this site.`,
  },
  {
    id: "weekly-test-schedule",
    date: "2026-01-10",
    title: "New weekly test schedule for this term",
    excerpt: "Saturday tests, Monday rank cards — here's how the weekly cycle works this term.",
    content: `Starting this term, every batch follows a fixed weekly rhythm: a test every Saturday covering that week's topics, followed by a rank card shared with students and parents every Monday. This is meant to make progress visible on a weekly basis rather than only at term-end, and to flag weak topics early enough to act on them.`,
  },
]

// A short generic mock test — EDIT ME: replace with real subject-specific
// questions per batch (you can also make separate question sets per batch
// and add a batch picker on the Mock Test page).
export const quizQuestions = [
  {
    id: 1,
    question: "If a train travels 60 km in 45 minutes, what is its speed in km/h?",
    options: ["60 km/h", "80 km/h", "90 km/h", "75 km/h"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "44"],
    correctIndex: 2,
  },
  {
    id: 3,
    question: "Who is the current Chief Election Commissioner of India? (edit to keep current)",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,
  },
  {
    id: 4,
    question: "What is the SI unit of electric current?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "Simplify: 15% of 200 + 10% of 150",
    options: ["45", "50", "55", "60"],
    correctIndex: 1,
  },
]