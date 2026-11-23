/* Tinig – interactions
 * Likes, reposts, replies, link sharing, composing posts (saved in this
 * browser only), and live search. No dependencies, no build step. */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const STORE_KEY = "tinig:posts";
  const DRAFT_KEY = "tinig:draft";
  const MAX_CHARS = 280;
  const PREF_LANG_KEY = "tinig:language";
  const PREF_THEME_KEY = "tinig:theme";

  const feed = $("#feed");
  const box = $("#composer");
  const postBtn = $("#postBtn");
  const counter = $("#count");
  const toastEl = $("#toast");
  const search = $("#search");
  const anonBox = $("#anon");

  /* ---------- account (kept in this browser only) ---------- */
  const SESSION_KEY = "tinig:session", USERS_KEY = "tinig:users";
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

  const COPY = {
    fil: {
      utilityIntro: "I-personalize ang iyong karanasan", displaySettings: "Mga setting ng display", appHome: "Tinig – Home", mainMenu: "Pangunahing menu", homeNav: "Home", postNav: "Mag-post", myProfile: "Profile ko", skipContent: "Lumaktaw sa nilalaman", monthNov: "NOB", monthDec: "DIS", darkMode: "Dark mode", lightMode: "Light mode",
      heroTitle: "Ang tinig mo, may saysay.", heroDescription: "Dito nagtatagpo ang mga Pilipinong nagbabantay, nagtatanong, at kumikilos para sa mas malinis at mas makatarungang pamahalaan.",
      pledgePeaceful: "Mapayapa", pledgeEvidence: "May batayan", pledgeAll: "Para sa lahat",
      infoEyebrow: "MAPAGKAKATIWALAANG SANGGUNIAN", infoFeedTitle: "Balita at Impormasyon", infoFeedIntro: "Mga balita, ulat, at anunsyong mababasa mula sa mga opisyal na sanggunian.", officialSources: "Opisyal na sanggunian",
      dilgDate: "Nobyembre 20, 2026", dilgHeadline: "Pinapalawak ng DILG-NCR ang pag-aaral sa fiscal autonomy sa pamamagitan ng konsultasyon sa mga LGU", dilgSummary: "Bisitahin ang opisyal na pahina para sa pinakabagong balita at anunsyo tungkol sa mga lokal na pamahalaan.",
      resourceLabel: "Mga pampublikong ulat", coaHeadline: "Mga Annual Audit Report", coaSummary: "Tingnan ang mga nailathalang audit report para sa mga ahensiya ng pamahalaan at lokal na pamahalaan.",
      governmentIssuances: "Mga kautusan at dokumento", gazetteHeadline: "Mga opisyal na kautusan at pabatid", gazetteSummary: "Basahin ang mga executive order at iba pang opisyal na pahayag ng pamahalaan.", readOfficial: "Basahin sa opisyal na site ↗", infoDisclaimer: "Paalala: dadalhin ka ng mga link sa panlabas na website. Suriin ang petsa at buong konteksto ng bawat ulat.",
      composerLabel: "Isulat ang post mo", composerPlaceholder: "Ano’ng nakita o napag-aralan mo ngayon?", anonymousLabel: "Mag-post nang anonymous (hindi lalabas ang pangalan mo)",
      addImage: "Maglagay ng larawan", addLocation: "Maglagay ng lokasyon", addSource: "Maglagay ng sanggunian", postButton: "Mag-post",
      tabForYou: "Para sa’yo", tabFollowing: "Sinusubaybayan", tabVerified: "Beripikado", roleResearcher: "Mananaliksik", roleOrganization: "Samahan", roleLawyer: "Abogado", roleVerified: "Sinuri",
      timeTwoHours: "2 oras", timeFiveHours: "5 oras", timeOneDay: "1 araw", time38Minutes: "38 min", timeThreeHours: "3 oras",
      budgetPost: "Binasa ko ang buong panukalang badyet ng distrito namin. 🧵 Hindi ito tsismis, nasa pampublikong dokumento mismo. Ito ang mga nakita ko:", floodProject: "Proyektong pang-baha, distrito 3", allocatedBudget: "Inilaang pondo", reportedCompleted: "Natapos ayon sa ulat", projectsCount: "12 sa 20 proyekto", withEvidence: "May larawan o kumpirmasyon", onlyFive: "5 lamang", budgetSource: "Sanggunian: pampublikong ulat sa badyet. Nakalakip ang link sa ikalawang post.",
      budgetFollowup: `Paano ka makakatulong: pumunta sa barangay hall, hilingin ang kopya ng ulat ng proyekto, at <span class="tag">#TanongBayan</span> ang ibahagi mo rito. Isa-isa nating i-verify.`, replyCount: "<b>Ruel</b> at 146 pang iba ay sumagot",
      peacefulGathering: "Mapayapang pagtitipon ngayong Sabado, 4:00 NH, Liwasang Bonifacio. Magdala ng tubig, payong, at placard na may sariling mensahe. Walang bitbit na panganib, walang away.", placardTitle: "Transparency ay hindi pabor. Karapatan.", placardSubtitle: "Dalhin ang boses mo, iwan ang galit sa bahay.",
      rightsPostOne: "Para sa mga unang beses sasama sa rally: ang mapayapang pagtitipon ay karapatang kinikilala ng Konstitusyon. I-save ang numero ng pinagkakatiwalaang abogado, sabihin sa kaibigan kung nasaan ka, at huwag iwan ang grupo.",
      rightsPostTwo: `Kung may maling pagtrato, kumuha ng pangalan, oras, at lugar. Ang tamang tala ay tulong sa susunod na kasong ihahain. <span class="tag">#AlamAngKarapatan</span>`,
      emptyFeedPrompt: "Ikaw na ang bahala sa susunod na usapan. Magsimula ng thread.", followingPost: "Tatlong beses akong nagtanong sa munisipyo tungkol sa pondo ng kalsada. Sa ikatlo, binigyan nila ako ng kopya. Huwag sumuko sa unang ‘balik na lang po kayo.’", followingPrompt: "Sundan ang mas marami pang tao para mapuno ang pahinang ito.",
      factCheckPost: "Kumakalat na larawan ng ‘pinakamalaking rally ngayong taon.’ Nasuri namin: kuha ito noong 2019 at hindi ngayon. Suriin muna bago i-share.", resultHeading: "Resulta", originalPhotoDate: "Petsa ng orihinal na larawan", statusLabel: "Katayuan", wrongContext: "Maling konteksto", verifiedPrompt: "Mga post na sinuri ng mga nakarehistrong tagasuri ng katotohanan.",
      searchTitle: "Maghanap", searchPlaceholder: "Maghanap ng usapin o tao", trendingTitle: "Mga usapin ngayon", notificationsTitle: "Mga abiso", profileTitle: "Profile", welcomeTitle: "Maligayang pagdating.", welcomeDescription: "Mag-log in, gumawa ng account, o tumuloy bilang bisita. Puwede kang mag-post nang anonymous anumang oras.",
      loginTab: "Mag-log in", signupTab: "Mag-sign up", usernameLabel: "Username", passwordLabel: "Password", nameLabel: "Pangalan", usernameHint: "3 hanggang 20 letra, numero o _", passwordHint: "Hindi bababa sa 8 karakter", repeatPassword: "Ulitin ang password", createAccount: "Gumawa ng account", orLabel: "o", continueGuest: "Magpatuloy bilang bisita", demoNotice: "Demo ito na walang totoong server. Nasa browser mo lang ang account, kaya huwag gamitin ang totoong password mo. Anonymous ang lahat ng post ng bisita.",
      topicBudget: "8.4K post, pagsusuri ng badyet", topicFlood: "5.1K post, mga proyektong pang-flood control", topicRights: "3.7K post, gabay at karanasan", topicFactCheck: "2.9K post, paglilinaw ng mga balita", eventsTitle: "Mga paparating na pagtitipon", eventBudget: "Pampublikong talakayan sa badyet", eventBudgetPlace: "Quezon City, 6:00 NH", eventMarch: "Mapayapang martsa sa Liwasang Bonifacio", eventMarchPlace: "Maynila, 4:00 NH", eventWorkshop: "Workshop: paano magbasa ng ulat ng COA", eventWorkshopPlace: "Online, 7:30 NG", rightsTitle: "Alamin ang karapatan mo", rightsBulletOne: "Mapayapang pagtitipon ay karapatan.", rightsBulletTwo: "Magtala ng pangalan, oras, at lugar kung may insidente.", rightsBulletThree: "Magsama ng kaibigan at huwag lumayo sa grupo.", footerNotice: "Tinig ay halimbawang disenyo. Lahat ng pangalan at post dito ay kathang-isip. Hindi sinusuportahan ng platapormang ito ang karahasan o maling impormasyon.",
      deleteTitle: "Burahin ang post?", deleteMessage: "Sigurado ka bang gusto mong burahin ang post na ito? Hindi na ito maibabalik.", cancelDelete: "Kanselahin", confirmDelete: "Oo, burahin", deletePost: "Burahin", deleteAria: "Burahin ang post mo", deleteSuccess: "Nabura ang post", deleteFallback: "Sigurado ka bang gusto mong burahin ang post na ito?", postPublished: "Na-post na", toolDemo: "Paparating pa lang ito sa demo", reposted: "Na-repost mo ito", repostRemoved: "Inalis ang repost", copiedLink: "Nakopya ang link", copyFailed: "Hindi makopya ang link", searchType: "Mag-type ng salita, pangalan o hashtag.", noResults: "Walang tugma. Subukan ang ibang salita o hashtag.",
      noteOne: "Fact-Check Pinas ay nag-verify ng usapin na sinusubaybayan mo.", noteTwo: "Paalala: ang Pampublikong talakayan sa badyet ay sa 28 Nob.", noteThree: "Marisol Santos ay nag-reply sa thread mo.", noteFour: "Salamat sa pagsali sa Tinig. Mapayapa at may batayan ang usapan dito.",
      guestProfile: "Bisita ka. Mag-sign up para magkaroon ng sariling profile. Anonymous ang lahat ng post mo.", noPosts: "Wala ka pang post.", myPosts: "post mo (hindi kasama ang mga anonymous)", loginOrSignup: "Mag-log in o mag-sign up", logout: "Mag-log out", guestName: "Bisita", anonymousName: "Hindi kilala", defaultUser: "kapwa_ko", unknownHandle: "@kapwa_ko", anonymousHandle: "@anonymous", guestHandle: "@bisita", 
      nameRequired: "Ilagay ang pangalan mo.", usernameInvalid: "Ang username ay 3 hanggang 20 letra, numero o _ lamang.", usernameTaken: "May gumagamit na ng username na iyan.", passwordShort: "Hindi bababa sa 8 karakter ang password.", passwordMismatch: "Hindi magkatugma ang mga password.", loginInvalid: "Mali ang username o password."
    },
    en: {
      utilityIntro: "Personalize your experience", displaySettings: "Display settings", appHome: "Tinig – Home", mainMenu: "Main menu", homeNav: "Home", postNav: "Create a post", myProfile: "My profile", skipContent: "Skip to content", monthNov: "NOV", monthDec: "DEC", darkMode: "Dark mode", lightMode: "Light mode",
      heroTitle: "Your voice matters.", heroDescription: "A place for Filipinos to stay informed, ask questions, and work together for cleaner and more accountable government.",
      pledgePeaceful: "Peaceful", pledgeEvidence: "Evidence-based", pledgeAll: "For everyone",
      infoEyebrow: "TRUSTED SOURCES", infoFeedTitle: "News & Information", infoFeedIntro: "News, reports, and announcements from official public sources.", officialSources: "Official sources",
      dilgDate: "November 20, 2026", dilgHeadline: "DILG-NCR expands fiscal autonomy study through consultations with local government units", dilgSummary: "Visit the official page for the latest news and announcements about local governments.",
      resourceLabel: "Public reports", coaHeadline: "Annual Audit Reports", coaSummary: "Browse published audit reports for government agencies and local government units.",
      governmentIssuances: "Government issuances", gazetteHeadline: "Official orders and announcements", gazetteSummary: "Read executive orders and other official government issuances.", readOfficial: "Read on official website ↗", infoDisclaimer: "Note: These links open external websites. Check each report’s date and full context.",
      composerLabel: "Write your post", composerPlaceholder: "What have you seen or learned today?", anonymousLabel: "Post anonymously (your name will not be shown)",
      addImage: "Add an image", addLocation: "Add a location", addSource: "Add a source", postButton: "Post",
      tabForYou: "For you", tabFollowing: "Following", tabVerified: "Verified", roleResearcher: "Researcher", roleOrganization: "Organization", roleLawyer: "Lawyer", roleVerified: "Fact-checked",
      timeTwoHours: "2 hours ago", timeFiveHours: "5 hours ago", timeOneDay: "1 day ago", time38Minutes: "38 min ago", timeThreeHours: "3 hours ago",
      budgetPost: "I read our district’s full proposed budget. 🧵 This is not a rumor; the information comes from a public document. Here is what I found:", floodProject: "Flood-control project, District 3", allocatedBudget: "Allocated budget", reportedCompleted: "Reported as completed", projectsCount: "12 of 20 projects", withEvidence: "With photos or confirmation", onlyFive: "Only 5", budgetSource: "Source: public budget report. The link is included in the second post.",
      budgetFollowup: `How you can help: visit your barangay hall, request a copy of the project report, and share it here using <span class="tag">#TanongBayan</span>. Let’s verify the details one by one.`, replyCount: "<b>Ruel</b> and 146 others replied",
      peacefulGathering: "A peaceful gathering this Saturday at 4:00 PM, Liwasang Bonifacio. Bring water, an umbrella, and a sign with your own message. Keep it safe and peaceful.", placardTitle: "Transparency is not a favor. It is a right.", placardSubtitle: "Bring your voice; leave anger at home.",
      rightsPostOne: "For anyone attending a rally for the first time: peaceful assembly is a right recognized by the Constitution. Save the number of a trusted lawyer, tell a friend where you are, and stay with your group.",
      rightsPostTwo: `If you experience improper treatment, record names, times, and locations. Accurate notes can help with any follow-up complaint. <span class="tag">#KnowYourRights</span>`,
      emptyFeedPrompt: "Continue the conversation. Start a thread of your own.", followingPost: "I asked the municipal office three times about the road budget. On the third visit, they gave me a copy. Do not give up after the first ‘please come back later.’", followingPrompt: "Follow more people to fill this page with updates.",
      factCheckPost: "A photo is circulating as ‘the biggest rally of the year.’ We checked it: the image is from 2019, not today. Verify before sharing.", resultHeading: "Result", originalPhotoDate: "Original photo date", statusLabel: "Status", wrongContext: "Incorrect context", verifiedPrompt: "Posts reviewed by registered fact-checkers.",
      searchTitle: "Search", searchPlaceholder: "Search topics or people", trendingTitle: "Trending topics", notificationsTitle: "Notifications", profileTitle: "Profile", welcomeTitle: "Welcome to Tinig.", welcomeDescription: "Log in, create an account, or continue as a guest. You can post anonymously at any time.",
      loginTab: "Log in", signupTab: "Sign up", usernameLabel: "Username", passwordLabel: "Password", nameLabel: "Name", usernameHint: "3 to 20 letters, numbers, or _", passwordHint: "At least 8 characters", repeatPassword: "Confirm password", createAccount: "Create account", orLabel: "or", continueGuest: "Continue as guest", demoNotice: "This is a demo without a live server. Your account is stored only in this browser, so do not use your real password. Guest posts are anonymous.",
      topicBudget: "8.4K posts, budget review", topicFlood: "5.1K posts, flood-control projects", topicRights: "3.7K posts, rights guides and experiences", topicFactCheck: "2.9K posts, fact-checks and clarifications", eventsTitle: "Upcoming community events", eventBudget: "Public budget discussion", eventBudgetPlace: "Quezon City, 6:00 PM", eventMarch: "Peaceful march at Liwasang Bonifacio", eventMarchPlace: "Manila, 4:00 PM", eventWorkshop: "Workshop: how to read a COA report", eventWorkshopPlace: "Online, 7:30 PM", rightsTitle: "Know your rights", rightsBulletOne: "Peaceful assembly is a right.", rightsBulletTwo: "Record names, times, and locations if an incident occurs.", rightsBulletThree: "Stay with a friend and remain with your group.", footerNotice: "Tinig is a sample design. All names and posts shown here are fictional. This platform does not support violence or misinformation.",
      deleteTitle: "Delete this post?", deleteMessage: "Are you sure you want to delete this post? This action cannot be undone.", cancelDelete: "Cancel", confirmDelete: "Yes, delete", deletePost: "Delete", deleteAria: "Delete your post", deleteSuccess: "Post deleted", deleteFallback: "Are you sure you want to delete this post?", postPublished: "Your post was published", toolDemo: "This feature is not available in the demo yet", reposted: "You reposted this", repostRemoved: "Repost removed", copiedLink: "Link copied", copyFailed: "Could not copy the link", searchType: "Type a word, name, or hashtag.", noResults: "No matches. Try another word or hashtag.",
      noteOne: "Fact-Check Pinas verified a topic you are following.", noteTwo: "Reminder: the public budget discussion is on Nov 28.", noteThree: "Marisol Santos replied to your thread.", noteFour: "Thanks for joining Tinig. Keep conversations peaceful and evidence-based.",
      guestProfile: "You are browsing as a guest. Sign up to create your own profile. Your posts are anonymous.", noPosts: "You have not posted yet.", myPosts: "posts (not including anonymous posts)", loginOrSignup: "Log in or sign up", logout: "Log out", guestName: "Guest", anonymousName: "Anonymous", defaultUser: "community_member", unknownHandle: "@community_member", anonymousHandle: "@anonymous", guestHandle: "@guest",
      nameRequired: "Please enter your name.", usernameInvalid: "Your username must be 3–20 letters, numbers, or underscores.", usernameTaken: "That username is already in use.", passwordShort: "Your password must be at least 8 characters.", passwordMismatch: "The passwords do not match.", loginInvalid: "Incorrect username or password."
    }
  };
  let language = read(PREF_LANG_KEY, "fil") === "en" ? "en" : "fil";
  const t = (key) => COPY[language][key] ?? COPY.fil[key] ?? key;
  let theme = read(PREF_THEME_KEY, null);
  if (theme !== "light" && theme !== "dark") theme = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const applyLanguage = () => {
    document.documentElement.lang = language;
    document.title = language === "en" ? "Tinig – Your voice matters" : "Tinig – Usapang bayan, sama-sama";
    const description = language === "en"
      ? "Tinig: a platform for peaceful, evidence-based civic discussion."
      : "Tinig: isang plataporma para sa mapayapa at may batayang usapang bayan.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    $$('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
    $$('[data-i18n-html]').forEach((node) => { node.innerHTML = t(node.dataset.i18nHtml); });
    $$('[data-i18n-placeholder]').forEach((node) => { node.placeholder = t(node.dataset.i18nPlaceholder); });
    $$('[data-i18n-aria]').forEach((node) => { node.setAttribute("aria-label", t(node.dataset.i18nAria)); });
    $$('[data-user-post="true"] .del').forEach((node) => {
      node.textContent = t("deletePost");
      node.setAttribute("aria-label", t("deleteAria"));
    });
    $$('[data-user-post="true"] [data-user-label]').forEach((node) => { node.textContent = t(node.dataset.userLabel); });
    $$('[data-user-post="true"] .post-age').forEach((node) => { node.textContent = ago(Number(node.dataset.timestamp)); });
    const langButton = $("#languageToggle");
    langButton.textContent = language === "fil" ? "English" : "Filipino";
    langButton.setAttribute("aria-label", language === "fil" ? "Switch to English" : "Lumipat sa Filipino");
    applyTheme();
  };
  const applyTheme = () => {
    document.documentElement.dataset.theme = theme;
    $("#theme-color-meta")?.setAttribute("content", theme === "dark" ? "#0c1233" : "#14205c");
    const button = $("#themeToggle");
    const iconName = theme === "dark" ? "sun" : "moon";
    const label = theme === "dark" ? t("lightMode") : t("darkMode");
    button.innerHTML = `<svg aria-hidden="true"><use href="#i-${iconName}"/></svg><span>${label}</span>`;
    button.setAttribute("aria-label", theme === "dark" ? (language === "en" ? "Switch to light mode" : "Lumipat sa light mode") : (language === "en" ? "Switch to dark mode" : "Lumipat sa dark mode"));
    button.setAttribute("aria-pressed", String(theme === "dark"));
  };
  let session = read(SESSION_KEY, null);
  const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
  const me = () => session?.type === "user"
    ? { name: session.name, handle: "@" + session.handle, ini: initials(session.name) }
    : { name: t("guestName"), handle: t("guestHandle"), ini: "B" };
  const ownerId = () => (session?.type === "user" ? session.handle : "guest");
  const sha = async (t) => {
    if (!window.crypto?.subtle) return btoa(unescape(encodeURIComponent(t)));
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  };
  const syncMe = () => {
    const m = me(), guest = session?.type !== "user";
    $("#who").textContent = m.name;
    $$(".me-av").forEach((a) => (a.textContent = m.ini));
    anonBox.checked = guest; // guests always post anonymously
    anonBox.disabled = guest;
  };

  /* ---------- helpers ---------- */
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text; // textContent: user text is never parsed as HTML
    return node;
  };
  const icon = (id) => `<svg><use href="#i-${id}"/></svg>`;

  const parseCount = (t) => {
    const s = t.trim().toUpperCase();
    const n = parseFloat(s);
    if (Number.isNaN(n)) return 0;
    return s.endsWith("K") ? Math.round(n * 1000) : n;
  };
  const formatCount = (n) =>
    n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "K" : String(n);

  const ago = (ts) => {
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return language === "en" ? "just now" : "ngayon";
    if (mins < 60) return language === "en" ? `${mins} min ago` : `${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return language === "en" ? `${hrs} hours ago` : `${hrs} oras`;
    const days = Math.floor(hrs / 24);
    return language === "en" ? `${days} days ago` : `${days} araw`;
  };

  let toastTimer;
  const say = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  };

  /* ---------- action counts: wrap bare numbers so they can change ---------- */
  const enhance = (root) => {
    $$(".acts button", root).forEach((btn) => {
      const kind = btn.querySelector("use")?.getAttribute("href");
      const labels = { "#i-heart": "Like", "#i-reply": language === "en" ? "Reply" : "Sumagot", "#i-repost": language === "en" ? "Repost" : "I-repost", "#i-send": language === "en" ? "Share" : "Ibahagi" };
      if (labels[kind]) btn.setAttribute("aria-label", labels[kind]);
      if (kind === "#i-heart" || kind === "#i-repost") btn.setAttribute("aria-pressed", btn.classList.contains("liked") || btn.classList.contains("reposted"));
      if (btn.querySelector(".n")) return;
      const textNode = [...btn.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
      if (!textNode) return;
      const span = el("span", "n", textNode.textContent.trim());
      span.dataset.v = parseCount(span.textContent);
      btn.replaceChild(span, textNode);
    });
  };

  const bump = (btn, delta) => {
    const span = $(".n", btn);
    if (!span) return;
    const next = Math.max(0, Number(span.dataset.v) + delta);
    span.dataset.v = next;
    span.textContent = formatCount(next);
  };

  /* ---------- delegated clicks ---------- */
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href="#"]');
    if (link) {
      e.preventDefault();
      if (link.classList.contains("post")) { go("home"); focusComposer(); }
    }

    const del = e.target.closest(".del");
    if (del) {
      pendingDeleteId = del.dataset.id;
      const dialog = $("#deleteDialog");
      if (typeof dialog.showModal === "function") dialog.showModal();
      else if (window.confirm(t("deleteFallback"))) deletePendingPost();
      return;
    }
    if (e.target.closest(".compose .tools button")) return say(t("toolDemo"));

    const btn = e.target.closest(".acts button");
    if (!btn) return;
    const kind = btn.querySelector("use")?.getAttribute("href");

    if (kind === "#i-heart") {
      const on = btn.classList.toggle("liked");
      btn.setAttribute("aria-pressed", on);
      bump(btn, on ? 1 : -1);
    } else if (kind === "#i-repost") {
      const on = btn.classList.toggle("reposted");
      btn.setAttribute("aria-pressed", on);
      bump(btn, on ? 1 : -1);
      say(on ? t("reposted") : t("repostRemoved"));
    } else if (kind === "#i-reply") {
      const handle = btn.closest(".thread")?.querySelector(".at")?.textContent;
      go("home");
      if (handle && !box.value) setComposer(handle + " ");
      focusComposer();
    } else if (kind === "#i-send") {
      const done = () => say(t("copiedLink"));
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, () => say(t("copyFailed")));
      else say(t("copyFailed"));
    }
  });

  /* ---------- delete confirmation ---------- */
  let pendingDeleteId = null;
  const deletePendingPost = () => {
    if (pendingDeleteId == null) return;
    const id = pendingDeleteId;
    save(load().filter((post) => String(post.id) !== String(id)));
    $$(`.del[data-id="${id}"]`).forEach((button) => button.closest(".thread")?.remove());
    pendingDeleteId = null;
    const dialog = $("#deleteDialog");
    if (dialog.open) dialog.close();
    say(t("deleteSuccess"));
    if (current === "profile") renderProfile();
  };
  $("#confirmDelete").addEventListener("click", deletePendingPost);
  $("#cancelDelete").addEventListener("click", () => {
    pendingDeleteId = null;
    $("#deleteDialog").close();
  });
  $("#deleteDialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      pendingDeleteId = null;
      event.currentTarget.close();
    }
  });

  /* ---------- language and appearance preferences ---------- */
  $("#languageToggle").addEventListener("click", () => {
    language = language === "fil" ? "en" : "fil";
    write(PREF_LANG_KEY, language);
    applyLanguage();
    syncMe();
    enhance(document);
    if (current === "notifications") renderNotes();
    if (current === "profile") renderProfile();
  });
  $("#themeToggle").addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    write(PREF_THEME_KEY, theme);
    applyTheme();
  });

  /* ---------- composer ---------- */
  const setComposer = (value) => {
    box.value = value;
    box.dispatchEvent(new Event("input"));
  };
  const focusComposer = () => {
    box.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    box.focus({ preventScroll: true });
    box.setSelectionRange(box.value.length, box.value.length);
  };

  const refreshComposer = () => {
    const len = box.value.length;
    counter.textContent = `${len}/${MAX_CHARS}`;
    counter.classList.toggle("over", len > MAX_CHARS);
    postBtn.disabled = !box.value.trim() || len > MAX_CHARS;
    try { localStorage.setItem(DRAFT_KEY, box.value); } catch { /* storage unavailable */ }
    box.style.height = "auto";
    box.style.height = box.scrollHeight + "px";
  };
  box.addEventListener("input", refreshComposer);
  box.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !postBtn.disabled) publish();
  });
  postBtn.addEventListener("click", publish);

  /* ---------- building and saving posts ---------- */
  const buildPost = (p) => {
    const art = el("article", "thread last");
    art.dataset.userPost = "true";
    const side = el("div", "side");
    side.append(el("div", p.anon ? "av c7" : "av c6", p.anon ? "?" : p.ini || "KA"));

    const body = el("div", "body");
    const head = el("div", "head");
    const del = el("button", "del", t("deletePost"));
    del.type = "button";
    del.dataset.id = p.id;
    del.setAttribute("aria-label", t("deleteAria"));
    const mine = !p.owner || p.owner === ownerId();
    const author = el("b", null, p.anon ? t("anonymousName") : p.name || t("defaultUser"));
    const handle = el("span", "at", p.anon ? t("anonymousHandle") : p.handle || t("unknownHandle"));
    if (p.anon) { author.dataset.userLabel = "anonymousName"; handle.dataset.userLabel = "anonymousHandle"; }
    const age = el("time", "post-age", ago(p.at));
    age.dataset.timestamp = p.at;
    head.append(author, handle, age, ...(mine ? [del] : []));

    const text = el("p");
    p.text.split(/(#[\p{L}\p{N}_]+)/u).forEach((part) => {
      text.append(/^#[\p{L}\p{N}_]+$/u.test(part) ? el("span", "tag", part) : document.createTextNode(part));
    });

    const acts = el("div", "acts");
    acts.innerHTML =
      `<button aria-label="Like">${icon("heart")}0</button>` +
      `<button aria-label="${language === "en" ? "Reply" : "Sumagot"}">${icon("reply")}0</button>` +
      `<button aria-label="${language === "en" ? "Repost" : "I-repost"}">${icon("repost")}0</button>` +
      `<button aria-label="${language === "en" ? "Share" : "Ibahagi"}">${icon("send")}</button>`;

    body.append(head, text, acts);
    art.append(side, body);
    enhance(art);
    return art;
  };

  const load = () => {
    try { return (JSON.parse(localStorage.getItem(STORE_KEY)) || []).map((p) => ({ ...p, id: p.id ?? p.at })); } catch { return []; }
  };
  const save = (list) => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, 50))); } catch { /* storage unavailable */ }
  };

  function publish() {
    const text = box.value.trim();
    if (!text || text.length > MAX_CHARS) return;
    const now = Date.now();
    const m = me();
    const post = { id: now, text, at: now, owner: ownerId(), anon: anonBox.checked, ...(anonBox.checked ? {} : { name: m.name, handle: m.handle, ini: m.ini }) };
    save([post, ...load()]);
    const node = buildPost(post);
    node.classList.add("is-new");
    feed.prepend(node);
    $("#t1").checked = true; // make sure the Para sa’yo tab is showing
    setComposer("");
    say(t("postPublished"));
  }

  /* ---------- search page ---------- */
  const results = $("#results");
  const inputs = $$("#search, #search2");
  const render = () => {
    const q = search.value.trim().toLowerCase();
    results.replaceChildren();
    if (!q) return results.append(el("p", "more", t("searchType")));
    const groups = [];
    $$('[data-view="home"] .thread').forEach((t) => {
      if (!t.classList.contains("sub") || !groups.length) groups.push([]);
      groups[groups.length - 1].push(t);
    });
    let hits = 0;
    groups.filter((g) => g.some((t) => t.textContent.toLowerCase().includes(q))).forEach((g) => {
      hits++;
      g.forEach((t) => results.append(t.cloneNode(true)));
    });
    if (!hits) results.append(el("p", "more", t("noResults")));
  };
  inputs.forEach((i) => {
    i.addEventListener("input", () => {
      inputs.forEach((o) => { if (o !== i) o.value = i.value; });
      if (i.value.trim() && current !== "search") go("search");
      else if (current === "search") render();
    });
    i.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { inputs.forEach((o) => (o.value = "")); render(); }
    });
  });
  $("#trend").append($(".topics").cloneNode(true));
  $$(".topics a").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      inputs.forEach((o) => (o.value = $("b", a).textContent));
      go("search");
    })
  );

  /* ---------- notifications and profile ---------- */
  const NOTES = [
    ["noteOne", "3 hours"],
    ["noteTwo", "1 day"],
    ["noteThree", "2 days"],
    ["noteFour", "3 days"],
  ];
  const renderNotes = () => {
    const box = $("#noteList");
    box.replaceChildren();
    (session?.type === "user" ? NOTES : NOTES.slice(0, 2)).forEach(([key, age]) => {
      const d = el("div", "ntf");
      const displayAge = language === "en" ? age + " ago" : ({ "3 hours": "3 oras", "1 day": "1 araw", "2 days": "2 araw", "3 days": "3 araw" }[age]);
      d.append(el("span", null, t(key)), el("time", null, displayAge));
      box.append(d);
    });
  };
  const renderProfile = () => {
    const m = me(), box = $("#profile"), guest = session?.type !== "user";
    box.replaceChildren();
    const head = el("div", "pro"), info = el("div");
    info.append(el("h2", null, m.name), el("p", "at", m.handle));
    head.append(el("div", "av big c6", m.ini), info);
    box.append(head);
    if (guest) box.append(el("p", "more", t("guestProfile")));
    else {
      const mine = load().filter((p) => !p.anon && p.handle === m.handle);
      const postCountText = language === "en"
        ? `${mine.length} ${mine.length === 1 ? "post" : "posts"} (excluding anonymous posts)`
        : `${mine.length} ${t("myPosts")}`;
      box.append(el("p", "more", mine.length ? postCountText : t("noPosts")));
      mine.forEach((p) => box.append(buildPost(p)));
    }
    const out = el("button", "btn ghost", guest ? t("loginOrSignup") : t("logout"));
    out.type = "button";
    out.addEventListener("click", () => setSession(null));
    box.append(out);
  };

  /* ---------- router ---------- */
  const H = { home: "#/", search: "#/search", notifications: "#/notifications", profile: "#/profile", auth: "#/auth" };
  const views = $$("[data-view]");
  let current = "home";
  const fromHash = () => {
    const n = Object.keys(H).find((k) => H[k] === (location.hash || "#/")) || "home";
    return !session ? "auth" : n === "auth" ? "home" : n;
  };
  function show(name) {
    current = name;
    views.forEach((v) => (v.hidden = v.dataset.view !== name));
    document.body.classList.toggle("auth", name === "auth");
    $$(".rail nav a[data-r]").forEach((a) => {
      const on = a.dataset.r === name;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (name === "search") render();
    if (name === "notifications") renderNotes();
    if (name === "profile") renderProfile();
    window.scrollTo(0, 0);
  }
  function go(name) { location.hash = H[name]; show(fromHash()); }
  function setSession(s) {
    session = s;
    write(SESSION_KEY, s);
    location.hash = H[s ? "home" : "auth"];
    location.reload(); // rebuild the feed so delete buttons match the account
  }
  window.addEventListener("hashchange", () => show(fromHash()));

  /* ---------- log in, sign up, guest ---------- */
  const fail = (f, m) => { $(".err", f).textContent = m; };
  $$("[data-auth]").forEach((b) =>
    b.addEventListener("click", () => {
      const login = b.dataset.auth === "login";
      $("#loginForm").hidden = !login;
      $("#signupForm").hidden = login;
      $$("[data-auth]").forEach((x) => x.classList.toggle("on", x === b));
    })
  );
  $("#signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, v = Object.fromEntries(new FormData(f)), h = v.handle.trim().toLowerCase(), users = read(USERS_KEY, []);
    if (!v.name.trim()) return fail(f, t("nameRequired"));
    if (!/^[a-z0-9_]{3,20}$/.test(h)) return fail(f, t("usernameInvalid"));
    if (users.some((u) => u.handle === h)) return fail(f, t("usernameTaken"));
    if (v.pw.length < 8) return fail(f, t("passwordShort"));
    if (v.pw !== v.pw2) return fail(f, t("passwordMismatch"));
    const salt = crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
    const name = v.name.trim();
    users.push({ handle: h, name, salt, hash: await sha(salt + v.pw) });
    write(USERS_KEY, users);
    setSession({ type: "user", handle: h, name });
  });
  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, v = Object.fromEntries(new FormData(f));
    const u = read(USERS_KEY, []).find((x) => x.handle === v.handle.trim().toLowerCase());
    if (!u || (await sha(u.salt + v.pw)) !== u.hash) return fail(f, t("loginInvalid"));
    setSession({ type: "user", handle: u.handle, name: u.name });
  });
  $("#guestBtn").addEventListener("click", () => setSession({ type: "guest" }));

  /* ---------- init ---------- */
  applyLanguage();
  applyTheme();
  enhance(document);
  load().reverse().forEach((p) => feed.prepend(buildPost(p)));
  syncMe();
  try { box.value = localStorage.getItem(DRAFT_KEY) || ""; } catch { /* storage unavailable */ }
  refreshComposer();
  show(fromHash());
})();
// Member contribution: Updated JavaScript file.