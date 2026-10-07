# Job Swipr compliance notes

Job Swipr is run by Godwin Alamu as an individual (not a company). It processes UK users'
personal data, so UK GDPR, the Data Protection Act 2018, the Data (Use and Access) Act 2025,
PECR and the ICO Age Appropriate Design Code apply. This file is the owner's record. It is
not published on the site. It is not legal advice.

Legal text lives in `src/pages/LegalPages.jsx`. Names, email and policy version live in
`src/legal/config.js`.

## 1. Before going live

- [ ] Set `contactEmail` in `src/legal/config.js` to a real inbox you check at least weekly.
- [ ] Take the ICO fee self-assessment: https://ico.org.uk/for-organisations/data-protection-fee/self-assessment/
      If it says you must pay (£40 a year for a micro organisation), pay it and put the number in `icoRegistration`.
      Not paying when required can lead to a fine of up to £4,350.
- [ ] Accept Google's data processing terms: in the Firebase console open Project settings and find the
      "Data Processing Terms" section (wording varies). This is your processor contract with Google (UK GDPR Article 28).
- [ ] Vercel: its Data Processing Addendum is part of its terms. Save a copy (vercel.com/legal/dpa).
- [ ] Firebase console > Authentication > Settings: turn on email enumeration protection.
- [ ] Deploy `firestore.rules` (`firebase deploy --only firestore:rules`) so each user can only reach their own data.
- [ ] Add the official Adzuna logo to `src/components/AdzunaAttribution.jsx` (adzuna.co.uk/press.html).
      Adzuna's API terms require "Jobs by Adzuna" on every displayed advert.
- [ ] Sign up, sign in with Google, accept the consent pop-up, download your data and delete the test account,
      to check each flow works on the live site.

## 2. Ongoing tasks

| When | Task |
|------|------|
| Every week | Check the contact inbox. |
| Within 30 days of a complaint | Acknowledge it in writing (DUAA 2025, in force since 19 June 2026). Then investigate, keep the person updated and tell them the outcome. Log it in section 6. |
| Within 1 month of a rights request | Reply. You can extend by 2 more months for complex requests if you tell the person within the first month. Most requests can be pointed to Profile > "Download my data" or "Delete my account". |
| Within 72 hours of a breach | See section 5. |
| Every year | Renew the ICO fee if you pay it. Re-read this file and the policies. |
| Every year | Find accounts with no sign-in for 2 years (Firebase console > Authentication, sort by last sign-in). Email them, wait at least 30 days, then delete them. The Privacy Policy promises this. |
| When the policies change | Edit `LegalPages.jsx`, then update `version` and `effectiveDate` in `config.js`. Every signed-in user will be asked to accept the new version. |

## 3. Record of processing (UK GDPR Article 30)

| Item | Detail |
|------|--------|
| Controller | Godwin Alamu, individual, United Kingdom. Contact: see `contactEmail`. |
| People | Registered users aged 16 and over, living in the UK. |
| Data | Name, email, sign-in provider ID, profile status, saved jobs and stages, agreement record (terms version, time, age confirmation), technical logs (IP, browser, request times). No special category data is requested. |
| Purposes and lawful basis | Running accounts and the job tracker: contract. Agreement record and security: legitimate interests. Handling requests and complaints: legal obligation. |
| Processors | Google (Firebase Authentication, Firestore, Hosting if used). Vercel (hosting and the `/api/jobs` server). |
| Other recipients | Adzuna receives job search terms from our server only, with no user identifiers. Google and GitHub act as sign-in providers when the user chooses them. |
| International transfers | United States, under the UK-US data bridge and the providers' IDTA or Addendum terms. |
| Retention | Until account deletion, or after 2 years of inactivity with 30 days' notice. Logs kept by providers, typically 30 days or less. Emails kept up to 2 years after a matter closes. |
| Security | HTTPS, provider encryption at rest, Firestore rules limiting each user to their own documents, no secrets in the browser bundle (Adzuna keys stay server-side). |

## 4. Risk assessment for under-18 users (Age Appropriate Design Code)

The minimum age is 16, so 16 and 17 year olds are children under the ICO code. The code
expects a data protection impact assessment (DPIA) for services likely to be used by children.
This is the short version for a low-risk service.

| Code standard | How Job Swipr meets it |
|---------------|------------------------|
| Best interests of the child | Service helps find work. No features that encourage excessive use. |
| Age-appropriate application | One experience for everyone, set to the most private option. |
| Transparency | Plain-English policies, with a section for 16 and 17 year olds. |
| Detrimental use of data | No adverts, no marketing, no sale of data. |
| Default settings | Everything is private. Nothing is shared with other users. |
| Data minimisation | Only data needed for the account and tracker. |
| Data sharing | Only with processors needed to run the service. |
| Geolocation | Not collected. Job location is typed in by the user. |
| Profiling | None. |
| Nudge techniques | Consent boxes are unticked. Declining is as easy as accepting. |
| Online tools | Self-service data download and account deletion on the Profile page. |

**Remaining risks:** an under-16 lies about their age (low impact: little data, nothing public;
the account is deleted if we find out), or a user puts sensitive details in the profile status
(the Privacy Policy asks them not to). **Result:** low risk, no need to consult the ICO.
Redo this table if you add messaging, public profiles, adverts, analytics or location features.

## 5. Data breach plan

1. Contain it: revoke leaked keys, tighten Firestore rules, disable affected accounts.
2. Write down what happened, when, what data and how many people.
3. If it is likely to put people at risk, report it to the ICO within 72 hours of finding out:
   https://ico.org.uk/for-organisations/report-a-breach/
4. If it is likely to put people at high risk, tell those users directly without undue delay.
5. Record every breach in section 6, even ones you do not report.

## 6. Log of complaints, requests and breaches

| Date | Type | Summary | Acknowledged | Closed | Outcome |
|------|------|---------|--------------|--------|---------|
| | | | | | |

## 7. Revisit if any of these change

- **You start making money from it, or set up a company.** Consumer Contracts Regulations may then apply, and a company must show its name, number and registered office on the site. Update `config.js` and the policies.
- **You add analytics or advertising.** PECR requires opt-in consent before any non-essential storage. Add a consent banner with "Reject" as easy as "Accept", and update the Cookie Policy.
- **You add messaging, comments or public profiles.** The Online Safety Act 2023 may then apply. Redo section 4.
- **You open the service to users outside the UK.** EU users bring in EU GDPR and may require an EU representative.
- **You add a new provider.** Add it to the Privacy Policy and section 3, and check its data processing terms.
