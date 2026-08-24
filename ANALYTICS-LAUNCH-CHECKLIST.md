# Microsoft Clarity launch checklist

Status: blocked pending a real Microsoft Clarity project ID and an approved consent path.

## Verified state

- Audited on 2026-08-24 from branch `paginas-producto-zona`.
- No Microsoft Clarity project ID, Clarity snippet, analytics configuration, consent manager, cookie banner, or privacy/cookie notice was found in this site repo.
- The wider `/home/gron/Desktop/inbox` context contains no Clarity ID or Clarity configuration. The only unrelated `clarity` matches are ordinary prose about clarity.
- No tracking code has been added. This file is documentation only.

## Required operator input

- [ ] Real **Microsoft Clarity Project ID**, copied from the intended project in Clarity's installation/setup screen. Do not substitute a Google Analytics measurement ID, an API token, a domain name, or a placeholder.
- [ ] Confirm the project is for `comprooroazuqueca.com` and that the seven public site pages should report to that one project.
- [ ] Approved analytics-consent mechanism and privacy/cookie disclosure for this Spanish/EU audience. The consent flow must expose an explicit analytics choice and communicate the resulting decision to Clarity before tracking begins.

## Safe implementation point

When the inputs above are available, add one small shared local analytics loader and include it in all seven public pages immediately before `</body>`, after each page's existing behavior script. The pages are:

`index.html`, `compro-oro.html`, `compro-monedas.html`, `compro-plata.html`, `compro-relojes.html`, `compro-oro-guadalajara.html`, and `compro-oro-alcala-de-henares.html`.

`assets/brand/og-card.html` is a local image-generation source, not a public site page, and should remain uninstrumented.

The loader must:

1. Read the approved consent state before creating or loading the Clarity script.
2. Remain inert when consent is missing or denied. It must not create the Clarity script element or call the Clarity API in that state.
3. Pass consent changes to Clarity using the current Consent V2 approach, including revocation handling, rather than relying only on a local cookie or `localStorage` flag.
4. Load the real Project ID supplied above, without committing a placeholder.
5. Avoid sending form contents, phone numbers, WhatsApp URLs, or other sensitive values as custom metadata.

Do not deploy the integration until the consent UI, privacy/cookie disclosure, and post-consent/revocation behavior have been tested on every page.

## Verification before deployment

- [ ] With consent absent, no Clarity network request, script element, cookie, or API call is present.
- [ ] With analytics consent granted, Clarity loads on all seven public pages and the intended project receives page visits.
- [ ] On revocation, Clarity receives the denied state and previously set tracking cookies are handled according to the approved policy.
- [ ] Check desktop and mobile pages, direct URLs, internal navigation, and a fresh private browsing session.
- [ ] Felipe approves the final diff and separately approves deployment.

Reference: [Microsoft Clarity Consent Mode](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode) and [ConsentV2 API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2).
