// Smooth scroll for internal links (if not already handled by CSS)
document.addEventListener("click", (e) => {
  const target = e.target.closest('a[href^="#"]');
  if (!target) return;
  const href = target.getAttribute("href");
  if (!href || href.length < 2) return;
  const el = document.querySelector(href);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Dark / light mode toggle with localStorage
(function setupThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("grynk-theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("grynk-theme", "dark");
    }
  });
})();

// Hero typing animation
(function heroTyping() {
  const el = document.getElementById("hero-typing");
  if (!el) return;
  const phrases = [
    "The Scripting Language for the Modern Internet",
    "Blazing fast like Rust, readable like Python",
    "Zero imports. Infinite possibilities.",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      if (charIndex > phrase.length) {
        deleting = true;
        setTimeout(tick, 1200);
        el.textContent = phrase;
        return;
      }
    } else {
      charIndex--;
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    el.textContent = phrase.slice(0, charIndex);
    const delay = deleting ? 40 : 70;
    setTimeout(tick, delay);
  }

  tick();
})();

// Reveal on scroll
(function scrollReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach((el) => el.classList.add("reveal-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => observer.observe(el));
})();

// Feature accordions
(function featureAccordions() {
  const headers = document.querySelectorAll("[data-accordion]");
  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const card = header.closest(".feature-card");
      if (!card) return;
      const alreadyOpen = card.classList.contains("open");

      // Close all
      document.querySelectorAll(".feature-card.open").forEach((c) => {
        if (c === card) return;
        c.classList.remove("open");
      });

      if (!alreadyOpen) {
        card.classList.add("open");
      } else {
        card.classList.remove("open");
      }
    });
  });
})();

// Copy-to-clipboard for code snippets
(function copyButtons() {
  function copyTextFromId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.innerText || el.textContent || "";
    if (!navigator.clipboard) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
      return;
    }
    navigator.clipboard.writeText(text).catch(() => {});
  }

  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy-target");
      if (!targetId) return;
      copyTextFromId(targetId);
      const original = btn.textContent;
      btn.textContent = "Copied!";
      btn.classList.add("border-grylime", "text-grylime");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("border-grylime", "text-grylime");
      }, 1200);
    });
  });
})();

// Simple mock "execution" for the playgrounds
(function playgrounds() {
  const runButtons = document.querySelectorAll(".run-btn");
  if (!runButtons.length) return;

  function mockRun(id, code) {
    switch (id) {
      case "vars":
        return [
          "Speed is 150, pow is 1024",
          "",
          "# (Mock output – Grynk runtime is simulated in the browser.)",
        ].join("\n");
      case "control":
        return [
          "Item 1 is Medium",
          "Item 2 is Medium",
          "Item 3 is Medium",
          "",
          "# Loops & branches evaluated by the mock engine.",
        ].join("\n");
      case "pipeline": {
        // Try to actually simulate the canonical example
        try {
          const arr = [1, 5, 3, 7, 2];
          const result = arr
            .slice()
            .sort((a, b) => a - b)
            .map((x) => x * 2)
            .join(", ");
          return `1, 2, 3, 5, 7 |> *2 =>\n${result}\n\nsay "${result}"`;
        } catch {
          return "Mock pipeline executed.";
        }
      }
      case "http":
        return [
          "GRYNK APP",
          "==============",
          "",
          "Here is a joke: Why do programmers prefer dark mode? - Because light attracts bugs.",
          "",
          "# Real HTTP requests are not executed in this demo.",
        ].join("\n");
      case "ai":
        return [
          "1. Real-time monitoring dashboard for web APIs.",
          "2. AI-assisted automation scripts orchestrating multiple services.",
          "3. Desktop control center for your internet-scale tasks with GxGUI.",
          "",
          "# Generated by a mock AI helper.",
        ].join("\n");
      case "gui":
        return [
          "[GxGUI] Window 'Grynk App' 400x300 created.",
          "[GxGUI] Label: Welcome to Grynk!",
          "[GxGUI] Button: Click Me!",
          "",
          "Click Me! -> Clicked 1 times!",
          "Click Me! -> Clicked 2 times!",
          "",
          "# Actual GUI windows run in the native Grynk runtime.",
        ].join("\n");
      case "fs":
        return [
          'Reading "config.json"...',
          'Writing "config.out.json"...',
          "Config written!",
          "",
          "# Filesystem I/O is simulated in this demo.",
        ].join("\n");
      case "crypto":
        return [
          "Session 550e8400-e29b-41d4-a716-446655440000 has hash 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
          "",
          "# UUID and hash values are mock examples.",
        ].join("\n");
      default:
        return "Mock execution complete.";
    }
  }

  runButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-run-target");
      if (!id) return;
      const input = document.querySelector(
        `.playground-input[data-playground-id="${id}"]`
      );
      const output = document.getElementById(`output-${id}`);
      if (!input || !output) return;
      const code = input.value.trim();
      const result = mockRun(id, code);
      output.textContent = result;
    });
  });
})();

// API table search filter
(function apiSearch() {
  const input = document.getElementById("api-search");
  const table = document.getElementById("api-table");
  if (!input || !table) return;
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? "" : "none";
    });
  });
})();

// Fake REPL
(function fakeRepl() {
  const input = document.getElementById("repl-input");
  const output = document.getElementById("repl-output");
  const btn = document.getElementById("repl-run");
  if (!input || !output || !btn) return;

  function respond(cmd) {
    const trimmed = cmd.trim();
    if (!trimmed) return "";
    if (/^say\s+/i.test(trimmed)) {
      return trimmed.replace(/^say\s+/i, "") || "";
    }
    if (/gx\.ai\s*\(/i.test(trimmed)) {
      return [
        "gx.ai> Thinking with the modern internet in mind...",
        "-> Grynk is perfect for scripting web APIs, AI agents, and real-time automation.",
      ].join("\n");
    }
    if (/gx\.get\s*\(/i.test(trimmed)) {
      return [
        "gx.get> Fetching from the web...",
        "{",
        '  "status": 200,',
        '  "data": "This is a mocked HTTP response from the Grynk demo REPL."',
        "}",
      ].join("\n");
    }
    if (/\|\>\s*gx\.sort\(\)/i.test(trimmed)) {
      return "[1, 2, 3, 5, 7]  # mock-sorted pipeline output";
    }
    if (/help/i.test(trimmed)) {
      return [
        "Grynk help (excerpt):",
        "- gx.get(url), gx.post(url, data), gx.scrape(url, selector)",
        "- gx.ai(prompt), gx.ai_summarize(text), gx.ai_code(code)",
        "- gx.read(path), gx.write(path, data), gx.read_json(path)",
        "- gx.window(title, w, h), gx.button(text, fn), gx.gui_run()",
      ].join("\n");
    }
    return "Mock REPL: command accepted (real evaluation happens in the Grynk runtime).";
  }

  function run() {
    const cmd = input.value;
    if (!cmd.trim()) return;
    const response = respond(cmd);
    const prefix = `>>> ${cmd}\n${response}\n\n`;
    output.textContent = (output.textContent + "\n" + prefix).trim();
    input.value = "";
    output.scrollTop = output.scrollHeight;
  }

  btn.addEventListener("click", run);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run();
    }
  });
})();

// Footer year
(function footerYear() {
  const el = document.getElementById("footer-year");
  if (!el) return;
  el.textContent = new Date().getFullYear();
})();

