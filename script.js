"use strict";

const STORAGE_KEY = "resume-json-generator-v1";
const THEME_STORAGE_KEY = "resume-json-generator-theme";

const form = document.getElementById("resume-form");
const outputContent = document.getElementById("output-content");
const outputLabel = document.getElementById("output-label");
const outputCount = document.getElementById("output-count");
const outputWrapper = document.getElementById("output-wrapper");
const themeToggle = document.getElementById("theme-toggle");
const phoneCountrySelect = document.getElementById("phoneCountry");
const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phone-error");

const urlFields = [
  {
    input: document.getElementById("linkedin"),
    error: document.getElementById("linkedin-error"),
  },
  {
    input: document.getElementById("github"),
    error: document.getElementById("github-error"),
  },
  {
    input: document.getElementById("portfolio"),
    error: document.getElementById("portfolio-error"),
  },
];
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const downloadBtn = document.getElementById("download-btn");
const copyBtn = document.getElementById("copy-btn");

let currentFormat = "json";
let saveTimeout;
let dynamicFieldCounter = 0;

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const ariaLabel = `Switch to ${theme === "dark" ? "light" : "dark"} theme`;
  themeToggle.setAttribute("aria-label", ariaLabel);
  themeToggle.setAttribute("title", ariaLabel);
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));

  themeToggle.querySelector(".theme-icon").textContent =
    theme === "dark" ? "☼" : "☾";
}

try {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(savedTheme === "light" ? "light" : "dark");
} catch (error) {
  console.error("Could not restore theme preference:", error);
  applyTheme("dark");
}

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (error) {
    console.error("Could not save theme preference:", error);
  }
});

function initPhoneCountrySelect() {
  COUNTRY_CODES.forEach(([iso, name, dialCode]) => {
    const option = document.createElement("option");
    option.value = iso;
    option.textContent = `${name} (+${dialCode})`;
    phoneCountrySelect.appendChild(option);
  });

  const defaultOption = phoneCountrySelect.querySelector(
    'option[value="IN"]'
  );

  if (defaultOption) {
    defaultOption.defaultSelected = true;
    defaultOption.selected = true;
  }
}

function getDialCode(iso) {
  const country = COUNTRY_CODES.find(([code]) => code === iso);
  return country ? country[2] : "";
}

function findCountryByDialCode(dialCode, preferredIso = null) {
  const matches = COUNTRY_CODES.filter(([, , code]) => code === dialCode);
  if (matches.length === 0) return null;
  if (preferredIso) {
    const preferred = matches.find(([iso]) => iso === preferredIso);
    if (preferred) return preferred[0];
  }
  return matches[0][0];
}
function updateValidationFeedback(input, errorElement, message) {
  const hasError = Boolean(message);

  errorElement.textContent = message;
  input.classList.toggle("invalid", hasError);
  input.setAttribute("aria-invalid", String(hasError));
}

function validatePhoneNumber() {
  const number = phoneInput.value.trim();

  if (!number) {
    phoneInput.setCustomValidity("");
    updateValidationFeedback(phoneInput, phoneError, "");
    return;
  }

  const cleaned = number.replace(/[\s().-]/g, "");

  if (!/^\d+$/.test(cleaned)) {
    const message =
      "Phone number can only contain digits, spaces, ( ) . -";

    phoneInput.setCustomValidity(message);
    updateValidationFeedback(phoneInput, phoneError, message);
    return;
  }

  if (cleaned.length < 4) {
    const message = "Phone number must have at least 4 digits.";

    phoneInput.setCustomValidity(message);
    updateValidationFeedback(phoneInput, phoneError, message);
    return;
  }

  const dialCode = getDialCode(phoneCountrySelect.value);
  const totalDigits = dialCode.length + cleaned.length;

  if (totalDigits > 15) {
    const message =
      `Phone number with country code (+${dialCode}) cannot exceed 15 digits (currently ${totalDigits}).`;

    phoneInput.setCustomValidity(message);
    updateValidationFeedback(phoneInput, phoneError, message);
    return;
  }

  phoneInput.setCustomValidity("");
  updateValidationFeedback(phoneInput, phoneError, "");
}
function validateUrl(input, errorElement) {
  const value = input.value.trim();

  if (!value) {
    input.setCustomValidity("");
    updateValidationFeedback(input, errorElement, "");
    return;
  }

  if (input.validity.typeMismatch) {
    const message =
      "Please enter a valid URL, including https://.";

    input.setCustomValidity(message);
    updateValidationFeedback(input, errorElement, message);
    return;
  }

  input.setCustomValidity("");
  updateValidationFeedback(input, errorElement, "");
}

function validateFullName() {
  const name = fullNameInput.value.trim();

  if (!name) {
    fullNameInput.setCustomValidity("");
    fullNameInput.classList.remove("invalid");
    return;
  }

  if (/\d/.test(name)) {
    fullNameInput.setCustomValidity("Full name cannot contain numbers");
    fullNameInput.classList.add("invalid");
    return;
  }

  fullNameInput.setCustomValidity("");
  fullNameInput.classList.remove("invalid");
}

initPhoneCountrySelect();

phoneCountrySelect.addEventListener("change", validatePhoneNumber);

phoneInput.addEventListener("input", validatePhoneNumber);

phoneInput.addEventListener("paste", (event) => {
  const text = event.clipboardData.getData("text");
  if (!text || (!text.startsWith("+") && !text.startsWith("00"))) return;

  const parsed = splitInternationalPhone(text, phoneCountrySelect.value);
  if (parsed) {
    event.preventDefault();
    phoneCountrySelect.value = parsed.iso;
    phoneInput.value = parsed.national;
    validatePhoneNumber();
    scheduleSave();
  } else {
    phoneInput.setCustomValidity("Pick the country code from the list and enter only the local number.");
  }
});

phoneInput.addEventListener("change", () => {
  const text = phoneInput.value.trim();
  if (!text || (!text.startsWith("+") && !text.startsWith("00"))) return;

  const parsed = splitInternationalPhone(text, phoneCountrySelect.value);
  if (parsed) {
    phoneCountrySelect.value = parsed.iso;
    phoneInput.value = parsed.national;
    validatePhoneNumber();
    scheduleSave();
  } else {
    phoneInput.setCustomValidity("Pick the country code from the list and enter only the local number.");
  }
});

fullNameInput.addEventListener("input", validateFullName);
emailInput.addEventListener("input", () => {
  emailInput.setCustomValidity("");
});

const sections = {
  education: {
    container: "education-list",
    template: "education-template",
    output: "education",
  },
  experience: {
    container: "experience-list",
    template: "experience-template",
    output: "experience",
  },
  projects: {
    container: "projects-list",
    template: "projects-template",
    output: "projects",
  },
  certifications: {
    container: "certifications-list",
    template: "certifications-template",
    output: "certifications",
  },
  achievements: {
    container: "achievements-list",
    template: "achievements-template",
    output: "achievements",
  },
  positions: {
    container: "positions-list",
    template: "positions-template",
    output: "positions",
  },
};

let counterId = 0;

function formatCharCount(length) {
  return `${length} ${length === 1 ? "character" : "characters"}`;
}

function updateCounter(textarea) {
  const counter = textarea.nextElementSibling;
  if (counter && counter.classList.contains("char-counter")) {
    counter.textContent = formatCharCount(textarea.value.length);
  }
}

function initCounter(textarea) {
  const existing = textarea.nextElementSibling;

  if (!existing || !existing.classList.contains("char-counter")) {
    const counter = document.createElement("span");
    counter.className = "char-counter";
    counter.id = `char-counter-${++counterId}`;
    textarea.insertAdjacentElement("afterend", counter);
    textarea.setAttribute(
      "aria-describedby",
      [textarea.getAttribute("aria-describedby"), counter.id]
        .filter(Boolean)
        .join(" ")
    );
  }

  updateCounter(textarea);
}

function refreshCounters() {
  document.querySelectorAll("textarea[data-counter]").forEach(initCounter);
}

function addEntry(sectionName, values = {}) {
  const section = sections[sectionName];
  if (!section) return;

  const container = document.getElementById(section.container);
  const template = document.getElementById(section.template);
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".repeat-card");

  card.querySelectorAll("[data-key]").forEach((input) => {
    const key = input.dataset.key;
    const id = `${sectionName}-${key}-${++dynamicFieldCounter}`;
    input.id = id;

    const label = input.closest(".field")?.querySelector("label");
    if (label) {
      label.htmlFor = id;
    }

    input.value = values[key] ?? "";
  });

  card.querySelectorAll("textarea[data-counter]").forEach(initCounter);

  container.appendChild(fragment);
  return container.lastElementChild;
}

function readEntry(card) {
  const entry = {};

  card.querySelectorAll("[data-key]").forEach((input) => {
    const key = input.dataset.key;
    const value = input.value.trim();

    if (value) {
      entry[key] = value;
    }
  });

  return entry;
}

function readEntries(sectionName) {
  const section = sections[sectionName];
  const container = document.getElementById(section.container);

  return Array.from(container.querySelectorAll(".repeat-card"))
    .map(readEntry)
    .filter((entry) => Object.keys(entry).length > 0);
}

function collectResume() {
  const data = new FormData(form);
  const personal = {
    fullName: data.get("fullName").trim(),
    email: data.get("email").trim(),
  };

  const optionalPersonalFields = [
    "location",
    "linkedin",
    "github",
    "portfolio",
  ];

  optionalPersonalFields.forEach((key) => {
    const value = data.get(key).trim();
    if (value) personal[key] = value;
  });

  const phoneNumber = phoneInput.value.trim().replace(/\s+/g, " ");
  if (phoneNumber) {
    const dialCode = getDialCode(phoneCountrySelect.value);
    personal.phone = `+${dialCode} ${phoneNumber}`;
  }

  const resume = {
    personal,
    summary: data.get("summary").trim(),
    education: readEntries("education"),
    skills: data
      .get("skills")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    experience: readEntries("experience"),
    projects: readEntries("projects"),
    certifications: readEntries("certifications"),
    achievements: readEntries("achievements"),
    positions: readEntries("positions"),
  };

  return resume;
}

function countFields(value) {
  if (Array.isArray(value)) {
    return value.reduce((total, item) => total + countFields(item), 0);
  }

  if (value !== null && typeof value === "object") {
    return Object.values(value).reduce(
      (total, item) => total + countFields(item),
      0
    );
  }

  if (typeof value === "string") return value.trim() ? 1 : 0;
  return 0;
}

function toPlainText(resume) {
  const lines = [];
  const add = (label, value) => {
    if (value) lines.push(`${label}: ${value}`);
  };

  const personal = resume.personal;

  lines.push(personal.fullName || "Resume");
  lines.push("=".repeat(Math.max(6, (personal.fullName || "Resume").length)));
  add("Email", personal.email);
  add("Phone", personal.phone);
  add("Location", personal.location);
  add("LinkedIn", personal.linkedin);
  add("GitHub", personal.github);
  add("Portfolio", personal.portfolio);

  if (resume.summary) {
    lines.push("", "PROFESSIONAL SUMMARY", resume.summary);
  }

  if (resume.education.length) {
    lines.push("", "EDUCATION");
    resume.education.forEach((item) => {
      lines.push(
        [item.degree, item.field].filter(Boolean).join(" — ") || "Education"
      );
      add("Institution", item.institution);
      add(
        "Duration",
        [item.startDate, item.endDate].filter(Boolean).join(" - ")
      );
      add("Grade", item.grade);
      lines.push("");
    });
  }

  if (resume.skills.length) {
    lines.push("", "SKILLS", resume.skills.join(", "));
  }

  const groups = [
    [
      "EXPERIENCE",
      resume.experience,
      (item) => item.title || "Experience",
      [
        ["Company", "company"],
        ["Duration", null],
        ["Description", "description"],
      ],
    ],
    [
      "PROJECTS",
      resume.projects,
      (item) => item.name || "Project",
      [
        ["Technologies", "technologies"],
        ["Description", "description"],
        ["Project URL", "url"],
        ["Repository", "repository"],
      ],
    ],
    [
      "CERTIFICATIONS",
      resume.certifications,
      (item) => item.name || "Certification",
      [
        ["Issuer", "issuer"],
        ["Date", "date"],
        ["Credential URL", "url"],
      ],
    ],
    [
      "ACHIEVEMENTS",
      resume.achievements,
      (item) => item.title || "Achievement",
      [
        ["Description", "description"],
        ["Date", "date"],
      ],
    ],
    [
      "POSITIONS & LEADERSHIP",
      resume.positions,
      (item) => item.title || "Position",
      [
        ["Organization", "organization"],
        ["Duration", null],
        ["Description", "description"],
      ],
    ],
  ];

  groups.forEach(([heading, entries, getTitle, fields]) => {
    if (!entries.length) return;

    lines.push("", heading);

    entries.forEach((item) => {
      lines.push("", getTitle(item));

      fields.forEach(([label, key]) => {
        if (key === null) {
          add(
            "Duration",
            [item.startDate, item.endDate].filter(Boolean).join(" - ")
          );
        } else {
          add(label, item[key]);
        }
      });
    });
  });

  return lines.join("\n").trim() + "\n";
}

function renderOutput() {
  const resume = collectResume();
  const text =
    currentFormat === "json"
      ? JSON.stringify(resume, null, 2)
      : toPlainText(resume);

  outputContent.textContent = text;
  outputLabel.textContent =
    currentFormat === "json" ? "resume.json" : "resume.txt";
  const fieldCount = countFields(resume);
  outputCount.textContent = `${fieldCount} values`;
  outputWrapper.classList.toggle("is-empty", fieldCount === 0);

  const isEmpty = fieldCount === 0;
  downloadBtn.disabled = isEmpty;
  copyBtn.disabled = isEmpty;
  downloadBtn.title = isEmpty ? "Fill in at least one field to download" : "";
  copyBtn.title = isEmpty ? "Fill in at least one field to copy" : "";
}

function saveToStorage() {
  try {
    const data = collectResume();
    data.phoneCountry = phoneCountrySelect.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Could not save resume data:", error);
  }
}

function scheduleSave() {
  renderOutput();

  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveToStorage, 250);
}

function splitInternationalPhone(text, preferredIso) {
  if (!text || typeof text !== "string") return null;

  let normalizedText = text;
  if (text.startsWith("00")) {
    normalizedText = "+" + text.slice(2);
  }

  if (!normalizedText.startsWith("+")) return null;

  const digitsAfterPlus = normalizedText.slice(1).match(/^\d+/);
  if (!digitsAfterPlus) return null;

  const allDigits = digitsAfterPlus[0];
  let matchedDialCode = "";
  let matchedCountryIso = null;

  for (let i = allDigits.length; i >= 1; i--) {
    const candidateDialCode = allDigits.slice(0, i);
    const matches = COUNTRY_CODES.filter(
      ([, , code]) => code === candidateDialCode
    );

    if (matches.length > 0) {
      matchedDialCode = candidateDialCode;
      if (preferredIso) {
        const preferred = matches.find(([iso]) => iso === preferredIso);
        if (preferred) {
          matchedCountryIso = preferred[0];
          break;
        }
      }
      matchedCountryIso = matches[0][0];
      break;
    }
  }

  if (!matchedCountryIso) return null;

  const restAfterDialCode = normalizedText.slice(1 + matchedDialCode.length);
  const national = restAfterDialCode.trimStart();

  return { iso: matchedCountryIso, national };
}

function restoreResume(resume) {
  if (!resume || typeof resume !== "object") return;

  const personal = (resume.personal && typeof resume.personal === "object" && !Array.isArray(resume.personal))
    ? resume.personal
    : {};

  Object.entries(personal).forEach(([key, value]) => {
    if (key === "phone") return;
    const input = form.elements.namedItem(key);
    if (input && typeof value === "string") input.value = value;
  });

  if (personal.phone && typeof personal.phone === "string") {
    const parsed = splitInternationalPhone(personal.phone, resume.phoneCountry || null);
    if (parsed) {
      phoneCountrySelect.value = parsed.iso;
      phoneInput.value = parsed.national;
    } else {
      phoneInput.value = personal.phone;
    }
  }

  const summary = form.elements.namedItem("summary");
  if (summary) summary.value = resume.summary || "";

  const skills = form.elements.namedItem("skills");
  if (skills) {
    skills.value = Array.isArray(resume.skills) ? resume.skills.join(", ") : "";
  }

  Object.entries(sections).forEach(([name, section]) => {
    try {
      const container = document.getElementById(section.container);
      container.replaceChildren();

      const entries = Array.isArray(resume[section.output])
        ? resume[section.output].filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry))
        : [];

      entries.forEach((entry) => addEntry(name, entry));
    } catch (error) {
      console.error(`Could not restore ${name} section:`, error);
    }
  });

  emailInput.setCustomValidity("");
  validateFullName();
  validatePhoneNumber();
  urlFields.forEach(({ input, error }) => {
  validateUrl(input, error);
});
  refreshCounters();
  renderOutput();
}

function clearSavedResume() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}-backup`);
    return true;
  } catch (error) {
    console.error("Could not clear local storage:", error);
    return false;
  }
}

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    addEntry(button.dataset.add);
    scheduleSave();
  });
});

document.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-btn");
  if (!button) return;

  button.closest(".repeat-card").remove();
  scheduleSave();
});

form.addEventListener("input", (event) => {
  if (event.target.matches("textarea[data-counter]")) {
    updateCounter(event.target);
  }

  scheduleSave();
});

document.getElementById("clear-skills-btn").addEventListener("click", () => {
  const skills = form.elements.namedItem("skills");
  skills.value = "";
  scheduleSave();
  skills.focus();
});

document.getElementById("clear-summary-btn").addEventListener("click", () => {
  const summary = form.elements.namedItem("summary");
  summary.value = "";
  updateCounter(summary);
  scheduleSave();
  summary.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  renderOutput();
  saveToStorage();
});

const formatTabs = Array.from(
  document.querySelectorAll('[role="tab"][data-format]')
);

function activateFormatTab(selectedTab, moveFocus = false) {
  formatTabs.forEach((tab) => {
    const active = tab === selectedTab;

    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.setAttribute("tabindex", active ? "0" : "-1");
  });

  currentFormat = selectedTab.dataset.format;

  if (moveFocus) {
    selectedTab.focus();
  }

  renderOutput();
}

formatTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateFormatTab(tab);
  });

  tab.addEventListener("keydown", (event) => {
    let nextTab;

    if (event.key === "ArrowRight") {
      nextTab = formatTabs[(formatTabs.indexOf(tab) + 1) % formatTabs.length];
    } else if (event.key === "ArrowLeft") {
      nextTab =
        formatTabs[
          (formatTabs.indexOf(tab) - 1 + formatTabs.length) %
            formatTabs.length
        ];
    } else {
      return;
    }

    event.preventDefault();
    activateFormatTab(nextTab, true);
  });
});

function ensureResumeValid() {
  if (!fullNameInput.value.trim()) {
    fullNameInput.setCustomValidity("Please fill out this field.");
  }
  if (!emailInput.value.trim()) {
    emailInput.setCustomValidity("Please fill out this field.");
  }
  return form.reportValidity();
}

const copyButton = document.getElementById("copy-btn");
const copyStatus = document.getElementById("copy-status");

let copyStatusTimeout;

function showCopyStatus(message, type) {
  clearTimeout(copyStatusTimeout);

  copyStatus.textContent = message;
  copyStatus.className = `copy-status ${type}`;

  copyStatusTimeout = setTimeout(() => {
    copyStatus.textContent = "";
    copyStatus.className = "copy-status";
  }, 5000);
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn("Clipboard API failed. Trying fallback:", error);
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("Fallback copy failed");
    }
    return true;
  } finally {
    textArea.remove();
  }
}

copyButton.addEventListener("click", async () => {
  
  if (!ensureResumeValid()) return;
  
  renderOutput();

  const text = outputContent.textContent;

  try {
    const copied = await copyToClipboard(text);

    if (copied) {
      showCopyStatus("Copied successfully!", "is-success");
    } else {
      showCopyStatus(
        "Unable to copy. Please copy the output manually.",
        "is-error"
      );
    }
  } catch (error) {
    console.error("Clipboard access failed:", error);

    showCopyStatus(
      "Unable to copy. Please select and copy the output manually.",
      "is-error"
    );
  }
});

document.getElementById("download-btn").addEventListener("click", () => {
  if (!ensureResumeValid()) return;
  
  renderOutput();
  if (isResumeBlank()) return;
  const extension = currentFormat === "json" ? "json" : "txt";
  const mimeType = currentFormat === "json" ? "application/json" : "text/plain";

  const blob = new Blob([outputContent.textContent], {
    type: `${mimeType};charset=utf-8`,
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `resume.${extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

const resetDialog = document.getElementById("reset-dialog");
const cancelResetBtn = document.getElementById("cancel-reset-btn");
const confirmResetBtn = document.getElementById("confirm-reset-btn");
const resetBtn = document.getElementById("reset-btn");

// A resume is blank when no field in it holds any text
function isResumeBlank() {
  return countFields(collectResume()) === 0;
}

// Clear the form, repeatable sections, saved data and output
function resetResume() {
  form.reset();

  Object.values(sections).forEach((section) => {
    document.getElementById(section.container).replaceChildren();
  });

  clearTimeout(saveTimeout);
  clearSavedResume();
  emailInput.setCustomValidity("");
  validateFullName();
  validatePhoneNumber();
  refreshCounters();
  renderOutput();
}

// Ask for confirmation only when there is something to lose
resetBtn.addEventListener("click", () => {
  if (isResumeBlank()) {
    resetResume();
    return;
  }

  resetDialog.showModal();
});

// Close the dialog without resetting anything
cancelResetBtn.addEventListener("click", () => {
  resetDialog.close();
});

// Close the dialog when Escape is pressed
resetDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  resetDialog.close();
});

// Reset the resume only after confirmation
confirmResetBtn.addEventListener("click", () => {
  resetDialog.close();
  resetResume();
});

refreshCounters();

try {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      restoreResume(JSON.parse(saved));
    } catch (error) {
      console.error("Could not restore saved resume:", error);
      const backupKey = `${STORAGE_KEY}-backup`;
      if (!localStorage.getItem(backupKey)) {
        try {
          localStorage.setItem(backupKey, saved);
        } catch (backupError) {
          console.error("Could not save backup:", backupError);
        }
      }
      renderOutput();
    }
  } else {
    renderOutput();
  }
} catch (error) {
  console.error("Could not restore saved resume:", error);
  renderOutput();
}

// --- Back to Top Button ---
const backToTopBtn = document.getElementById("backToTopBtn");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove("hidden")
    } else {
      backToTopBtn.classList.add("hidden")
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
