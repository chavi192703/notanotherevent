/* ------------------------------------------------------------------
   EDIT THIS FILE to update projects, testimonials, socials and chat.
   Push the change (git push) and Vercel redeploys automatically.
------------------------------------------------------------------- */
window.SITE = {
  // --- Social links (replace with your real URLs; empty string hides the link)
  socials: {
    linkedin: "https://www.linkedin.com/company/notanotherevent/",
    instagram: "https://www.instagram.com/not_another_event/",
    facebook: "",
    tiktok: "",
    x: "",
    youtube: ""
  },

  // --- Tawk.to live chat. Paste your property + widget IDs from
  //     Tawk.to > Administration > Channels > Chat Widget  (looks like  PROPERTY_ID/WIDGET_ID)
  tawk: { propertyId: "", widgetId: "" },

  // --- Projects. type: "product" (our own platform) or "client" (custom builds)
  //     image: path to a screenshot in /assets/projects/ (leave "" for a colour tile)
  projects: [
    {
      title: "The 10 Titles",
      mark: "10",
      type: "client",
      tag: "Voting for Dynasty '26",
      color: "#BFA6F6",
      image: "/assets/projects/10titles.jpg",
      summary: "Live voting for a Desi-themed gala: ten titles, one crown each, with a big-screen reveal.",
      details: "A mobile-friendly voting experience for the Dynasty '26 gala. Guests scan a QR code and pick winners across ten titles, one crown per title. On the night, a presenter screen shows live results and runs a dramatic reveal of each winner, with optional 2nd and 3rd places, vote counts and sound.",
      features: ["QR code voting", "Ten titles", "Live results", "Winner reveal screen", "Mobile friendly"],
      link: "https://10titles.notanotherevent.com"
    },
    {
      title: "Dynasty Seating",
      mark: "DS",
      type: "client",
      tag: "Seating plans for Dynasty '26",
      color: "#FFD44D",
      image: "/assets/projects/dynastyseating.jpg",
      summary: "Guests type their name and instantly see which table they're on.",
      details: "A live seating lookup for the Dynasty '26 gala. Guests search their name to find their table, and organisers see all 18 tables, 172 guests, free seats and student and teacher filters at a glance.",
      features: ["Name search", "18 tables", "172 guests seated", "Free-seat tracking", "Student and teacher filters"],
      link: "https://dynastyseating.notanotherevent.com"
    },
    {
      title: "Not Another Event app",
      mark: "NA",
      type: "product",
      tag: "Our event platform",
      color: "#FFB6DC",
      image: "",
      summary: "Guest lists, payments, seating plans and DJ requests in one place.",
      details: "Our own platform that takes the chaos out of planning events.",
      features: ["Guest lists", "Payments", "Seating plans", "DJ requests"],
      link: ""
    }
  ],


  // --- Testimonials. Replace the placeholders with REAL client quotes.
  testimonials: [
    {
      quote: "Replace this with a real quote from a client about working with you.",
      name: "Client name",
      role: "Role, Company",
      photo: ""
    },
    {
      quote: "Add as many testimonials as you like. Short and specific works best.",
      name: "Client name",
      role: "Role, Company",
      photo: ""
    },
    {
      quote: "Photos are optional. Put them in /assets/testimonials/ and add the path.",
      name: "Client name",
      role: "Role, Company",
      photo: ""
    }
  ]
};
