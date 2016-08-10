Package `a@1.0.0` depends on `b@^1.0.0`. `b@1.0.0` depends on
`c@1.0.0`.

The flat package tree for `a@1.0.0` is:

```javascript
var tree = [
  {
    name: 'b',
    version: '1.0.0',
    range: '^1.0.0',
    links: [{name: 'c', version: '1.0.0', range: '^1.0.0'}]
  },
  {
    name: 'c',
    version: '1.0.0',
    links: []
  }
]
```

`b@1.0.0` is a direct dependency of `a@1.0.0`.  Its record has a
`.range` property.

`c@1.0.0` is an indirect dependency of `a@1.0.0`.  `b@1.0.0` links to
`c@1.0.0`.

If `x@1.0.0` depends on `a@1.0.0`, we can modify the tree for
`a@1.0.0` so we can merge it to create a tree for `x@1.0.0` by adding
a dependency record for `a@1.0.0` and turning all direct dependencies
of `a@1.0.0` (`b@1.0.0`) into links from `a@1.0.0`:

```javascript
var demote = require('demote-flat-package-tree')
var assert = require('assert')

demote('a', '1.0.0', '^1.0.0', tree)

assert.deepEqual(
  tree,
  [
    {
      name: 'a',
      version: '1.0.0',
      range: '^1.0.0',
      links: [{name: 'b', version: '1.0.0', range: '^1.0.0'}]
    },
    {
      name: 'b',
      version: '1.0.0',
      links: [{name: 'c', version: '1.0.0', range: '^1.0.0'}]
    },
    {
      name: 'c',
      version: '1.0.0',
      links: []
    }
  ]
)
```

```javascript
var missingCandD = [
  {
    name: 'b',
    version: '1.0.0',
    range: '^1.0.0',
    links: [{name: 'c', range: '^1.0.0'}]
  },
  {
    name: 'd',
    range: '^1.0.0',
    links: []
  }
]

demote('a', '1.0.0', '^1.0.0', missingCandD)

assert.deepEqual(
  missingCandD,
  [
    {
      name: 'a',
      version: '1.0.0',
      range: '^1.0.0',
      links: [
        {name: 'b', range: '^1.0.0', version: '1.0.0'},
        {name: 'd', range: '^1.0.0'}
      ]
    },
    {
      name: 'b',
      version: '1.0.0',
      links: [{name: 'c', range: '^1.0.0'}]
    }
  ]
)
```
