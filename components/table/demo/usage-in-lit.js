import '../table-wrapper.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { tableStyles } from '../table-styles.js';

class TableTest extends LitElement {
	static get styles() {
		return [tableStyles, css`
				:host {
					display: block;
				}
			`];
	}

	render() {
		return html`
			<d2l-table-wrapper type="default"><table class="d2l-table">
				<thead>
					<tr>
						<th>Header column 1</th>
						<th>Header column 2</th>
						<th>Header column 2</th>
						<th>Header column 2</th>
						<th>Header column 2</th>
						<th>Header column 2</th>
						<th>Header column 2</th>
						<th>Header column 2</th>
						<th>Header column 2</th>
						<th>Header column 2</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>row 1 column 1</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
					</tr>
					<tr>
						<td>row 1 column 1</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
					</tr>
					<tr>
						<td>row 1 column 1</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
					</tr>
					<tr>
						<td>row 1 column 1</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
					</tr>
					<tr>
						<td>row 1 column 1</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
						<td>row 1 column 2</td>
					</tr>
				</tbody>
			</table></d2l-table-wrapper>`;
	}

}
customElements.define('d2l-table-test', TableTest);
