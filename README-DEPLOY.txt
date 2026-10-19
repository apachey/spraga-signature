SPRAGA EMAIL SIGNATURE GENERATOR

ONE-TIME SETUP (administrator only)
1. Deploy this repository to Vercel with Node.js 24. Install dependencies with npm ci and build with npm run build. vercel.json serves public/ plus the /api/signature-image function. A static-only host cannot render the protected signatures.
2. Open the public HTTPS URL and make sure all fourteen theme/invert combinations render correctly.
3. Copy a signature and paste into Gmail Settings -> See all settings -> Signature. Save changes.
4. Send real test emails to Gmail (web, iOS and Android), Apple Mail and Outlook. Review images, dimensions, text contrast and links in both light and dark mode, especially in the app where a problem was reported.
5. Share only the published generator URL with the team. Team users enter details, click Copy signature and paste.

IMPORTANT
* Don't give the team index.html or a local file:// link. Images in received email require publicly accessible HTTPS URLs.
* Don't delete, rename, restrict or relocate assets/ after signatures have been installed. Old signatures reference those URLs.
* Images may be blocked by a recipient's email settings; this cannot be overridden by the generator.
* For updates, deploy to the same stable domain.

DARK MODE
* All seven themes and both inversion choices use the same protected image rendering. The background, name, role, logo, icons and contact labels are PNG pixels. The email contains a table of seven 2x-resolution image slices, with separate phone, website, Instagram and LinkedIn links.
* This replaces the previous HTML color/gradient/text-fill workaround, which failed a real iPhone test: Gmail recolored the text and Apple Mail made the name black. Spark (phone/laptop) and Gmail web were reported working before this change; those are regression targets.
* The renderer runs on the same project, uses bundled fonts and existing logo/icon assets, and makes no third-party requests. Personal text is encoded in the corresponding image URL so mail image proxies can retrieve it later. No uploads or database are needed. Do not add authentication to this endpoint: received signatures need publicly accessible images.
* Image URLs include a renderer version and are immutable/cacheable. Preserve the version 1 renderer contract and all old asset URLs when updating the generator. Do not change rendering for an existing version; add another version when necessary.
* Text in the images is not selectable. Each meaningful image has alternative text, and both clipboard paths also include a readable plain-text signature. If a recipient blocks images, their email app may display alternative text. These are the same remote-image limitations that apply to logos, now also affecting the signature text.
* A browser check can validate image pixels and copy behavior, but it cannot certify actual Gmail/Apple Mail rendering. Verify a sent message after pasting into settings and saving, including a reply/forward.
* Existing signatures must be copied from the updated generator, pasted into mail settings again and saved. Deploying the generator does not update previously installed signatures or sent emails.

PRIORITY CLIENT CHECKS
* Confirmed problem clients are Gmail and Apple Mail on iPhone. Check all fourteen palettes, then repeat Gmail web and Spark on phone/laptop as regression checks. Android and Apple Mail on Mac are additional checks, not confirmed failures.
* Check name, role, every contact link, logo, icons, dimensions and slice joins in both modes. Verify actual PNG responses are available publicly and links still work after saving in Gmail. Do not mark this issue fixed based on browser previews or clipboard checks.
* Compare the same received message in both modes, then a reply and a forward. If a problem remains, record the app/OS version, selected theme/inversion and screenshots of the signature in both modes before choosing another workaround.
* Client behavior and workaround references: https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers and https://www.hteumeuleu.com/2021/fixing-gmail-dark-mode-css-blend-modes/ . These describe email rendering, not proof that a pasted signature will retain every CSS property.

DEVELOPMENT CHECKS
* npm test exercises the actual PNG handler for all 14 palettes, checks exact foreground/background pixels and slice joins, validates input limits, and checks deterministic images, cache headers, conditional requests and HEAD.
* npm run build copies the generator and original assets into public/. Keep package-lock.json and the bundled font license when deploying.
