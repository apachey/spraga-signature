SPRAGA EMAIL SIGNATURE GENERATOR

ONE-TIME SETUP (administrator only)
1. Deploy this FOLDER to a static HTTPS host (e.g. Vercel). Keep index.html and assets/ together.
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
* Email apps can recolor HTML backgrounds and text independently of PNG logos and icons. This can change the appearance of a branded signature.
* The generated fragment includes a solid-color CSS gradient for the background and -webkit-text-fill-color with !important for text and links, plus ordinary background-color, bgcolor and color fallbacks. These are best-effort protections; clients may ignore, remove or transform them.
* Protections are inline so both clipboard methods include them. Adding color-scheme metadata or dark-mode media queries only to this generator's page would not protect a signature pasted into Gmail.
* Browser dark-mode emulation does not reproduce Gmail or Outlook's email recoloring. Verify a sent message after pasting into settings and saving, including a reply/forward. If a client strips the protection or text loses contrast, treat that client as unsupported until the received message is checked and adjusted.
* Existing signatures must be copied from the updated generator, pasted into mail settings again and saved. Deploying the generator does not update previously installed signatures or sent emails.

PRIORITY CLIENT CHECKS
* Gmail mobile and Apple Mail are the reported problem clients. Check Gmail on iPhone and Android separately; check Apple Mail on iPhone/iPad and Mac separately until the affected device is known.
* In Gmail, preserving a background does not guarantee preservation of the text color. Check name, role, every contact link, logo and icons for contrast in both modes. Do not mark this issue fixed based on browser previews or clipboard checks.
* Compare the same received message in both modes, then a reply and a forward. If a problem remains, record the app/OS version, selected theme/inversion and screenshots of the signature in both modes before choosing another workaround.
* Client behavior and workaround references: https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers and https://www.hteumeuleu.com/2021/fixing-gmail-dark-mode-css-blend-modes/ . These describe email rendering, not proof that a pasted signature will retain every CSS property.
