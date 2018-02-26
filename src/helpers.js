/* eslint no-unused-vars: 0 */

function createElement (element, makeNested) {
  if (element instanceof SVG.Element) return element

  if (typeof element === 'object') {
    return SVG.adopt(element)
  }

  if (element == null) {
    return new SVG.Doc()
  }

  if (typeof element === 'string' && element.charAt(0) !== '<') {
    return SVG.adopt(document.querySelector(element))
  }

  var node = SVG.create('svg')
  node.innerHTML = element

  element = SVG.adopt(node.firstElementChild)

  return element
}

function isNulledBox (box) {
  return !box.w && !box.h && !box.x && !box.y
}

function domContains (node) {
  return (document.documentElement.contains || function (node) {
    // This is IE - it does not support contains() for top-level SVGs
    while (node.parentNode) {
      node = node.parentNode
    }
    return node === document
  }).call(document.documentElement, node)
}

function pathRegReplace (a, b, c, d) {
  return c + d.replace(SVG.regex.dots, ' .')
}

// creates deep clone of array
function arrayClone (arr) {
  var clone = arr.slice(0)
  for (var i = clone.length; i--;) {
    if (Array.isArray(clone[i])) {
      clone[i] = arrayClone(clone[i])
    }
  }
  return clone
}

// tests if a given element is instance of an object
function is (el, obj) {
  return el instanceof obj
}

// tests if a given selector matches an element
function matches (el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector)
}

// Convert dash-separated-string to camelCase
function camelCase (s) {
  return s.toLowerCase().replace(/-(.)/g, function (m, g) {
    return g.toUpperCase()
  })
}

// Capitalize first letter of a string
function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Ensure to six-based hex
function fullHex (hex) {
  return hex.length === 4
    ? [ '#',
      hex.substring(1, 2), hex.substring(1, 2),
      hex.substring(2, 3), hex.substring(2, 3),
      hex.substring(3, 4), hex.substring(3, 4)
    ].join('')
    : hex
}

// Component to hex value
function compToHex (comp) {
  var hex = comp.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

// Calculate proportional width and height values when necessary
function proportionalSize (element, width, height) {
  if (width == null || height == null) {
    var box = element.bbox()

    if (width == null) {
      width = box.width / box.height * height
    } else if (height == null) {
      height = box.height / box.width * width
    }
  }

  return {
    width: width,
    height: height
  }
}

// Delta transform point
function deltaTransformPoint (matrix, x, y) {
  return {
    x: x * matrix.a + y * matrix.c + 0,
    y: x * matrix.b + y * matrix.d + 0
  }
}

// Map matrix array to object
function arrayToMatrix (a) {
  return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
}

// Parse matrix if required
function parseMatrix (matrix) {
  if (!(matrix instanceof SVG.Matrix)) {
    matrix = new SVG.Matrix(matrix)
  }

  return matrix
}

// Add centre point to transform object
function ensureCentre (o, target) {
  o.cx = o.cx == null ? target.bbox().cx : o.cx
  o.cy = o.cy == null ? target.bbox().cy : o.cy
}

// PathArray Helpers
function arrayToString (a) {
  for (var i = 0, il = a.length, s = ''; i < il; i++) {
    s += a[i][0]

    if (a[i][1] != null) {
      s += a[i][1]

      if (a[i][2] != null) {
        s += ' '
        s += a[i][2]

        if (a[i][3] != null) {
          s += ' '
          s += a[i][3]
          s += ' '
          s += a[i][4]

          if (a[i][5] != null) {
            s += ' '
            s += a[i][5]
            s += ' '
            s += a[i][6]

            if (a[i][7] != null) {
              s += ' '
              s += a[i][7]
            }
          }
        }
      }
    }
  }

  return s + ' '
}

// Deep new id assignment
function assignNewId (node) {
  // do the same for SVG child nodes as well
  for (var i = node.children.length - 1; i >= 0; i--) {
    assignNewId(node.children[i])
  }

  if (node.id) {
    return SVG.adopt(node).id(SVG.eid(node.nodeName))
  }

  return SVG.adopt(node)
}

// Add more bounding box properties
function fullBox (b) {
  if (b.x == null) {
    b.x = 0
    b.y = 0
    b.width = 0
    b.height = 0
  }

  b.w = b.width
  b.h = b.height
  b.x2 = b.x + b.width
  b.y2 = b.y + b.height
  b.cx = b.x + b.width / 2
  b.cy = b.y + b.height / 2

  return b
}

// Get id from reference string
function idFromReference (url) {
  var m = (url || '').toString().match(SVG.regex.reference)

  if (m) return m[1]
}

// Create matrix array for looping
var abcdef = 'abcdef'.split('')
