import React from "react";
import { Link } from "react-router-dom";

// TODO: replace with your real support address.
const CONTACT_EMAIL = "support@example.com";

function InfoPage({ title, intro, children }) {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
      {intro && <p className="mt-2 text-muted">{intro}</p>}
      <div className="glass mt-8 space-y-6 p-6 text-sm leading-relaxed text-ink-soft sm:p-8 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-ink">
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
    </InfoPage>
  );
}

export function Privacy() {
  return (
    <InfoPage title="Privacy Policy" intro="What we store and why.">
      <section>
        <h2>Data we store</h2>
        <p>Your email address, the name you sign up with, your profile status, and the jobs you apply to (title, company, location, salary, link and application stage). This is stored in Google Firebase.</p>
      </section>
      <section>
        <h2>How it's used</h2>
        <p>Only to run your account and show your job tracker. We don't sell your data.</p>
      </section>
      <section>
        <h2>Third parties</h2>
        <p>Sign-in is handled by Firebase Authentication (including Google and GitHub sign-in). Job listings come from Adzuna; clicking a job takes you to the advertiser's site, which has its own policy.</p>
      </section>
      <section>
        <h2>Deleting your data</h2>
        <p>You can remove saved jobs at any time from Applied Jobs. To delete your account, contact <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand hover:text-brand-hover">{CONTACT_EMAIL}</a>.</p>
      </section>
    </InfoPage>
  );
}

export function Terms() {
  return (
    <InfoPage title="Terms of Use">
      <section>
        <h2>Using the service</h2>
        <p>Job Swipr is provided as-is to help you find and track job applications. Keep your login details safe and don't misuse the service.</p>
      </section>
      <section>
        <h2>Job listings</h2>
        <p>Listings are supplied by third parties. We don't guarantee they are accurate, current or still open, and applying through Job Swipr doesn't submit an application to the employer. Always complete the application on the employer's site.</p>
      </section>
    </InfoPage>
  );
}

const faqs = [
  ["Does swiping left actually apply for the job?", "It saves the job to your Applied Jobs tracker and opens the listing so you can finish applying on the employer's site."],
  ["Can I use buttons instead of swiping?", "Yes. Use the Apply and Pass buttons under each card."],
  ["How do I track where I am with an application?", "On Applied Jobs, change each job's stage (Applied, Interviewing, Offer or Rejected) and filter by stage."],
  ["Where do the jobs come from?", "Live UK listings from the Adzuna jobs API."],
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
