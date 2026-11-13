# Garage Gallery Lightbox

## Scope

Add an image-focused full-screen viewer to the existing garage galleries without changing the garage content, grid, or deployment model.

## Visual thesis

A restrained, near-black viewing surface lets each race-car photograph fill the screen while the controls remain precise, monochrome, and secondary to the image.

## Content plan

- Keep the existing car hero, details, and gallery grid unchanged.
- Turn each gallery thumbnail into an explicit “open full screen” control.
- Show the selected image, car/image label, position, close control, and previous/next controls in one page-level dialog.

## Interaction thesis

- Clicking or keyboard-activating a thumbnail opens that image in a modal viewer.
- The viewer supports close button, backdrop click, Escape, and Left/Right Arrow navigation within the selected car's gallery.
- Opening and closing use short `LUXE_EASE`-compatible transitions; reduced-motion users receive no transition.

## Acceptance criteria

1. Every visible garage gallery thumbnail is a keyboard-focusable button with an accessible name.
2. Activating a thumbnail opens a full-viewport viewer showing the corresponding full-resolution source without leaving `/garage`.
3. Escape, the close button, and clicking outside the displayed image close the viewer and restore focus to the originating thumbnail.
4. Previous/next buttons and Left/Right Arrow keys cycle only through the currently selected car's gallery images.
5. Background scrolling stops while the viewer is open and resumes after it closes, including when Lenis is active.
6. The image fits within the viewport without cropping at desktop and mobile widths.
7. `pnpm run build` completes successfully.

