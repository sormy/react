/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export function addEventBubbleListener(
  element: Document | Element,
  eventType: string,
  listener: Function,
): void {
  // IE 6/7 has no addEventListener() but has attachEvent()
  if (element.addEventListener) {
    element.addEventListener(eventType, listener, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventType, listener)
  }
}

export function addEventCaptureListener(
  element: Document | Element,
  eventType: string,
  listener: Function,
): void {
  // IE 6/7 has no addEventListener() but has attachEvent()
  if (element.addEventListener) {
    element.addEventListener(eventType, listener, true);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventType, listener)
  }
}
