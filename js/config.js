/* =====================================================================
   config.js  —  SOLOC Media Team
   Change names here, commit,
   and GitHub Pages updates the site. The schedule rolls forward on its
   own each week — no need to touch dates after the rotation start.
   (config.js must load BEFORE app.js — index.html already does this.)
   ===================================================================== */

const CONFIG = {
  team: { name: "SOLOC", suffix: "MEDIA" },

  // The jobs filled on a given Sunday. Order here = column order in the table.
  roles: ["FOH / Sound", "Lyrics / Slides", "Camera", "Livestream", "Photography", "Video", "Graphic Design"],

  /* Two teams. People serve every other week, so Team A serves one Sunday,
     Team B the next, and so on.  */
  teams: {
    A: {
      "FOH / Sound":    "Endalk",
      "Lyrics / Slides":"Bilise",
      "Photography":    "Kaku",
      "Handheld":       "Sifan D.",
      "Video":          "Beki",
      "Edit Video":     "Sifan"
    },
    B: {
      "FOH / Sound":    "Sharon",
      "Lyrics / Slides":"Michu",
      "Photography":    "Heran",
      "Handheld":       "Rebira",
      "Videostand":     "Wabi",
      "Edit Video":     "Abi"
    }
  },

  // The first Sunday Team A serves (YYYY-MM-DD). Rotation flows from here.
  rotationStartSunday: "2026-06-07",

  // How many upcoming Sundays to list.
  weeksToShow: 12,

  /* One-off changes for a specific date. Only list the roles that change.
     Use "—" if a role is empty that week. Example:
     "2026-07-05": { "Camera": "Guest: Sam", "Photography": "—" } */
  overrides: {
    // "2026-07-05": { "Camera": "Sam (guest)" }
  },

  /* ---- Handbook content. Add as many topics as you like.
     video: paste a YouTube link (watch?v=… or youtu.be/…) or leave "". ---- 
  training: [
    {
      title: "FOH / Sound",
      sub: "Front of house — the mix the room actually hears.",
      video: "",
      intro: "Sound is the most felt and least noticed job on the team. When it's right, no one thinks about it. Your goal isn't loud — it's clear and balanced, so every word and every instrument has a place.",
      fundamentals: [
        "Set gain structure before anything else — clean signal in, clean signal out.",
        "Build the mix from the vocals outward; the congregation follows the lead voice.",
        "Use your ears in the room, not just the meters on the screen.",
        "Ring out monitors and watch for feedback before the room fills."
      ],
      style: "Once your fundamentals are solid, the mix becomes a feel. Some engineers ride a tight, dry vocal; others lean into space and reverb. Find the sound that fits your room and your worship — then own it."
    },
    {
      title: "Camera",
      sub: "Framing, movement, and knowing when to hold still.",
      video: "",
      intro: "A camera operator tells the room where to look. Good camera work is invisible — it serves the moment instead of showing off. Steady, intentional, and always a half-step ahead of what's about to happen.",
      fundamentals: [
        "Rule of thirds and headroom — give the subject somewhere to look.",
        "Lock focus and exposure before you go live; don't hunt mid-shot.",
        "Move slowly and with purpose; a still frame beats a shaky one.",
        "Anticipate the moment — be on the speaker before they speak."
      ],
      style: "Once you can hold a clean, stable shot, start making choices: a slow push for intensity, a wider frame for community. Your instinct for the moment is your signature."
    },
    {
      title: "Lyrics / Slides",
      sub: "Keeping the room on the same page, literally.",
      video: "",
      intro: "Running slides looks simple until you're live and a song goes off-script. Your one job: the right words on screen, on time, every time. Readable beats fancy, always.",
      fundamentals: [
        "Know the set list and the song arrangements before service.",
        "Advance on the last word of a line, not after — stay ahead of the singer.",
        "High contrast, large type, minimal clutter — readability first.",
        "Have a plan for the unexpected verse or repeat."
      ],
      style: "Strong fundamentals free you to design. Thoughtful backgrounds, typography that matches the moment, smooth transitions — these are where your eye for design shows."
    },
    {
      title: "Photography",
      sub: "Capturing the room as it really felt.",
      video: "",
      intro: "Photography is about being present without being a distraction. You're collecting the moments people will remember — hands raised, faces in worship, the quiet ones too.",
      fundamentals: [
        "Understand the exposure triangle: ISO, aperture, shutter speed.",
        "Shoot in low light without blasting flash into the room.",
        "Get close, but stay respectful of the worship space.",
        "Capture variety — wide context shots and intimate details."
      ],
      style: "Once you can nail exposure in tricky light, your point of view takes over. Moody and candid, or bright and celebratory — your edit and your eye are the style."
    },
    {
      title: "Video",
      sub: "Telling the story after Sunday is over.",
      video: "",
      intro: "Video work lives mostly in the edit. Whether it's a recap, a testimony, or a sermon clip, your job is to keep what matters and cut everything that doesn't. Pacing and clarity beat flashy effects every time.",
      fundamentals: [
        "Capture clean audio first — bad sound ruins good footage.",
        "Shoot more coverage than you think you need; cutaways save edits.",
        "Cut to the rhythm of the content, not to fill time.",
        "Keep color and levels consistent across every clip."
      ],
      style: "With the basics handled, tone is your canvas — a tight, energetic recap or a slow, reflective testimony. Your sense of pacing and music is the signature."
    },
    {
      title: "Graphic Design",
      sub: "The visual language of everything we put on screen.",
      video: "",
      intro: "Design is communication before it's decoration. A sermon graphic, a slide template, a social post — each one should be readable in a second and feel like it belongs to the same family. Consistency is what makes a team's work look intentional.",
      fundamentals: [
        "Establish hierarchy — the eye should know where to land first.",
        "Limit your type and color choices; restraint reads as polish.",
        "Respect alignment, spacing, and a grid — let things breathe.",
        "Design for the actual screen and distance it'll be viewed from."
      ],
      style: "Once the fundamentals are reflex, your taste leads. Bold and graphic, or quiet and editorial — a consistent visual voice is what people will recognize as yours."
    }
  ]
    */
   
};
