/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module image/imagelaternatetext/imagealternatetextcommand
 */

import Command from 'ckeditor5-core/src/command/command';
import { isImage } from '../utils';

/**
 * The image alternate text command. It is used to change `alt` attribute on `image` elements.
 *
 * @extends module:core/command/command~Command
 */
export default class ImageAlternateTextCommand extends Command {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		this.set( 'value', false );

		// Update current value and refresh state each time something change in model document.
		this.listenTo( editor.document, 'changesDone', () => {
			this._updateValue();
			this.refreshState();
		} );
	}

	/**
	 * Updates command's value.
	 *
	 * @private
	 */
	_updateValue() {
		const doc = this.editor.document;
		const element = doc.selection.getSelectedElement();

		if ( isImage( element ) && element.hasAttribute( 'alt' ) ) {
			this.value = element.getAttribute( 'alt' );
		} else {
			this.value = false;
		}
	}

	/**
	 * @inheritDoc
	 */
	_checkEnabled() {
		const element = this.editor.document.selection.getSelectedElement();

		return isImage( element );
	}

	/**
	 * Executes command.
	 *
	 * @protected
	 * @param {Object} options
	 * @param {String} options.newValue New value of `alt` attribute to set.
	 * @param {module:engine/model/batch~Batch} [options.batch] Batch to collect all the change steps. New batch will be
	 * created if this option is not set.
	 */
	_doExecute( options ) {
		const editor = this.editor;
		const doc = editor.document;
		const imageElement = doc.selection.getSelectedElement();

		doc.enqueueChanges( () => {
			const batch = options.batch || doc.batch();

			batch.setAttribute( imageElement, 'alt', options.newValue );
		} );
	}
}