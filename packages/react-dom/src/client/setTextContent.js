/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {TEXT_NODE} from '../shared/HTMLNodeType';
import setInnerHTML from './setInnerHTML';
import escapeTextForBrowser from '../server/escapeTextForBrowser';

const hasTextContent = 'textContent' in document.documentElement;

/**
 * Set the textContent property of a node. For text updates, it's faster
 * to set the `nodeValue` of the Text node directly instead of using
 * `.textContent` which will remove the existing node and create a new one.
 *
 * @param {DOMElement} node
 * @param {string} text
 * @internal
 */
let setTextContent = function(node: Element, text: string): void {
  if (text) {
    let firstChild = node.firstChild;

    if (
      firstChild &&
      firstChild === node.lastChild &&
      firstChild.nodeType === TEXT_NODE
    ) {
      firstChild.nodeValue = text;
      return;
    }
  }
  // IE 6/7 has no textContent property
  if (hasTextContent) {
    node.textContent = text;
  } else {
    setInnerHTML(node, escapeTextForBrowser(text));
  }
};

export default setTextContent;
