DEVASTATED ENGINEERS — GALAXY WEBSITE + CREW VAULT + THOUGHTS

FILES
- index.html: website layout
- style.css: responsive galaxy design and branch styling
- script.js: crew cards, demo name-check, personal notes and thoughts feed

IMAGES
Place these images beside index.html using exact names:
antu.jpg, emon.jpg, sourav.jpg, sudeep.jpg, aniruddha.jpeg

RUN LOCALLY
1. Extract this ZIP.
2. Open the extracted folder in VS Code.
3. Add the five image files next to index.html.
4. Open index.html with Live Server.

NEW BRANCHES
- Crew Vault: each member can fill in family names, phone/address fields, daily routine, habits to improve, and notes.
- Cosmic Thoughts: members can publish posts capped at 300 words and delete their own posts in this browser.

IMPORTANT PRIVACY / TECHNICAL LIMITS
This is a FRONT-END DEMO only. Crew Login merely checks a typed name; it is NOT authentication, and anyone can type another member's name. Vault fields and thoughts are stored in localStorage in the current browser, not securely, and they do not sync to other devices or users. Other people using the same browser can inspect the stored data. Do NOT enter real family names, phone numbers, or home addresses on a public GitHub Pages deployment. To make a truly shared and private app, use real authentication and a backend/database with access controls (for example, a properly configured Supabase/Firebase setup) and collect personal details only with every member's consent.
