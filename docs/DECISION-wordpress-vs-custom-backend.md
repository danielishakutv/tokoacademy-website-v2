# Should we replace WordPress with our own Postgres backend?

You asked: *"Shouldn't we just create backend with postgres for the website
and serve instead of the wordpress?"*

**My answer is no — and I think the question is pointing at a real problem
that a different change solves better and far more cheaply.**

---

## What is actually true today

Content for this site lives in three places:

| What | Where it lives | Who edits it |
|---|---|---|
| News, events, gallery | WordPress | You, in WordPress |
| Courses, prices, curricula | The learning platform (Postgres) | You, in the DLC admin |
| Everything else — home page copy, About, Impact, Thematic Areas | **Typed into the code** | Me |

The third row is the problem. It is why the site felt stale: changing a
sentence on the home page requires a developer. It is not a WordPress problem
— WordPress is doing its job for the content that is in it.

---

## Why not build our own

**It would cost months and change nothing a visitor can see.** A usable CMS is
not a database table. It is drafts and publishing, media upload and
thumbnailing, a decent editor, revision history, scheduling, roles, search,
previews, and a hundred small behaviours people only notice when they are
missing. WordPress has had twenty years of that. We would spend a quarter
rebuilding it badly and the site would look identical afterwards.

**It moves work from a system that maintains itself onto us.** Right now
security patches for the editor arrive from WordPress. Afterwards, every bug
in the editor is ours, at night, while you are trying to publish something.

**Your people already know WordPress.** Whoever writes your news posts can
already do it. A custom editor means retraining everyone, and it means that
when the person who knows it leaves, nobody does.

**It does not fix the third row anyway.** Home page copy is in the code
because nothing was ever wired up to edit it — not because Postgres was
missing. We would build a whole CMS and still have to do the wiring.

There is one genuine argument for it — one system instead of two — and it is
not worth a quarter of engineering and a permanent maintenance bill.

---

## What I would do instead

### 1. Give each kind of content exactly one home

- **Courses** live in the DLC. Already true, as of this week.
- **News, events, gallery** live in WordPress. Already true.
- **Marketing copy** — home page, About, Impact — should become editable, and
  the place to edit it is **ta_admin**, which you have already asked for.

### 2. Build the "Website content" screen in ta_admin

You asked for this a few days ago and it is still the right answer. Not a new
CMS — a small, specific editor for the paragraphs and images on a handful of
pages, plus a **Publish** button. ta_admin already has the text editor, the
image uploads, and the permission system. The publish button uses the deploy
webhook that already exists.

This is maybe a week of work, against a quarter for a CMS, and it solves the
actual complaint.

### 3. Make publishing feel immediate

The site is a static export, so a change appears after a rebuild — about
ninety seconds. WordPress already triggers that automatically when you
publish a post. The DLC should ring the same bell when a course changes, and
so should the ta_admin editor. Then "I changed it and it is live" is true
everywhere, without anybody needing to know what a build is.

---

## The one thing worth revisiting later

If WordPress becomes a burden — if it gets hacked, or the hosting becomes
awkward, or you stop publishing news — the cheap move is not a custom CMS. It
is a hosted headless CMS such as Sanity, Contentful or Payload: same editing
experience, no server to patch, and a migration measured in days.

Worth a look in a year. Not worth it now.

---

## In one line

**Keep WordPress. Stop putting copy in the code. Build the small ta_admin
editor you already asked for, and let every system ring the same publish
bell.**
