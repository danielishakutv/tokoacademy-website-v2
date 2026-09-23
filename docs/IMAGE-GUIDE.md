# Photographs for tokoacademy.org

Written for whoever is briefing or taking the pictures.

The site is now designed around images. Every slot already exists and shows a
marked placeholder saying what belongs there, so the layout is finished and
correct — dropping a file into `public/images/…` is all that is needed to
replace a placeholder. Nothing else has to change, and they can arrive one at
a time.

---

## The single most important decision

**Use your own photographs, not stock.**

Six course thumbnails were until recently hotlinked from other people's
websites — a Medium article, a UK software firm, a US college. Besides being
someone else's property, they did something worse: they made a real academy in
Yola look like every other training website in the world.

Your advantage is that you are actually there. A photograph of your own room,
your own trainer, your own students is the one thing a competitor cannot copy
and an AI cannot generate convincingly. It is also what a grants officer
looks for when deciding whether an organisation really operates where it says
it does.

Where you genuinely have nothing, leave the placeholder. A marked gap is more
honest than a Californian office with a blue-lit open-plan desk.

---

## What to shoot

### 1. The room, working

The backbone of the whole site. What you want is **a class in progress, not a
class posing**.

- Wide shot from the back or a corner: trainer at the board, screens lit,
  people leaning in
- Over-the-shoulder of a laptop with real work on the screen — code, a
  spreadsheet, a dashboard. Not a stock desktop
- Two students helping each other, no trainer in frame
- A trainer crouched beside one desk, mid-explanation
- Hands on a keyboard, close, shallow depth of field

**Avoid:** everybody looking at the camera and smiling; a row of closed
laptops; an empty room lit like an estate-agent listing.

### 2. People, singly

- A trainer mid-sentence, gesturing, caught rather than posed
- A student at their desk looking at their own screen
- Three or four head-and-shoulders portraits against a plain wall, for
  anywhere a person is named

Shoot these at eye level. A camera looking down at somebody reads as
condescending, and on a page about opportunity that matters.

### 3. Children and young people (for `/kids`)

Different rules — see **Consent** below, it is not optional.

- Two children at one screen, both engaged
- A child's face lit by a monitor, concentrating
- Hands building something physical — a robot kit, blocks, paper
- A group mid-activity, movement in the frame

**Avoid:** a child alone facing the camera; anything where the child looks
isolated or unsupervised.

### 4. Corporate and government work

Your strongest proof, and the hardest to get afterwards — take the camera
**every time** you run one of these.

- The room mid-session, uniforms and badges visible where permitted
- A certificate being handed over, both people in frame, actually looking at
  each other
- A wide shot showing the scale of the room
- Your banner or roll-up somewhere in the frame, off-centre

You already ran sessions for NASSCO in Yola and NSCDC. If photographs exist
from those, they belong on `/impact` and `/corporate` before anything new is
shot.

### 5. The building and the city

Context — this is what makes "Jimeta-Yola" a real place rather than an address.

- The entrance with signage, in daylight
- The street outside, recognisably Yola
- The reception or waiting area
- One wide establishing shot of the building

### 6. Per course

Each course page has a thumbnail. The best version is **a photograph of that
course actually running**. Where one does not exist, a clean overhead of the
tools of that trade works: a laptop with a terminal for software engineering,
a notebook and dashboard for data, a camera and phone for digital marketing.

---

## How to shoot it

**A modern phone is fine.** A recent iPhone or a good Android in decent light
beats a DSLR used badly. What matters is light and framing, not the sensor.

- **Shoot landscape**, always. The site is a grid of wide frames; a vertical
  photograph has to be cropped and the crop is rarely kind.
- **Find the window.** Daylight from the side is the single biggest quality
  difference available to you. Turn off the overhead fluorescents if you can —
  they go green.
- **Never use the on-camera flash.** It flattens faces and makes a classroom
  look like a police interview.
- **Leave space around the subject.** The site crops to several shapes; a
  tightly framed photograph loses heads. Shoot a little wider than feels
  right.
- **Take many.** Thirty frames of one session, five of which are usable, is a
  good outcome and a normal ratio.
- **Clean the lens.** It is smeared. It always is.

---

## Consent — read this before photographing anyone

This is not a formality, and for children it is a safeguarding matter with
legal weight under the Nigeria Data Protection Act.

1. **Adults:** get written permission to use their image on the website and in
   marketing. A line on the enrolment form covering it is enough, but it must
   exist and be signed.
2. **Children under 18:** written permission from a parent or guardian,
   specific to publication on the website and social media. A verbal yes at
   the door is not sufficient. Keep the forms.
3. **Corporate and government sessions:** permission from the organisation as
   well as the individuals. Some agencies will not permit faces or badges —
   ask before the session, not after.
4. **Keep a record** of who consented to what, with dates. If someone later
   withdraws consent you need to be able to find and remove their photograph.
5. **When in doubt, shoot from behind or over the shoulder.** A photograph of
   hands and screens needs far less paperwork and is often the better image
   anyway.

You already have a safeguarding policy page. This should be consistent with
it.

---

## Technical specifications

| Use | Pixel size | Format | Target weight |
|---|---|---|---|
| Hero / full-width | 2400 × 1350 | WebP | under 250KB |
| Section image | 1600 × 1200 | WebP | under 150KB |
| Card / thumbnail | 1200 × 675 | WebP | under 90KB |
| Portrait | 800 × 800 | WebP | under 60KB |
| Logo / mark | as supplied | PNG or SVG | under 30KB |

**WebP, not JPEG.** Roughly a third of the size at the same quality, and
supported by every browser your visitors use. Squoosh (squoosh.app) converts
in the browser, free, no upload.

**Weight is not a detail here.** Your audience is on mobile data in the North
East. One carelessly exported 3MB photograph costs a visitor more than every
other byte on the page put together — a course thumbnail on your own platform
is 17KB, and one that was hotlinked from elsewhere was 750KB.

**Always shoot at full resolution and keep the originals** somewhere separate.
Export a web copy; never let the web copy be the only copy.

---

## Where the files go

Drop a file at the path the placeholder names and it appears on the next
build. The paths follow the page:

```
public/images/
├── home/          the hero slider and home page sections
├── about/         the story, the team, the building
├── impact/        workshops, handovers, people at work
├── kids/          children's classes  (consent forms on file)
├── corporate/     government and corporate sessions
├── courses/       per-course imagery
└── partners/      partner logos (already populated)
```

Every placeholder on the live site prints its own path in small type at the
bottom of the frame. Walk the site, write down the paths you see, and that is
your shot list in priority order.

---

## If you want to start with ten photographs

In this order:

1. Wide shot of a class in progress — the home page hero
2. Over-the-shoulder of a laptop with real work on screen
3. A trainer explaining something to one student
4. The entrance with signage, daylight
5. A corporate or government session, room-wide
6. A certificate handover, both faces
7. Two children at one screen (with consent on file)
8. Two students working together, no trainer
9. Hands on a keyboard, close
10. A portrait of a trainer against a plain wall

Those ten fill the home page, `/about`, `/impact`, `/kids` and `/corporate` —
which is every page a first-time visitor is likely to open.
