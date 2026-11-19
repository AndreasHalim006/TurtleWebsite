# Homepage podium results

Status: Authorized for implementation by user, 2026-11-19.

## Scope
Replace homepage achievement data using the user's screenshot of the FSG team results table:
https://www.formulastudent.de/teams/fse/details/tid/738
Only ranks 1–3 in Overall, BP, CM, ED, SP, AX, EN, and EF qualify.
Keep the existing photo background, typography, grid, and reveal behavior.
Visual thesis: preserve the dark photographic section and racing green results.
Content plan: update only the existing achievements list and add its source link.
Interaction thesis: retain existing scroll reveals; no new motion or controls.

## Acceptance criteria
- Render all 13 podiums, descending by competition month, from August 2025 to July 2017.
- Show month/year, placement, full discipline name, and competition for every podium.
- For the same event, retain source column order (Overall, BP, CM, ED, SP, AX, EN, EF).
- Remove the unsupported 2021 driverless skidpad and 2015 results.
- Link the source below the list; update pending item 3 and remove its placeholder entry.
- Build succeeds; browser inspection at desktop and mobile confirms 13 results in order, no horizontal page overflow, and no console errors.

## Transcription
2025-08 Greece: 2nd Engineering Design, 2nd Autocross.
2024-07 Switzerland: 3rd Business Plan Presentation, 3rd Skidpad.
2022-07 Austria: 3rd Endurance.
2021-07 Austria: 1st Business Plan Presentation.
2019-07 Italy: 3rd Overall Electric Class, 1st Business Plan Presentation,
3rd Cost & Manufacturing, 3rd Endurance, 2nd Efficiency.
2018-07 Italy: 1st Business Plan Presentation.
2017-07 Italy: 3rd Business Plan Presentation.

## Verification
- `pnpm.cmd run build` passed (10 pages).
- Production preview inspected with Playwright at 1280x900 and 390x844:
  all 13 results appear in descending order, four desktop columns and one mobile column;
  no clipped podium content and no production console errors.
- Desktop has no page overflow. Mobile page width is 397px at a 390px viewport;
  the achievements list fits within 336px. The separate page overflow remains outside this scope.
- Development toolbar returned an outdated dependency 504; production preview is unaffected.
