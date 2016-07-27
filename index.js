var sort = require('sort-flat-package-tree')

module.exports = function (name, version, range, tree) {
  // Create a new dependency record for the parent.
  var parent = {
    name: name,
    version: version,
    range: range,
    // Create links from the new parent to all direct dependencies in
    // the existing tree.
    links: tree.reduce(function (links, dependency) {
      return dependency.range
      ? links.concat({
        name: dependency.name,
        version: dependency.version,
        range: dependency.range
      })
      : links
    }, [])
  }

  // Demote direct dependencies in the tree to indirect dependencies.
  tree.forEach(function (dependency) {
    delete dependency.range
  })

  tree.push(parent)

  sort(tree)

  return tree
}
