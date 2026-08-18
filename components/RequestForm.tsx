"use client";

import { FormEvent, useState } from "react";

const projectTypes = [
  "Original song / production",
  "Custom beat / instrumental",
  "Remix",
  "Cinematic / soundtrack",
  "Song for a person or event",
  "Brand / commercial music",
  "Collaboration",
  "Other",
];

export default function RequestForm(){
  const [status,setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try{
      const response = await fetch("/api/request",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data),
      });
      if(!response.ok) throw new Error("Request failed");
      form.reset();
      setStatus("sent");
    }catch{
      setStatus("error");
    }
  }

  return <form className="request-form" onSubmit={submit}>
    <div aria-hidden="true" style={{position:"absolute",left:"-9999px",width:1,height:1,overflow:"hidden"}}><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

    <div className="request-grid two">
      <label><span>Name *</span><input required name="name" autoComplete="name" placeholder="Your name" /></label>
      <label><span>Email *</span><input required type="email" name="email" autoComplete="email" placeholder="you@example.com" /></label>
    </div>

    <div className="request-grid two">
      <label><span>Company / artist name</span><input name="company" placeholder="Optional" /></label>
      <label><span>Country</span><input name="country" placeholder="Where are you based?" /></label>
    </div>

    <label><span>What would you like to request? *</span><select required name="projectType" defaultValue=""><option value="" disabled>Select project type</option>{projectTypes.map(item=><option key={item}>{item}</option>)}</select></label>

    <div className="request-grid two">
      <label><span>Genre / direction *</span><input required name="genre" placeholder="e.g. cinematic metal, EDM, rap, orchestral" /></label>
      <label><span>Language</span><input name="language" placeholder="e.g. English, Dutch, instrumental" /></label>
    </div>

    <label><span>Describe the idea *</span><textarea required name="brief" rows={7} placeholder="Tell Bossie what you want the track to feel like, the story, atmosphere, energy, audience and what makes the project special." /></label>

    <label><span>Reference tracks / links</span><textarea name="references" rows={4} placeholder="Paste Spotify, YouTube or other reference links. These are for direction only." /></label>

    <div className="request-grid three">
      <label><span>Vocals</span><select name="vocals" defaultValue="No preference"><option>Male</option><option>Female</option><option>Duet / multiple voices</option><option>Instrumental</option><option>No preference</option></select></label>
      <label><span>Deadline</span><input type="date" name="deadline" /></label>
      <label><span>Budget indication</span><select name="budget" defaultValue="To discuss"><option>Under €250</option><option>€250 – €500</option><option>€500 – €1,000</option><option>€1,000 – €2,500</option><option>€2,500+</option><option>To discuss</option></select></label>
    </div>

    <fieldset className="rights-box"><legend>What do you need the music for?</legend><div className="check-grid">
      <label><input type="checkbox" name="usage_social" value="yes" /> Social media</label>
      <label><input type="checkbox" name="usage_streaming" value="yes" /> Streaming release</label>
      <label><input type="checkbox" name="usage_youtube" value="yes" /> YouTube / video</label>
      <label><input type="checkbox" name="usage_commercial" value="yes" /> Commercial / brand</label>
      <label><input type="checkbox" name="usage_event" value="yes" /> Event / personal use</label>
      <label><input type="checkbox" name="usage_other" value="yes" /> Other</label>
    </div></fieldset>

    <label><span>Anything else?</span><textarea name="extra" rows={4} placeholder="Credits, delivery format, stems, special requirements, rights questions, etc." /></label>

    <label className="consent"><input required type="checkbox" name="consent" value="yes" /> <span>I confirm the information above is accurate and I may be contacted about this request.</span></label>

    <button className="request-submit" type="submit" disabled={status==="sending"}>{status==="sending"?"Sending…":"Submit project request ↗"}</button>
    {status==="sent" && <p className="form-success">Request received. Bossie can review the brief and follow up using the email address you provided.</p>}
    {status==="error" && <p className="form-error">The request could not be sent yet. Please try again later.</p>}
  </form>
}
