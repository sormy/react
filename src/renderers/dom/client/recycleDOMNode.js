let trashBin = null;

/**
 * This is a special way to release DOM nodes without introducing mem leaks on IE.
 *
 * Seems to work for everything except forms.
 *
 * @see https://social.msdn.microsoft.com/Forums/ie/en-US/c76967f0-dcf8-47d0-8984-8fe1282a94f5/ie-appendchildremovechild-memory-problem?forum=iewebdevelopment
 */
function recycleDOMNode(element) {
  if (!trashBin) {
    trashBin = document.createElement('DIV');
    trashBin.id = 'ie-trash-bin';
    trashBin.style.display = 'none';
    document.body.appendChild(trashBin);
  }

  // move the element to the trash bin and release it using innerHTML = ""
  trashBin.appendChild(element);
  trashBin.innerHTML = '';
}

// noop for modern browsers
module.exports = /\bMSIE\b/.test(navigator.userAgent) ? recycleDOMNode : () => undefined;
