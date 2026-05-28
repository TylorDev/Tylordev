# THREEJOB project example

This is a development-only example project written in English. It follows the
current `RawProject` shape used by Admin and the API.

## Ordered fields

Title: THREEJOB
@
Slug: threejob

Published at: null

Subtitle: A 3D job discovery platform where candidates explore roles, teams,
and career paths through interactive visual spaces y que mas xdxdxdd.

Cover image: https://placehold.co/1200x800?text=THREEJOB+Cover

Background/Banner: https://placehold.co/1600x900?text=THREEJOB+Background

Status: In Development

Type: Web App

Technologies: React, TypeScript, Three.js, Node.js

Buttons:

- Live Preview: https://example.com/threejob
- Source Code: https://github.com/example/threejob
- Documentation: https://example.com/threejob/docs

Sections:

- Direction: row
- Cover image: https://placehold.co/1000x700?text=THREEJOB+Workflow
- Summary: Candidates can move through a 3D career map, compare roles, and open
  focused panels for responsibilities, required skills, and team context.
- Read more: Read more
- Modal content: THREEJOB turns job discovery into an interactive visual
  workspace. Instead of scrolling through flat listings, candidates explore
  positions as connected nodes, filter opportunities by skill fit, and inspect
  each role without losing spatial context.
- Close: X

- Direction: row-reverse
- Cover image: https://placehold.co/1000x700?text=THREEJOB+Employer+Dashboard
- Summary: Employers get a dashboard for publishing roles, reviewing candidate
  matches, and understanding where applicants fit in the hiring pipeline.
- Read more: Read more
- Modal content: The employer view focuses on practical hiring workflows:
  managing openings, reviewing candidate match signals, and keeping each role's
  requirements clear for both recruiters and applicants.
- Close: X

## RawProject shape in Markdown

slug: threejob

publishedAt: null

shared:

- title: THREEJOB
- coverImageSrc: https://placehold.co/1200x800?text=THREEJOB+Cover
- backgroundImage: https://placehold.co/1600x900?text=THREEJOB+Background
- status: In Development
- type: Web App
- technologies: React, TypeScript, Three.js, Node.js
- buttons:
  - icon: preview
  - url: https://example.com/threejob
  - translations:
    - locale: en-us
    - text: Live Preview
  - icon: github
  - url: https://github.com/example/threejob
  - translations:
    - locale: en-us
    - text: Source Code
  - icon: docs
  - url: https://example.com/threejob/docs
  - translations:
    - locale: en-us
    - text: Documentation

translations:

- locale: en-us
- subtitle: A 3D job discovery platform where candidates explore roles, teams,
  and career paths through interactive visual spaces.

sections:

- flexDirection: row
- coverImage: https://placehold.co/1000x700?text=THREEJOB+Workflow
- translations:
  - locale: en-us
  - summary: Candidates can move through a 3D career map, compare roles, and
    open focused panels for responsibilities, required skills, and team context.
  - readMore: Read more
  - modalContent: THREEJOB turns job discovery into an interactive visual
    workspace. Instead of scrolling through flat listings, candidates explore
    positions as connected nodes, filter opportunities by skill fit, and inspect
    each role without losing spatial context.
  - close: X

- flexDirection: row-reverse
- coverImage: https://placehold.co/1000x700?text=THREEJOB+Employer+Dashboard
- translations:
  - locale: en-us
  - summary: Employers get a dashboard for publishing roles, reviewing candidate
    matches, and understanding where applicants fit in the hiring pipeline.
  - readMore: Read more
  - modalContent: The employer view focuses on practical hiring workflows:
    managing openings, reviewing candidate match signals, and keeping each
    role's requirements clear for both recruiters and applicants.
  - close: X
