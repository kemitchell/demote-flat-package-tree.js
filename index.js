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
      if (dependency.range) {
        var record = {
          name: dependency.name,
          range: dependency.range
        }
        if (dependency.version) {
          record.version = dependency.version
        }
        links.push(record)
      }
      return links
    }, [])
  }

  // Demote direct dependencies in the tree to indirect dependencies.
  tree.forEach(function (dependency) {
    delete dependency.range
    if (dependency.version === undefined) {
      tree.splice(tree.indexOf(dependency), 1)
    }
  })

  tree.push(parent)

  sort(tree)

  return tree
}
