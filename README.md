# Website 08 — Crayon Shin-chan: The Birthday Mission

A responsive, three-screen birthday countdown website set in a playful, original Kasukabe-inspired neighbourhood. It uses plain HTML, CSS, and vanilla JavaScript. No build step, package manager, backend, or API is required.

## Run the website

1. Extract `Website_08_Shinchan_Birthday_Mission.zip`.
2. Open the `Website_08_Shinchan_Birthday_Mission` folder.
3. Double-click `index.html` to open it in a browser.

It can also be hosted as a static site. Upload the contents of this folder to GitHub Pages, Netlify, or another static host. Keep the folder structure intact.

## Personalise the content

Open `script.js` in a text editor and find the clearly labelled `SITE_CONTENT` object near the top. Edit the text between quotation marks. Keep commas and quotation marks in place.

Useful fields:
- `intro.heading`, `intro.subtitle`, and `intro.dialogue`
- `intro.shinchanLines` and `intro.shiroLines`
- `countdown.heading`, `countdown.subtitle`, and the interaction messages
- `mission.subject`, `mission.status`, `mission.objective`, and `mission.authorisation`
- `mission.personalMessage`
- `secrets.everyday` and `secrets.birthday`
- `birthday.heading`, `birthday.lineOne`, `birthday.lineTwo`, and `birthday.lineThree`

Replace `[WRITE YOUR PERSONAL MESSAGE TO PALAK HERE]` with your own note. The project intentionally does not invent a long personal letter for you.

The everyday secret appears when the suspicious box is opened during the normal countdown period. The birthday-only secret appears only while birthday mode is active on November 20 in IST.

## Adding your Shin-chan and Shiro assets

Character images should preferably be transparent PNGs, with the character cleanly separated from the background. A transparent PNG shows the character without a rectangular background. A white background is not the same thing as transparency.

Make sure the character is clearly visible and is not cropped at the head or feet. Do not stretch the image to force it into a different shape. The website uses `object-fit: contain` and preserves the source aspect ratio. Transparent PNGs are useful because they let characters sit naturally on top of the illustrated scenery.

Place character images inside:

`assets/images/`

For example:

`Website_08_Shinchan_Birthday_Mission/assets/images/shinchan.png`

Filenames must match exactly, including lowercase spelling and the `.png` extension. The dimensions below are recommended canvas sizes, not mandatory exact sizes. If an original image has a different aspect ratio, preserve that ratio rather than stretching it.

| Filename | Purpose | Recommended dimensions | Format | Requirement |
|---|---|---|---|---|
| `shinchan.png` | Main character fallback | 1000 × 1400 px | Transparent PNG | Recommended |
| `shinchan_idle.png` | Standing or neutral pose | 800 × 1100 px | Transparent PNG | Optional |
| `shinchan_happy.png` | Happy reaction | 800 × 1100 px | Transparent PNG | Optional |
| `shinchan_surprised.png` | Surprised reaction | 800 × 1100 px | Transparent PNG | Optional |
| `shiro.png` | Main Shiro character | 700 × 600 px | Transparent PNG | Recommended |
| `shiro_happy.png` | Happy Shiro reaction | 700 × 600 px | Transparent PNG | Optional |
| `kasukabe_background.png` | Neighbourhood background | 1920 × 1080 px | PNG or JPEG | Optional |
| `nohara_house.png` | House or interactive prop | 1200 × 900 px | PNG, preferably transparent | Optional |
| `birthday_scene.png` | Birthday celebration background | 1920 × 1080 px | PNG or JPEG | Optional |
| `shinchan_icon.png` | Small character icon | 256 × 256 px | Transparent PNG | Optional |

Recommended image qualities:
- Use high-resolution images with clear silhouettes.
- Prefer transparent backgrounds for foreground characters.
- Avoid visible watermarks and text baked into character images.
- Keep reaction poses at a consistent visual scale.
- Use images from sources you are authorised to use.

The project does not bundle copied anime screenshots or official character artwork. Add your own authorised assets using the filenames above.

### What happens if an asset is missing?

- If an optional Shin-chan reaction pose is missing, the code attempts to use `shinchan.png`.
- If the main Shin-chan image is missing, a clear placeholder tells you which file to add.
- If Shiro's image is missing, a small original CSS dog placeholder appears.
- If `birthday_scene.png` is missing, the birthday screen uses its built-in colour and confetti treatment.
- The neighbourhood, houses, trees, clouds, road, and calendar are drawn with CSS, so the website remains usable without background files.
- `kasukabe_background.png`, `nohara_house.png`, and `shinchan_icon.png` are documented optional assets; the current design uses its CSS scene and does not require them.

## Countdown and birthday mode (IST)

The countdown targets **November 20 at 12:00 AM India Standard Time (UTC+05:30)**. It does not use the visitor's local midnight. The JavaScript shifts the current instant by five hours and thirty minutes and reads the resulting UTC calendar fields. It then calculates the target instant as IST midnight converted back to UTC.

Birthday mode is active from the beginning of November 20 IST until the beginning of November 21 IST. If the page stays open across either boundary, the one-second update loop detects the change and updates the page. When birthday mode ends, the normal countdown resumes toward the next November 20.

## Secrets and mission file

- **Everyday secret:** click or tap the suspicious cardboard box on the countdown screen. Edit `SITE_CONTENT.secrets.everyday`.
- **Birthday-only secret:** available only on November 20 IST. Edit `SITE_CONTENT.secrets.birthday`.
- **Personal message:** open the mission file on Screen 3 and edit `SITE_CONTENT.mission.personalMessage`.

## Sound

The optional `assets/audio/ambience.mp3` file is not included. If you add an audio file with that exact name, it will remain off until the visitor explicitly presses the sound toggle. Audio is never autoplayed.

## Troubleshooting

- **A character placeholder is visible:** check that the image is inside `assets/images/` and that its filename matches the table exactly.
- **A pose does not load:** add the optional pose or add `shinchan.png` as the fallback.
- **The birthday background is missing:** this is fine; the CSS birthday scene is used.
- **Audio does not play:** confirm `assets/audio/ambience.mp3` exists and use the on-page sound button.
- **A change does not appear:** save `script.js`, then refresh the browser. If needed, hard-refresh to clear cached files.

## Accessibility and motion

Navigation and interactive elements are keyboard-focusable, controls have accessible labels, and important actions work by click or tap rather than hover. The stylesheet respects `prefers-reduced-motion`.
