import { NextResponse } from "next/server";

const required = ["name","email","projectType","genre","brief","consent"] as const;

function clean(value: unknown, max = 5000){
  return String(value ?? "").trim().slice(0,max);
}

function isEmail(value:string){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request){
  try{
    const body = await request.json();

    // Honeypot: legitimate clients never fill this field.
    if(clean(body.website,200)) return NextResponse.json({ok:true});

    for(const key of required){
      if(!clean(body[key],5000)) return NextResponse.json({error:`Missing ${key}`},{status:400});
    }

    const email = clean(body.email,320);
    if(!isEmail(email)) return NextResponse.json({error:"Invalid email"},{status:400});

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.REQUEST_TO_EMAIL;
    const from = process.env.REQUEST_FROM_EMAIL || "Bossie Requests <onboarding@resend.dev>";

    if(!apiKey || !to){
      return NextResponse.json({error:"Request delivery is not configured yet."},{status:503});
    }

    const usages = [
      ["usage_social","Social media"],
      ["usage_streaming","Streaming release"],
      ["usage_youtube","YouTube / video"],
      ["usage_commercial","Commercial / brand"],
      ["usage_event","Event / personal use"],
      ["usage_other","Other"],
    ].filter(([key])=>clean(body[key],10)==="yes").map(([,label])=>label).join(", ") || "Not specified";

    const subject = `Bossie project request — ${clean(body.projectType,120)} — ${clean(body.name,120)}`;
    const text = [
      "NEW BOSSIE PROJECT REQUEST",
      "",
      `Name: ${clean(body.name,150)}`,
      `Email: ${email}`,
      `Company / artist: ${clean(body.company,200) || "—"}`,
      `Country: ${clean(body.country,120) || "—"}`,
      `Project type: ${clean(body.projectType,180)}`,
      `Genre / direction: ${clean(body.genre,300)}`,
      `Language: ${clean(body.language,120) || "—"}`,
      `Vocals: ${clean(body.vocals,120) || "—"}`,
      `Deadline: ${clean(body.deadline,80) || "—"}`,
      `Budget: ${clean(body.budget,120) || "—"}`,
      `Usage: ${usages}`,
      "",
      "IDEA / BRIEF",
      clean(body.brief,5000),
      "",
      "REFERENCES",
      clean(body.references,3000) || "—",
      "",
      "EXTRA NOTES",
      clean(body.extra,3000) || "—",
    ].join("\n");

    const response = await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{
        Authorization:`Bearer ${apiKey}`,
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        from,
        to:[to],
        reply_to:email,
        subject,
        text,
      }),
    });

    if(!response.ok){
      console.error("Bossie request email failed", response.status, await response.text());
      return NextResponse.json({error:"Delivery failed"},{status:502});
    }

    return NextResponse.json({ok:true});
  }catch(error){
    console.error("Bossie request endpoint error",error);
    return NextResponse.json({error:"Invalid request"},{status:400});
  }
}
