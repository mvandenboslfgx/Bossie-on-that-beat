"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { BossieMark } from "@/components/brand/BossieMark";

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

const STORY_MIN = 30;

export default function RequestWizard() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("Could not send request. Please try again later.");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    genres: [],
    songType: "",
    vocals: "Surprise Me",
    language: "English",
    commercialUse: false,
    privacyConsent: false,
  });
  const errorRef = useRef<HTMLParagraphElement>(null);

  const steps = ["Type", "Sound", "Story", "Details", "Review"];
  const progress = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step, steps.length]);

  function update(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldError(null);
  }

  function toggleGenre(genre: string) {
    setForm((prev) => {
      const current = Array.isArray(prev.genres) ? prev.genres : [];
      return {
        ...prev,
        genres: current.includes(genre) ? current.filter((g) => g !== genre) : [...current, genre],
      };
    });
    setFieldError(null);
  }

  function validateStep(current: number): string | null {
    if (current === 0 && !String(form.songType || "").trim()) {
      return "Please select a request type.";
    }
    if (current === 1) {
      const genres = Array.isArray(form.genres) ? form.genres : [];
      if (!genres.length) return "Please select at least one genre.";
      if (!String(form.vocals || "").trim()) return "Please choose a vocal direction.";
      if (!String(form.language || "").trim()) return "Please choose a language.";
    }
    if (current === 2) {
      const story = String(form.story ?? "").trim();
      if (story.length < STORY_MIN) {
        return `Tell us what your song should be about. Minimum ${STORY_MIN} characters.`;
      }
    }
    if (current === 3) {
      if (!String(form.name || "").trim()) return "Please enter your name.";
      if (!String(form.email || "").trim()) return "Please enter your email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email))) return "Please enter a valid email address.";
      if (!form.privacyConsent) return "Please accept the privacy consent to continue.";
    }
    if (current === 4) {
      for (let i = 0; i < 4; i += 1) {
        const err = validateStep(i);
        if (err) return err;
      }
    }
    return null;
  }

  async function submit() {
    const err = validateStep(4);
    if (err) {
      setFieldError(err);
      errorRef.current?.focus();
      return;
    }

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
          form.commercialUse ? "Rights / use: Commercial use requested." : "Rights / use: Personal use.",
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
      if (!response.ok) {
        setErrorMessage(
          response.status === 503
            ? "Mail delivery is temporarily unavailable. Your details are still here — please try again later or use Industry contact."
            : "Could not send request. Please try again later.",
        );
        throw new Error("failed");
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function next(event?: FormEvent) {
    event?.preventDefault();
    const err = validateStep(step);
    if (err) {
      setFieldError(err);
      queueMicrotask(() => errorRef.current?.focus());
      return;
    }
    setFieldError(null);
    if (step < steps.length - 1) setStep(step + 1);
    else submit();
  }

  const genresLabel = Array.isArray(form.genres) && form.genres.length ? form.genres.join(", ") : "";
  const projectId = useMemo(() => String(2900 + step + (form.songType ? 1 : 0)), [step, form.songType]);

  return (
    <div className="request-v3-layout">
      <div className="request-wizard">
      <div className="request-process">
        <p className="eyebrow">HOW IT WORKS</p>
        <ol>
          <li>Share the type, sound and story of your song.</li>
          <li>Bossie reviews your brief and replies with next steps.</li>
          <li>Production, revisions and delivery are confirmed per project.</li>
        </ol>
        <p className="request-process-note">
          No fixed prices or timelines are published here — every brief is scoped individually. Personal and commercial use
          are declared in your request.
        </p>
      </div>

      <div className="wizard-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="wizard-step-label">
        Step {step + 1} of {steps.length} — {steps[step]}
      </p>

      {fieldError && (
        <p ref={errorRef} className="form-error" role="alert" tabIndex={-1} id="wizard-field-error">
          {fieldError}
        </p>
      )}

      {step === 0 && (
        <div className="wizard-panel">
          <h2>What kind of song?</h2>
          <div className="wizard-cards" role="group" aria-label="Request type">
            {songTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={`wizard-card ${form.songType === type ? "selected" : ""}`}
                aria-pressed={form.songType === type}
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
          <div className="wizard-chips" role="group" aria-label="Genres" aria-describedby={fieldError ? "wizard-field-error" : undefined}>
            {["Cinematic", "Metal", "Electronic", "Rap", "Pop", "World", "Orchestral", "Other / Custom"].map(
              (genre) => (
                <button
                  key={genre}
                  type="button"
                  className={`filter-chip ${Array.isArray(form.genres) && form.genres.includes(genre) ? "active" : ""}`}
                  aria-pressed={Array.isArray(form.genres) && form.genres.includes(genre)}
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
              minLength={STORY_MIN}
              aria-invalid={Boolean(fieldError && step === 2)}
              aria-describedby={fieldError ? "wizard-field-error" : undefined}
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
              <input
                required
                aria-invalid={Boolean(fieldError && !String(form.name || "").trim())}
                value={String(form.name ?? "")}
                onChange={(e) => update("name", e.target.value)}
              />
            </label>
            <label>
              <span>Email *</span>
              <input
                required
                type="email"
                aria-invalid={Boolean(fieldError && step === 3)}
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
              <span>Deadline (optional)</span>
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
            <span>This is for commercial use / licensing.</span>
          </label>
          <label className="consent">
            <input
              type="checkbox"
              checked={Boolean(form.privacyConsent)}
              aria-invalid={Boolean(fieldError && !form.privacyConsent)}
              onChange={(e) => update("privacyConsent", e.target.checked)}
            />
            <span>
              I agree my details may be used to respond to this request. See <a href="/privacy">Privacy</a>.
            </span>
          </label>
        </div>
      )}

      {step === 4 && (
        <div className="wizard-panel">
          <h2>Review your request</h2>
          <div className="review-block">
            <div className="review-row">
              <p>
                <strong>Type:</strong> {String(form.songType)}
              </p>
              <button type="button" className="text-link" onClick={() => setStep(0)}>
                Edit
              </button>
            </div>
            <div className="review-row">
              <p>
                <strong>Genres:</strong> {genresLabel}
              </p>
              <button type="button" className="text-link" onClick={() => setStep(1)}>
                Edit
              </button>
            </div>
            <div className="review-row">
              <p>
                <strong>Vocals / language:</strong> {String(form.vocals)} · {String(form.language)}
              </p>
              <button type="button" className="text-link" onClick={() => setStep(1)}>
                Edit
              </button>
            </div>
            <div className="review-row">
              <p>
                <strong>Story:</strong> {String(form.story)}
              </p>
              <button type="button" className="text-link" onClick={() => setStep(2)}>
                Edit
              </button>
            </div>
            <div className="review-row">
              <p>
                <strong>Rights / use:</strong> {form.commercialUse ? "Commercial" : "Personal"}
              </p>
              <button type="button" className="text-link" onClick={() => setStep(3)}>
                Edit
              </button>
            </div>
            <div className="review-row">
              <p>
                <strong>Contact:</strong> {String(form.name)} · {String(form.email)}
              </p>
              <button type="button" className="text-link" onClick={() => setStep(3)}>
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="wizard-nav">
        {step > 0 && status !== "sent" && (
          <button type="button" className="button button-ghost" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        {status !== "sent" && (
          <button type="button" className="button button-gold" onClick={next} disabled={status === "sending"}>
            {step === steps.length - 1 ? (status === "sending" ? "Sending…" : "Submit request ↗") : "Continue ↗"}
          </button>
        )}
      </div>

      {status === "sent" && <p className="form-success">Request received. Bossie will review your brief.</p>}
      {status === "error" && (
        <p className="form-error" role="alert">
          {errorMessage}{" "}
          <button type="button" className="text-link" onClick={() => setStatus("idle")}>
            Retry
          </button>
        </p>
      )}
    </div>

      <aside className="bossie-project-card" aria-live="polite">
        <BossieMark size="md" decorative={false} />
        <p className="eyebrow">YOUR WORLD</p>
        <p className="project-id">PROJECT {projectId}</p>
        <dl>
          <div>
            <dt>Type</dt>
            <dd>{String(form.songType || "—")}</dd>
          </div>
          <div>
            <dt>Genre</dt>
            <dd>{genresLabel || "—"}</dd>
          </div>
          <div>
            <dt>Voice</dt>
            <dd>{String(form.vocals || "—")}</dd>
          </div>
          <div>
            <dt>Language</dt>
            <dd>{String(form.language || "—")}</dd>
          </div>
          <div>
            <dt>Mood</dt>
            <dd>{String(form.emotions || "Forming…")}</dd>
          </div>
        </dl>
        <p className="project-forming">{status === "sent" ? "Brief transmitted." : "YOUR WORLD IS FORMING…"}</p>
      </aside>
    </div>
  );
}
