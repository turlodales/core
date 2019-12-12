# Notes

See `demo/usage-in-lit.html` for working demo in `lit`.

From discussion with Dave L.:

- Don't need `<d2l-table>/<d2l-th>/etc`. elements, as they were only needed because Polymer’s looping elements didn’t work with native table elements in IE11

- We want `<d2l-table-col-sort-button>` since it’s kind of a standalone element and `<d2l-table-wrapper>`, which handles the scrolling/overflow stuff and sticky headers.

- 90% of this will just be styling, so we’ll want to create a style JS file (similar to a lot of the other components in core) that contains the CSS. Consumers can then import that into their Lit elements and just put the d2l-table CSS class on a native table element.

- The CSS will end up being very different, since Lit doesn’t have style mixins — that’s OK. It’ll have to be ported over very delicately though. We also don’t need to bring over ALL the CSS variables… we technically don’t need to bring any over if they’re not actually being used externally. If something doesn’t need to be customizable, exposing a variable for it just adds complexity and a performance penalty for no reason.

## Additional Info

- Removed all `<d2l-t*>` related CSS rules and `@apply` usages
  - See `scroll-wrapper.js` for comments on where some those mixins are used in Brightspace
- In `table-wrapper`:
  - Removed `fastdom` usage
  - Updated to use `classList.toggle` that was not available in IE11
- Replaced property observers with `attributeChangedCallback`, and deleted `notify` from properties
- Changed `table-observer-behavior` into mixin
  - Replaced `polymer.dom` with `MutationObserver`
- Add `stickyfilljs` dependency

## Bugs
- When changing page to `ltr`, the left side of the table has no border - this seems to be present in the Polymer version as well though
