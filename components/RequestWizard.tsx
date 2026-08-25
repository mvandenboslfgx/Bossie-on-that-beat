"use client";

import { FormEvent, useMemo, useState } from "react";

const songTypes = [
  "Personal Song",
  "Birthday Song",
  "Love Song",
  "Wedding Song",
  "Memorial / Tribute",
  "Company Song",
  "Sports / Football Song",
  "Party Anthem",
  "Rap Track",
  "EDM Track",
  "Cinematic Soundtrack",
  "Custom Music",
  "Other",
];

const vocalOptions = [
  "Male",
  "Female",
  "Male + Female",
  "Rap",
  "Singing",
  "Choir",
  "Operatic",
  "Growls",
  "Instrumental",
  "Surprise Me",
];

const languages = [
  "Dutch",
  "English",
  "Albanian",
  "German",
  "French",
  "Spanish",
  "Italian",
  "Other",
  "Multiple languages",
];

type FormData = Record<string, string | string[] | boolean>;

export default function RequestWizard() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState<FormData>({
    genres: [],
    songType: "",
    vocals: "Surprise Me",
    language: "English",
    commercialUse: false,
  });

  const steps = ["Type", "Sound", "Story", "Details", "Review"];
  const progress = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step, steps.length]);

  function update(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleGenre(genre: string) {
    setForm((prev) => {
      const current = Array.isArray(prev.genres) ? prev.genres : [];
      return {
        ...prev,
        genres: current.includes(genre) ? current.filter((g) => g !== genre) : [...current, genre],
      };
    });
  }

  async function submit() {
    setStatus("sending");
    try {
      const payload = {
        name: form.name,
        email: form.email,
        company: form.company,
        country: form.country,
        projectType: form.songType,
        genre: Array.isArray(form.genres) ? form.genres.join(", ") : "",
        language: form.language,
        vocals: form.vocals,
        brief: [
          form.story,
          form.namesInclude ? `Names to include: ${form.namesInclude}` : "",
          form.namesExclude ? `Names to exclude: ${form.namesExclude}` : "",
          form.emotions ? `Emotions: ${form.emotions}` : "",
          form.audience ? `Audience: ${form.audience}` : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
        references: form.references,
        deadline: form.deadline,
        budget: form.budget,
        extra: form.commercialUse ? "Commercial use requested." : "Personal use.",
        consent: "yes",
      };

      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function next(event?: FormEvent) {
    event?.preventDefault();
    if (step < steps.length - 1) setStep(step + 1);
    else submit();
  }

  return (
    <div className="request-wizard">
      <div className="wizard-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="wizard-step-label">
        Step {step + 1} of {steps.length} — {steps[step]}
      </p>

      {step === 0 && (
        <div className="wizard-panel">
          <h2>What kind of song?</h2>
          <div className="wizard-cards">
            {songTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={`wizard-card ${form.songType === type ? "selected" : ""}`}
                onClick={() => update("songType", type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="wizard-panel">
          <h2>Sound direction</h2>
          <div className="wizard-chips">
            {["Cinematic", "Metal", "Electronic", "Rap", "Pop", "World", "Orchestral", "Other / Custom"].map(
              (genre) => (
                <button
                  key={genre}
                  type="button"
                  className={`filter-chip ${Array.isArray(form.genres) && form.genres.includes(genre) ? "active" : ""}`}
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </button>
              ),
            )}
          </div>
          <label>
            <span>Vocals</span>
            <select value={String(form.vocals)} onChange={(e) => update("vocals", e.target.value)}>
              {vocalOptions.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Language</span>
            <select value={String(form.language)} onChange={(e) => update("language", e.target.value)}>
              {languages.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-panel">
          <h2>The story</h2>
          <label>
            <span>What is the song about? *</span>
            <textarea
              required
              rows={5}
              value={String(form.story ?? "")}
              onChange={(e) => update("story", e.target.value)}
            />
          </label>
          <label>
            <span>Names to include</span>
            <input value={String(form.namesInclude ?? "")} onChange={(e) => update("namesInclude", e.target.value)} />
          </label>
          <label>
            <span>Names NOT to include</span>
            <input value={String(form.namesExclude ?? "")} onChange={(e) => update("namesExclude", e.target.value)} />
          </label>
          <label>
            <span>Emotions / vibe</span>
            <input value={String(form.emotions ?? "")} onChange={(e) => update("emotions", e.target.value)} />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="wizard-panel">
          <h2>Project details</h2>
          <div className="request-grid two">
            <label>
              <span>Name *</span>
              <input required value={String(form.name ?? "")} onChange={(e) => update("name", e.target.value)} />
            </label>
            <label>
              <span>Email *</span>
              <input
                required
                type="email"
                value={String(form.email ?? "")}
                onChange={(e) => update("email", e.target.value)}
              />
            </label>
          </div>
          <label>
            <span>Reference links</span>
            <textarea
              rows={3}
              value={String(form.references ?? "")}
              onChange={(e) => update("references", e.target.value)}
              placeholder="Spotify / YouTube links for vibe and energy — not for copying."
            />
          </label>
          <div className="request-grid two">
            <label>
              <span>Deadline</span>
              <input type="date" value={String(form.deadline ?? "")} onChange={(e) => update("deadline", e.target.value)} />
            </label>
            <label>
              <span>Budget indication</span>
              <select value={String(form.budget ?? "To discuss")} onChange={(e) => update("budget", e.target.value)}>
                <option>Under €250</option>
                <option>€250 – €500</option>
                <option>€500 – €1,000</option>
                <option>€1,000 – €2,500</option>
                <option>€2,500+</option>
                <option>To discuss</option>
              </select>
            </label>
          </div>
          <label className="consent">
            <input
              type="checkbox"
              checked={Boolean(form.commercialUse)}
              onChange={(e) => update("commercialUse", e.target.checked)}
            />
            <span>This is for commercial use.</span>
          </label>
        </div>
      )}

      {step === 4 && (
        <div className="wizard-panel">
          <h2>Review your request</h2>
          <div className="review-block">
            <p>
              <strong>Type:</strong> {String(form.songType)}
            </p>
            <p>
              <strong>Genres:</strong> {Array.isArray(form.genres) ? form.genres.join(", ") : "—"}
            </p>
            <p>
              <strong>Story:</strong> {String(form.story ?? "—")}
            </p>
            <p>
              <strong>Contact:</strong> {String(form.name)} · {String(form.email)}
            </p>
          </div>
        </div>
      )}

      <div className="wizard-nav">
        {step > 0 && (
          <button type="button" className="button button-ghost" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        <button type="button" className="button button-gold" onClick={next} disabled={status === "sending"}>
          {step === steps.length - 1 ? (status === "sending" ? "Sending…" : "Submit request ↗") : "Continue ↗"}
        </button>
      </div>

      {status === "sent" && <p className="form-success">Request received. Bossie will review your brief.</p>}
      {status === "error" && <p className="form-error">Could not send request. Please try again later.</p>}
    </div>
  );
}
