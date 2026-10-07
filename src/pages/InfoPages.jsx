import React from "react";
import { Link } from "react-router-dom";
import { LEGAL } from "../legal/config.js";

const CONTACT_EMAIL = LEGAL.contactEmail;

const prose = [
  "[&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-ink",
  "[&_h3]:mb-1 [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-ink",
  "[&_p+p]:mt-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
  "[&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a:hover]:text-brand-hover",
  "[&_table]:mt-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:text-xs sm:[&_table]:text-sm",
  "[&_th]:border-b [&_th]:border-line [&_th]:bg-canvas [&_th]:p-2 [&_th]:font-semibold [&_th]:text-ink",
  "[&_td]:border-b [&_td]:border-line [&_td]:p-2 [&_td]:align-top",
].join(" ");

export function InfoPage({ title, intro, children }) {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
      {intro && <p className="mt-2 text-muted">{intro}</p>}
      <div className={`glass mt-8 space-y-6 p-6 text-sm leading-relaxed text-ink-soft sm:p-8 ${prose}`}>
        {children}
      </div>
    </article>
  );
}

export function About() {
  return (
    <InfoPage title="About Job Swipr" intro="Job hunting, one swipe at a time.">
      <section>
        <h2>What it is</h2>
        <p>Job Swipr shows live UK job listings as cards. Swipe left to apply and save the job to your tracker, or swipe right to pass.</p>
      </section>
      <section>
        <h2>How it works</h2>
        <p>Listings come from the Adzuna jobs API. Jobs you apply to are saved to your account so you can follow each application from "Applied" through to an offer.</p>
      </section>
      <p><Link to="/signup" className="font-medium text-brand hover:text-brand-hover">Create an account</Link> to get started.</p>
    </InfoPage>
  );
}

export function Contact() {
  return (
    <InfoPage title="Contact" intro="Questions, feedback or a bug to report? Get in touch.">
      <section>
        <h2>Email</h2>
        <p><a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand hover:text-brand-hover">{CONTACT_EMAIL}</a></p>
      </section>
      <section>
        <h2>Account help</h2>
        <p>Forgotten your password? Use the "Forgot password?" link on the <Link to="/login" className="font-medium text-brand hover:text-brand-hover">login page</Link>.</p>
      </section>
      <section>
        <h2>Your data and complaints</h2>
        <p>For privacy questions, data requests or complaints, email <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>. See our <Link to="/privacy">Privacy Policy</Link> for how we handle these.</p>
      </section>
      <section>
        <h2>Who runs Job Swipr</h2>
        <p>Job Swipr is an independent project run by {LEGAL.ownerName}, an individual based in {LEGAL.ownerCountry}. It is not a registered company.</p>
      </section>
    </InfoPage>
  );
}

const faqs = [
  ["Does swiping left actually apply for the job?", "It saves the job to your Applied Jobs tracker and opens the listing so you can finish applying on the employer's site."],
  ["Can I use buttons instead of swiping?", "Yes. Use the Apply and Pass buttons under each card."],
  ["How do I track where I am with an application?", "On Applied Jobs, change each job's stage (Applied, Interviewing, Offer or Rejected) and filter by stage."],
  ["Where do the jobs come from?", "Live UK listings from the Adzuna jobs API."],
  ["Who can use Job Swipr?", `Anyone in the UK aged ${LEGAL.minimumAge} or over.`],
  ["How do I get a copy of my data or delete my account?", "Go to your Profile page and use \"Download my data\" or \"Delete my account\"."],
  ["I forgot my password.", "Use the \"Forgot password?\" link on the login page, or Reset Password on your profile."],
];

export function FAQ() {
  return (
    <InfoPage title="FAQ" intro="Quick answers to common questions.">
      {faqs.map(([q, a]) => (
        <details key={q} className="group border-b border-line pb-4 last:border-0 last:pb-0">
          <summary className="cursor-pointer list-none font-semibold text-ink">{q}</summary>
          <p className="mt-2">{a}</p>
        </details>
      ))}
    </InfoPage>
  );
}
