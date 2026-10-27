/* ------------------------------------------------------------------
   EDIT THIS FILE to update projects, testimonials, socials and chat.
   Push the change (git push) and Vercel redeploys automatically.
------------------------------------------------------------------- */
window.SITE = {
  // --- Social links (replace with your real URLs; empty string hides the link)
  socials: {
    instagram: "https://instagram.com/notanotherevent",
    linkedin: "https://linkedin.com/company/notanotherevent",
    facebook: "https://facebook.com/notanotherevent",
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
      title: "Project name one",
      type: "client",
      tag: "Wedding planning system",
      color: "#BFA6F6",
      image: "",
      summary: "One line on what you built and who it was for.",
      details: "A longer description: the problem, what you built, and the result. Add numbers if you have them (guests managed, hours saved, events run).",
      features: ["Guest lists", "Seating plans", "Payments"],
      link: ""
    },
    {
      title: "Project name two",
      type: "client",
      tag: "Corporate event portal",
      color: "#FFD44D",
      image: "",
      summary: "One line on what you built and who it was for.",
      details: "A longer description of this project.",
      features: ["Registration", "Check-in", "Reports"],
      link: ""
    },
    {
      title: "Not Another Event app",
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
