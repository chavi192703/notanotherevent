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
      image: "",
      summary: "Online voting for a Desi-themed gala: ten titles, one crown each.",
      details: "A mobile-friendly voting experience for the Dynasty '26 gala. Guests pick the winners across ten titles, one crown per title, and votes are submitted instantly.",
      features: ["Ten titles", "One crown each", "Mobile friendly", "Instant vote submission"],
      link: "https://10titles.notanotherevent.com"
    },
    {
      title: "Dynasty Seating",
      mark: "DS",
      type: "client",
      tag: "Seating plans for Dynasty '26",
      color: "#FFD44D",
      image: "",
      summary: "Seating for the Dynasty '26 gala.",
      details: "",
      features: ["Seating plans", "Guest lists"],
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
