/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {HostComponent, HostText} from 'shared/ReactWorkTags';
import invariant from 'shared/invariant';

const randomKey = Math.random()
  .toString(36)
  .slice(2);
const internalInstanceKey = '__reactInternalInstance$' + randomKey;
const internalEventHandlersKey = '__reactEventHandlers$' + randomKey;

// IE 6/7 will fail this check
let supportsCustomPropsOnTextNodes = false;
try {
  document.createTextNode("test")[internalInstanceKey] = true;
  supportsCustomPropsOnTextNodes = true;
} catch (e) {}

const textNodes = new Map()

function isAttached(node) {
  while (node) {
    node = node.parentNode;
    if (node === document) {
      return true;
    }
  }
  return false;
}

function recycleTextNodes() {
  var toRecycle = [];
  textNodes.forEach(function (hostInst, textNode) {
    if (!isAttached(textNode.parentNode)) {
      toRecycle.push([textNode, hostInst]);
    }
  })
  toRecycle.forEach(function ([textNode, hostInst]) {
    textNodes.delete(textNode);
  })
}

function recycleTextNodesTask() {
  setTimeout(function () {
    recycleTextNodesTask();
  }, 10000);
}

recycleTextNodesTask();

function getNodeInstance(node) {
  if (!supportsCustomPropsOnTextNodes && node.nodeType === 3) {
    return textNodes.get(node);
  } else {
    return node[internalInstanceKey];
  }
}

function setNodeInstance(node, hostInst) {
  if (!supportsCustomPropsOnTextNodes && node.nodeType === 3) {
    textNodes.set(node, hostInst);
  } else {
    node[internalInstanceKey] = hostInst;
  }
}

export function precacheFiberNode(hostInst, node) {
  setNodeInstance(node, hostInst);
}

/**
 * Given a DOM node, return the closest ReactDOMComponent or
 * ReactDOMTextComponent instance ancestor.
 */
export function getClosestInstanceFromNode(node) {
  const hostInst = getNodeInstance(node);

  if (hostInst) {
    return hostInst;
  }

  while (!getNodeInstance(node)) {
    if (node.parentNode) {
      node = node.parentNode;
    } else {
      // Top of the tree. This node must not be part of a React tree (or is
      // unmounted, potentially).
      return null;
    }
  }

  let inst = getNodeInstance(node);
  if (inst.tag === HostComponent || inst.tag === HostText) {
    // In Fiber, this will always be the deepest root.
    return inst;
  }

  return null;
}

/**
 * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
 * instance, or null if the node was not rendered by this React.
 */
export function getInstanceFromNode(node) {
  const inst = getNodeInstance(node);
  if (inst) {
    if (inst.tag === HostComponent || inst.tag === HostText) {
      return inst;
    } else {
      return null;
    }
  }
  return null;
}

/**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */
export function getNodeFromInstance(inst) {
  if (inst.tag === HostComponent || inst.tag === HostText) {
    // In Fiber this, is just the state node right now. We assume it will be
    // a host component or host text.
    return inst.stateNode;
  }

  // Without this first invariant, passing a non-DOM-component triggers the next
  // invariant for a missing parent, which is super confusing.
  invariant(false, 'getNodeFromInstance: Invalid argument.');
}

export function getFiberCurrentPropsFromNode(node) {
  return node[internalEventHandlersKey] || null;
}

export function updateFiberProps(node, props) {
  node[internalEventHandlersKey] = props;
}
