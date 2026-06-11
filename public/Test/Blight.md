# Blight

Project page data for the Blight desktop app.

## RawProject shape in Markdown

shared:

- slug: blight
- name: Blight
- subtitle: Desktop crafting economics for inventory, fabrication tickets, XL analysis, and market comparison.
- coverImageSrc: https://raw.githubusercontent.com/TylorDev/blight/main/src/Resources/BlightAppIcon.png
- status: Live
- type: Desktop
- technologies: Electron, React, TypeScript, Vite, Prisma, Zustand, Sass, Vitest
- buttons:
  - icon: github
  - url: https://github.com/TylorDev/blight
  - translations:
    - locale: en-us
    - text: Source Code
    - locale: es-mx
    - text: Codigo fuente
    - locale: pt-br
    - text: Codigo fonte

sections:

- flexDirection: row
- coverImage: https://raw.githubusercontent.com/TylorDev/blight/main/src/Resources/BlightAppIcon.png
- translations:
  - locale: en-us
  - summary: Inventory and purchases
  - modalContent: Blight records material purchases, keeps invoice history, and tracks current inventory by category, tier, quantity, total investment, and average cost. Purchases update stock and purchase invoices so material cost stays connected to later ticket calculations.
- flexDirection: row-reverse
- coverImage: https://raw.githubusercontent.com/TylorDev/blight/main/src/Resources/BlightLogo.png
- translations:
  - locale: en-us
  - summary: Fabrication tickets and TicketXL
  - modalContent: Blight creates fabrication tickets from supported recipes, crafting tax, stock average costs, and available leftovers. TicketXL guides a four-ticket batch across T5, T6, T7, and T8 with shared recipe and tax settings, then prepares an analyzer history snapshot for the batch.
- flexDirection: row
- coverImage: https://raw.githubusercontent.com/TylorDev/blight/main/src/Resources/wood.svg
- translations:
  - locale: en-us
  - summary: Production closing and history
  - modalContent: Open tickets are closed with stock validation, filled journal values, board and cloth leftovers, and produced staff quantities by quality. A successful close updates stock, ticket history, leftover credits, produced staff stock, lots, and movement records.
- flexDirection: row-reverse
- coverImage: https://raw.githubusercontent.com/TylorDev/blight/main/src/Resources/staff.svg
- translations:
  - locale: en-us
  - summary: Profitability analysis and price comparison
  - modalContent: TicketAnalizer evaluates four closed tickets, one per tier, to calculate total cost, gross sale, taxes, net profit, and profit by item power, tier, and quality. The price comparator helps compare market prices in simple or advanced mode without changing inventory data.
