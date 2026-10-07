import React from "react";
import { Link } from "react-router-dom";
import { InfoPage } from "./InfoPages.jsx";
import { LEGAL } from "../legal/config.js";

const Mail = ({ to }) => <a href={`mailto:${to}`}>{to}</a>;
const Ext = ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;

const Updated = () => <p className="text-xs text-subtle">Last updated: {LEGAL.effectiveDate}</p>;

const OwnerLine = () => <>{LEGAL.ownerName}, an individual based in {LEGAL.ownerCountry}</>;

export function Privacy() {
  return (
    <InfoPage title="Privacy Policy" intro="What personal data we collect, why we collect it, and the choices you have.">
      <Updated/>

      <section>
        <h2>1. Who we are</h2>
        <p>
          Job Swipr is an independent project run by <OwnerLine/>. It is not a registered company. In this
          policy, "we", "us" and "our" mean {LEGAL.ownerName}. We are the controller of your personal data,
          which means we decide how and why it is used.
          {LEGAL.icoRegistration && <> We are registered with the Information Commissioner's Office (ICO) under registration number {LEGAL.icoRegistration}.</>}
        </p>
        <p>For anything about your data, email <Mail to={LEGAL.contactEmail}/>.</p>
      </section>

      <section>
        <h2>2. The data we collect</h2>
        <h3>Data you give us</h3>
        <ul>
          <li><strong>Account details:</strong> your first and last name, email address and password. Your password is handled by Google Firebase Authentication and we never see it.</li>
          <li><strong>Profile status:</strong> the short status you can add on your profile page. Please do not include sensitive information such as health details in it.</li>
          <li><strong>Saved jobs:</strong> the jobs you swipe to apply for (job title, company, location, salary range, listing date and link), the date you saved them, and the stage you set (Applied, Interviewing, Offer or Rejected).</li>
          <li><strong>Your agreement to our terms:</strong> the version of our Terms and Privacy Policy you accepted, the time you accepted, and your confirmation that you are {LEGAL.minimumAge} or older.</li>
          <li><strong>Messages:</strong> anything you send us by email, such as questions, requests or complaints.</li>
        </ul>
        <h3>Data from sign-in providers</h3>
        <p>
          If you sign in with Google or GitHub, that provider shares your name, email address and profile picture
          link with us. We do not receive your password for those services.
        </p>
        <h3>Data collected automatically</h3>
        <p>
          Our hosting and database providers record technical information when you use the site, such as your
          IP address, browser type and the time of each request. This is used for security and to keep the
          service running. When you search for jobs, the search terms you enter are sent from our server to
          Adzuna. Your name, email and IP address are not sent to Adzuna.
        </p>
        <p>We do not use advertising, analytics or tracking tools, and we do not build profiles of you.</p>
      </section>

      <section>
        <h2>3. Why we use your data and our legal basis</h2>
        <p>Data protection law requires us to have a legal reason (a "lawful basis") for each use of your data.</p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr><th>What we do</th><th>Data used</th><th>Lawful basis</th></tr>
            </thead>
            <tbody>
              <tr><td>Create and run your account, and let you sign in</td><td>Account details, sign-in provider data</td><td>Contract: we need it to provide the service you signed up for</td></tr>
              <tr><td>Save and show your job tracker and profile status</td><td>Saved jobs, profile status</td><td>Contract</td></tr>
              <tr><td>Send password reset and account emails</td><td>Email address</td><td>Contract</td></tr>
              <tr><td>Keep a record that you accepted our Terms and confirmed your age</td><td>Agreement record</td><td>Legitimate interests: showing we met our legal duties and keeping under-age users off the service</td></tr>
              <tr><td>Keep the service secure and prevent misuse</td><td>Technical data, account details</td><td>Legitimate interests: protecting you, other users and the service</td></tr>
              <tr><td>Reply to your questions, rights requests and complaints</td><td>Messages, account details</td><td>Legal obligation, and legitimate interests for general questions</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          We do not sell your data, use it for marketing, or make decisions about you using automated means
          that have legal or similarly significant effects.
        </p>
      </section>

      <section>
        <h2>4. Who we share it with</h2>
        <p>We only share your data with service providers who process it on our behalf and under contract with us:</p>
        <ul>
          <li><strong>Google LLC and Google Ireland Ltd (Firebase):</strong> sign-in, database and, if used, hosting.</li>
          <li><strong>Vercel Inc.:</strong> website hosting and the server that fetches job listings.</li>
          <li><strong>Google and GitHub:</strong> only if you choose to sign in with them.</li>
        </ul>
        <p>
          Job listings come from Adzuna. When you open a job, you leave Job Swipr and go to Adzuna or the
          employer's website. Those sites have their own privacy policies and may use cookies. Saving a job in
          Job Swipr does not send your details to the employer.
        </p>
        <p>
          We may also share data if the law requires it or to protect our legal rights. If Job Swipr is ever
          handed over to someone else to run, we will tell you first, and the new owner will have to follow
          this policy.
        </p>
      </section>

      <section>
        <h2>5. International transfers</h2>
        <p>
          Google, Vercel and GitHub may store or access your data in the United States and other countries
          outside the UK. Where this happens, the transfer is protected by the UK Extension to the EU-US Data
          Privacy Framework (the "UK-US data bridge") for certified US companies, or by the ICO's International
          Data Transfer Agreement or Addendum, as included in each provider's data processing terms. You can
          ask us for more detail about these safeguards.
        </p>
      </section>

      <section>
        <h2>6. How long we keep it</h2>
        <ul>
          <li><strong>Account, profile status, saved jobs and agreement record:</strong> until you delete your account. You can remove individual saved jobs at any time.</li>
          <li><strong>Inactive accounts:</strong> if you have not signed in for 2 years, we may delete your account and data. We will email you at least 30 days before doing so.</li>
          <li><strong>When you delete your account:</strong> we delete your data from our live systems straight away. Encrypted backup copies held by our providers are overwritten as part of their normal backup cycle.</li>
          <li><strong>Technical logs:</strong> kept by our hosting providers for a short period, usually no more than 30 days.</li>
          <li><strong>Emails with us:</strong> up to 2 years after the matter is closed, or longer if needed for a legal claim.</li>
        </ul>
      </section>

      <section>
        <h2>7. Your rights</h2>
        <p>Under UK data protection law you have the right to:</p>
        <ul>
          <li><strong>Access</strong> your data and get a copy of it.</li>
          <li><strong>Correct</strong> data that is wrong or incomplete.</li>
          <li><strong>Delete</strong> your data.</li>
          <li><strong>Restrict</strong> how we use your data in some situations.</li>
          <li><strong>Object</strong> to uses based on our legitimate interests.</li>
          <li><strong>Data portability:</strong> receive your data in a common, machine-readable format.</li>
        </ul>
        <p>
          You can download a copy of your data and delete your account yourself from
          your <Link to="/user">Profile</Link> page. For anything else, email <Mail to={LEGAL.contactEmail}/>.
          We will reply within one month. This can be extended by up to two more months for complex requests,
          and we will tell you if that happens. We may need to confirm your identity first. There is no charge.
        </p>
      </section>

      <section>
        <h2>8. Complaints</h2>
        <p>
          If you are unhappy with how we have used your data, please tell us first at <Mail to={LEGAL.contactEmail}/>.
          We will acknowledge your complaint within 30 days, look into it without undue delay, keep you updated,
          and tell you the outcome.
        </p>
        <p>
          You also have the right to complain to the Information Commissioner's Office at
          any time: <Ext href="https://ico.org.uk/make-a-complaint/">ico.org.uk/make-a-complaint</Ext> or 0303 123 1113.
        </p>
      </section>

      <section>
        <h2>9. Age limit</h2>
        <p>
          Job Swipr is only for people aged {LEGAL.minimumAge} or over, and everyone must confirm their age
          before using it. If we learn that someone under {LEGAL.minimumAge} has an account, we will delete
          it and its data. If you think a child is using Job Swipr, please contact us.
        </p>
        <h3>If you are 16 or 17</h3>
        <p>
          The law gives extra protection to anyone under 18, so Job Swipr is built to be private by default
          for everyone. Your account and saved jobs are only visible to you. We do not track your location,
          show you adverts, build a profile of you, or share your data for marketing. You have all the rights
          in section 7, and you can ask a parent, carer or teacher to help you use them.
        </p>
      </section>

      <section>
        <h2>10. Cookies and similar technologies</h2>
        <p>
          We only use storage that is strictly necessary to keep you signed in. We do not use advertising or
          analytics cookies. See our <Link to="/cookies">Cookie Policy</Link> for details.
        </p>
      </section>

      <section>
        <h2>11. Keeping your data secure</h2>
        <p>
          Data is encrypted in transit and at rest by our providers. Database access rules mean each
          account can only read and change its own data. No system is completely secure, so please use a
          strong, unique password.
        </p>
      </section>

      <section>
        <h2>12. Changes to this policy</h2>
        <p>
          If we make important changes, we will update the date at the top and ask you to review the new
          version the next time you sign in.
        </p>
      </section>
    </InfoPage>
  );
}

export function Terms() {
  return (
    <InfoPage title="Terms of Use" intro="The agreement between you and us when you use Job Swipr.">
      <Updated/>

      <section>
        <h2>1. About these terms</h2>
        <p>
          Job Swipr is an independent, non-commercial project provided by <OwnerLine/> ("we", "us"). It is not
          a registered company. By creating an account you agree to these terms.
          Please read them alongside our <Link to="/privacy">Privacy Policy</Link>. If you do not agree, please
          do not use Job Swipr.
        </p>
        <p>You can contact us at <Mail to={LEGAL.contactEmail}/>.</p>
      </section>

      <section>
        <h2>2. Who can use Job Swipr</h2>
        <p>
          You must be {LEGAL.minimumAge} or older and live in the UK to create an account. By signing up you
          confirm that this is true. We will close accounts that we reasonably believe belong to someone under{" "}
          {LEGAL.minimumAge}.
        </p>
      </section>

      <section>
        <h2>3. What Job Swipr does</h2>
        <p>
          Job Swipr shows job listings and lets you keep track of jobs you are interested in. It is free to use.
        </p>
        <p>
          <strong>Swiping to apply does not send an application to the employer.</strong> It saves the job to
          your tracker and opens the listing so that you can apply on the employer's or Adzuna's website. We
          are not an employment agency or employment business, we do not find work for you, and we are not
          involved in any hiring decision.
        </p>
      </section>

      <section>
        <h2>4. Job listings</h2>
        <p>
          Listings are supplied by Adzuna and the employers and recruiters who advertise through it. We do not
          write, check or endorse them. We cannot promise that a listing is accurate, still open, or that the
          salary shown is correct. Always check details with the employer before you apply.
        </p>
        <p>
          Be careful of any listing that asks you to pay a fee, share bank details, or provide identity
          documents before an interview. If a listing looks like a scam, please tell us. In the UK you can also
          report fraud to Action Fraud.
        </p>
      </section>

      <section>
        <h2>5. Your account</h2>
        <ul>
          <li>Give accurate information when you sign up and keep it up to date.</li>
          <li>Keep your password safe and do not share your account.</li>
          <li>Tell us straight away if you think someone else has accessed your account.</li>
          <li>Only create one account per person.</li>
        </ul>
      </section>

      <section>
        <h2>6. Acceptable use</h2>
        <p>You must not:</p>
        <ul>
          <li>break any law, or use Job Swipr for fraud or to harm anyone;</li>
          <li>copy, scrape or collect listings or other data from Job Swipr using automated tools;</li>
          <li>try to access other people's accounts or data, or interfere with how the service works;</li>
          <li>upload viruses or harmful code, or overload the service; or</li>
          <li>contact employers or listing providers claiming to act on behalf of Job Swipr.</li>
        </ul>
      </section>

      <section>
        <h2>7. Our content</h2>
        <p>
          The Job Swipr name, design and software belong to us or our licensors. Job listings belong to Adzuna
          and the advertisers. You may use Job Swipr for your own personal job search, but not for any
          commercial purpose.
        </p>
      </section>

      <section>
        <h2>8. Availability and changes</h2>
        <p>
          We try to keep Job Swipr running smoothly, but because it is a free service we cannot promise it
          will always be available or free of errors. We may change, suspend or stop the service. If we plan
          to close it permanently, we will try to give you reasonable notice so you can download your data.
        </p>
      </section>

      <section>
        <h2>9. Our responsibility to you</h2>
        <p>
          We are responsible for loss or damage you suffer that is a foreseeable result of us breaking these
          terms or failing to use reasonable care and skill. We are not responsible for loss that was not
          foreseeable, or for business losses, as Job Swipr is for personal use only.
        </p>
        <p>
          We are not responsible for the content of job listings, for third-party websites you visit from Job
          Swipr, or for the outcome of any job application.
        </p>
        <p>
          Nothing in these terms limits or excludes our liability for death or personal injury caused by our
          negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot be limited
          or excluded by law. Nothing in these terms affects your legal rights as a consumer.
        </p>
      </section>

      <section>
        <h2>10. Ending your account</h2>
        <p>
          You can stop using Job Swipr and delete your account at any time from your <Link to="/user">Profile</Link> page.
        </p>
        <p>
          We may suspend or close your account if you seriously or repeatedly break these terms, or if we
          need to for legal reasons. Where we reasonably can, we will tell you first and explain why.
        </p>
      </section>

      <section>
        <h2>11. Changes to these terms</h2>
        <p>
          We may update these terms, for example to reflect changes in the law or in how Job Swipr works. If
          we make important changes, we will ask you to accept the new terms the next time you sign in. If
          you do not accept them, you can delete your account.
        </p>
      </section>

      <section>
        <h2>12. Complaints and disputes</h2>
        <p>
          If you have a problem, please contact us at <Mail to={LEGAL.contactEmail}/> and we will try to sort
          it out. These terms are governed by the law of England and Wales. You can bring legal proceedings in
          the courts of England and Wales. If you live in Scotland or Northern Ireland, you can also bring
          proceedings in your local courts.
        </p>
        <p>
          If any part of these terms is found to be unenforceable, the rest will still apply. Only you and we
          have rights under these terms.
        </p>
      </section>
    </InfoPage>
  );
}

export function Cookies() {
  return (
    <InfoPage title="Cookie Policy" intro="How Job Swipr stores information on your device.">
      <Updated/>

      <section>
        <h2>The short version</h2>
        <p>
          We only store what is strictly necessary to keep you signed in. We do not use advertising, analytics
          or tracking cookies, so we do not need to ask for your consent and there is no cookie banner.
        </p>
      </section>

      <section>
        <h2>What we store</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr><th>Name</th><th>Type</th><th>Set by</th><th>Purpose</th><th>How long</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>firebase:authUser:*, firebaseLocalStorageDb</td>
                <td>Local storage and IndexedDB</td>
                <td>Google Firebase, on our behalf</td>
                <td>Keeps you signed in and keeps your account secure</td>
                <td>Until you log out or clear your browser data</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Under the Privacy and Electronic Communications Regulations (PECR), storage that is strictly
          necessary to provide a service you have asked for, such as signing in, does not need consent.
        </p>
      </section>

      <section>
        <h2>Sign-in pop-ups and other websites</h2>
        <p>
          If you sign in with Google or GitHub, those companies may set their own cookies in their sign-in
          window. When you open a job listing, you go to Adzuna or the employer's website, which may set
          cookies under their own policies. We do not control those cookies.
        </p>
      </section>

      <section>
        <h2>Managing storage</h2>
        <p>
          You can clear this data at any time by logging out or using your browser's settings. If you block it,
          you will not be able to stay signed in.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          If we ever add cookies that are not strictly necessary, such as analytics, we will update this policy
          and ask for your consent before setting them.
        </p>
      </section>
    </InfoPage>
  );
}
