// Parse link label
//
// this function assumes that first character ("[") already matches;
// returns the end of the label
//
'use strict';
const quoteMarkers = [0x22 /* " */, 0x27 /* ' */]

module.exports = function parseNestableLabel(src, start, max, openMark, closeMark) {
  
  let openMarkCode = openMark.charCodeAt(0)
  let closeMarkCode = closeMark.charCodeAt(0)

  if (src.charCodeAt(start) != openMarkCode) return -1

  var level, found, marker

  let pos = start + 1;

  level = 1;
  let quoteMarker = null

  while (pos < max) {
    marker = src.charCodeAt(pos);
    if (quoteMarkers.indexOf(marker) > -1) {
      if (src.charCodeAt(pos - 1) != 0x5C /* / */) {
        if ((!quoteMarker)) {
          quoteMarker = marker;
          pos++
          continue
        }
        else if (marker == quoteMarker) {
          quoteMarker = null
          pos++
          continue
        }
      }
    }

    if (marker === closeMarkCode && (!quoteMarker)) {
      level--;
      pos++
      if (level === 0) {
        found = true;
        break;
      }
      continue
    }

    if (marker === openMarkCode && (!quoteMarker)) {
      level++;
      pos++
      continue
    }

    pos++

  }

  if (found) {
    return pos;
  } else {
    return -1
  }

};