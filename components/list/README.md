# Lists

## d2l-list

The `d2l-list` is the container to create a styled list of items using `d2l-list-item` or `d2l-list-item-button`. It provides the appropriate `list` semantics as well as options for displaying separators, etc.

![List](./screenshots/list.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-item.js';
</script>

<d2l-list>
  <d2l-list-item>...</d2l-list-item>
  <d2l-list-item>...</d2l-list-item>
  ...
</d2l-list>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `grid` | Boolean | Enables keyboard grid for supported list items |
| `selection-single` | Boolean | Whether to render with single selection behaviour. If selection-single is specified, the list-items will render with radios  instead of checkboxes, and the list component will maintain a single selected item. |
| `separators` | String | Display separators (`all` (default), `between`, `none`) |
| `extend-separators` | Boolean | Whether to extend the separators beyond the content's edge |

**Methods:**

- `getListItemCount`: returns the length of the items within the list
- `getListItemIndex` (Object): returns the index of the given element within the list
- `getSelectionInfo` (Object): returns a `SelectionInfo` object containing the `state` (`none`, `some`, `all`), and the `keys` (Array) for the selected items

**Events:**

- `d2l-list-selection-change`: dispatched when the selection state changes

### Accessibility Grid

The `grid` attribute will enable a table-like keyboard grid that allows a user to traverse list items with their keyboard. Left and right will switch if using an RTL language.

* **ArrowLeft** moves to the next left item in a row
* **ArrowRight** moves to the next right item in a row
* **ArrowUp** moves to the same item in the row above, if available
* **ArrowDown** moves to the same item in the row below, if available
* **PageUp** moves to the same item in the row **five** rows above, if available
* **PageDown** moves to the same item in the row **five** rows below, if available
* **Home** moves to the first item in the row
* **Ctrl+Home** moves to the first item of the first row
* **End** moves to the last item in the row
* **Ctrl+End** moves to the last item of the last row
* **Space** and **Enter** simulate a click on the focused item

**Note about actions:** Actions must be placed in the `actions` slot. The grid does not support actions/focusable items that are placed in the content area. The list item currently only supports navigation with `href` as the content action.

## d2l-list-header

The `d2l-list-header` component can be placed in the `d2l-list`'s `header` slot to provide a select-all checkbox, summary, a slot for `d2l-selection-action`s, and overflow-group behaviour.

![List](./screenshots/list-selection.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/list/list.js';
  import '@brightspace-ui/core/components/list/list-header.js';
  import '@brightspace-ui/core/components/list/list-item.js';
  import '@brightspace-ui/core/components/selection/selection-action.js';
</script>

<d2l-list>
  <d2l-list-header slot="header">
    <d2l-selection-action requires-selection ...></d2l-selection-action>
    <d2l-selection-action ...></d2l-selection-action>
  </d2l-list-header>
  <d2l-list-item selectable key="eth" label="Earth Sciences">...</d2l-list-item>
  <d2l-list-item selectable key="tch" label="Teaching Practicum">...</d2l-list-item>
  ...
</d2l-list>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `slim` | Boolean | Whether to render a header with reduced whitespace |

## d2l-list-item

The `d2l-list-item` provides the appropriate `listitem` semantics for children within a list. It also provides some basic layout, breakpoints for responsiveness, a navigation link for the primary action, and selection. It extends `ListItemLinkMixin` and `ListItemMixin` and has all the same use cases as the mixin.

![List](./screenshots/list-item.png?raw=true)

```html
<d2l-list-item breakpoints="array"
  href="http://www.d2l.com"
  key="item1"
  label="some label"
  selectable
  selected
  disabled>
  <img src="..." slot="illustration">
  <div>...</div>
  <div slot="actions">
    <d2l-button-icon ...></d2l-button-icon>
    <d2l-button-icon ...></d2l-button-icon>
  </div>
</d2l-list-item>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `href` | String | Address of item link if navigable |

**Events**

- `d2l-list-item-link-click`: dispatched when the item's primary link action is clicked

## d2l-list-item-button

The `d2l-list-item-button` provides the same functionality as `d2l-list-item` except with button semantics for its primary action. It extends `ListItemButtonMixin` and `ListItemMixin` and has all the same use cases as the mixin.

![List](./screenshots/list-item.png?raw=true)

```html
<d2l-list-item-button breakpoints="array"
  @d2l-list-item-button-click="..."
  key="item1"
  label="some label"
  selectable
  selected
  disabled>
  <img src="..." slot="illustration">
  <div>...</div>
  <div slot="actions">
    <d2l-button-icon ...></d2l-button-icon>
    <d2l-button-icon ...></d2l-button-icon>
  </div>
</d2l-list-item-button>
```

**Events**

- `d2l-list-item-button-click`: dispatched when the item's primary button action is clicked

## ListItemMixin

Want to maintain consistency with `d2l-list-item` but need more modularity? This mixin is for you! This mixin allows you to make a component into a list item without requiring custom styling. All of the properties and functionality from `d2l-list-item` will be added to your new component.

### How to use

Import
```javascript
import { ListItemMixin } from './list-item-mixin.js';

class ListItem extends ListItemMixin(LitElement) {
...
```

How add the styles:
```javascript
static get styles() {
	return [ super.styles ];
}
```

How to render the list item:
```javascript
render() {
	return this._renderListItem({
		illustration: html`[Image HTML here]`,
		content: html`[Content here such as d2l-list-item-content]`,
		actions: html`actions here`
	});
}
```
Where the parameters correspond to the slots of `d2l-list-item`:
- illustration (TemplateResult):  Provide an illustration for your list item.
- content (TemplateResult): Core content of the list item, such as a d2l-list-item-content element.
- actions (TemplateResult): Secondary actions for the list item.

**Properties:**

- `breakpoints` (Array): Breakpoints for responsiveness (`[842, 636, 580, 0]`), in pixels. There are four different breakpoints and only the four largest breakpoints will be used. If less breakpoints are used, then skip a middle breakpoint so that the first and last breakpoints will map to the largest and smallest layouts.
  - Breakpoint 0
    - Image: max dimensions: `width: 90px` and `height: 52px` and has `18px margin` from the main content;
    - default break: `x < 580px` where `x` is the width of the component.
  - Breakpoint 1
    - Image: max dimensions: `width: 120px` and `height: 71px` and has `20px margin` from the main content;
    - default break: `581px < x < 636px` where `x` is the width of the component.
  - Breakpoint 2
    - Image: max dimensions: `width: 180px` and `height: 102px` and has `20px margin` from the main content;
    - default break: `637px < x < 842px`  where `x` is the width of the component.
  - Breakpoint 3
    - Image: max dimensions: `width: 216px` and `height: 120px` and has `20px margin` from the main content;
    - default break: `843px < x`  where `x` is the width of the component.
- `disabled` (Boolean): Whether or not the checkbox is disabled
- `draggable` (Boolean): Whether or not the item is draggable
- `key` (String): Value to identify item if selectable
- `label` (String): The hidden label for the checkbox if selectable
- `selectable` (Boolean): Indicates a checkbox should be rendered for selecting the item
- `selected` (Boolean): Whether the item is selected
- `slim` (Boolean): Whether to render the item with reduced whitespace

**Events**

- `d2l-list-item-position-change`: dispatched when a draggable list item's position changes in the list

**Accessibility**

- `drag-handle-text`: The drag-handle label for assistive technology. If implementing drag & drop, you should change this to dynamically announce what the drag-handle is moving for assistive technology in keyboard mode.

## d2l-list-item-content

The `d2l-list-item-content` provides additional consistent layout for primary and secondary text in item content. It may be used with or without the `illustration` and `action` slots mentioned above.

![List](./screenshots/list-item-content.png?raw=true)

```html
<d2l-list-item>
  <d2l-list-item-content>
    <div>Item 1</div>
    <div slot="secondary">Secondary Info for item 1</div>
    <div slot="supporting-info">Supporting info for item 1</div>
  </d2l-list-item-content>
</d2l-list-item>
```

## Drag & Drop Lists

The `d2l-list` supports drag & drop.

![List](./screenshots/drag-and-drop.gif?raw=true)

Because the list itself is a rendering component, there is some light work involved in hooking up this behaviour.

- `d2l-list-item` components within the list must be `draggable` and have `key` set to something unique
- Reordering and re-rendering is the controlling component's responsibility

Here is a simple component example that adds drag 'n' drop to a list:

```js
import '../list-item.js';
import '../list.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { repeat } from 'lit-html/directives/repeat';

class ListDemoDragAndDropUsage extends LitElement {
  static get properties() {
    return {
      list: { type: Array }
    };
  }

  constructor() {
    super();
    this.list = [
      {
        key: '1',
        content: 'I am another cool list item'
      },
      {
        key: '2',
        content: 'I am an extra cool list item'
      },
      {
        key: '3',
        content: 'I am a very cool list item'
      }
    ];
  }

  render() {
    return html`
      <d2l-list @d2l-list-item-position-change="${this._moveItems}">
        ${repeat(this.list, (item) => item.key, (item) => html`
          <d2l-list-item draggable key="${item.key}">
            ${item.content}
          </d2l-list-item>
        `)}
      </d2l-list>
    `;
  }

  _moveItems(e) {
    e.detail.reorder(this.list, { keyFn: (item) => item.key });
    this.requestUpdate('list', []);
  }
}
```

### d2l-list-item-position-change Event Details

This event includes a detail object with helper methods attached to it.

**Methods**

- `announceMove(list, {announceFn, keyFn})`: Announces a move event to screenreaders
  - `list`: The array of items
  - `announceFn(any, Number)`: A callback function that takes a given item in the array and its index, and returns the text to announce
  - `keyFn(any)`: A callback function that takes a given item in the array and returns its key
- `fetchPosition(list, key, keyFn)`:
  - `list`: The array of items
  - `key`: The key of the item to fetch the position of
  - `keyFn(any)`: A callback function that takes a given item in the array and returns its key
- `reorder(list, {announceFn, keyFn})`: Reorders an array of items in-place using the information from the event
  - `list`: The array of items
  - `announceFn(any, Number) (optional)`: A callback function that takes a given item in the array and its index, and returns the text to announce
  - `keyFn(any)`: A callback function that takes a given item in the array and returns its key


## Future Enhancements

- Paging: integration with "load more", "scroll" and "numeric" paging mechanisms

Looking for an enhancement not listed here? Create a GitHub issue!
