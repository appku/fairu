
/*
 Descriptions from: https://docs.npmjs.com/cli/v8/configuring-npm/package-json
*/

/**
 * @typedef PackageJSONPerson
 * @property {String} url
 * @property {String} name
 * @property {String} email
 */

/**
 * @typedef PackageJSONFunding
 * @property {String} type
 * @property {String} url
 */

/**
 * @typedef PackageJSON
 * @property {String} name - If you plan to publish your package, the most important things in your package.json are the name and version fields as they will be required. The name and version together form an identifier that is assumed to be completely unique.
 * @property {String} version - If you plan to publish your package, the most important things in your package.json are the name and version fields as they will be required. The name and version together form an identifier that is assumed to be completely unique. Changes to the package should come along with changes to the version. If you don't plan to publish your package, the name and version fields are optional. Version must be parseable by `node-semver`, which is bundled with npm as a dependency. 
 * @property {String} description - Put a description in it. It's a string. This helps people discover your package, as it's listed in `npm search`.
 * @property {Array.<String>} keywords - Put keywords in it. It's an array of strings. This helps people discover your package as it's listed in `npm search`.
 * @property {String} homepage - The url to the project homepage.
 * @property {{url: String, email: String} | String} bugs - The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.
 * @property {String} license - You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it.
 * @property {PackageJSONPerson | String} author - The "author" is one person. 
 * @property {Array.<PackageJSONPerson>} contributors - The "contributors" is an array of people.
 * @property {String | PackageJSONFunding | Array.<PackageJSONFunding>} funding - You can specify an object containing an URL that provides up-to-date information about ways to help fund development of your package, or a string URL, or an array of these.
 * @property {Array.<String>} files - The optional `files` field is an array of file patterns that describes the entries to be included when your package is installed as a dependency. File patterns follow a similar syntax to `.gitignore`, but reversed: including a file, directory, or glob pattern (`*`, `**\/*`, and such) will make it so that file is included in the tarball when it's packed. Omitting the field will make it default to `["*"]`, which means it will include all files.
 * @property {String} main - The main field is a module ID that is the primary entry point to your program. 
 * @property {String} browser - If your module is meant to be used client-side the browser field should be used instead of the main field. 
 * @property {*} bin
 * @property {String | Array.<String>} man
 * @property {*} directories
 * @property {{type: String, url: String} | String} repository - Specify the place where your code lives. This is helpful for people who want to contribute. 
 * @property {*} scripts - The "scripts" property is a dictionary containing script commands that are run at various times in the lifecycle of your package. The key is the lifecycle event, and the value is the command to run at that point.
 * @property {*} config - A "config" object can be used to set configuration parameters used in package scripts that persist across upgrades.
 * @property {*} dependencies - Dependencies are specified in a simple object that maps a package name to a version range. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or git URL.
 * @property {*} devDependencies - If someone is planning on downloading and using your module in their program, then they probably don't want or need to download and build the external test or documentation framework that you use. In this case, it's best to map these additional items in a `devDependencies` object.
 * @property {*} peerDependencies - In some cases, you want to express the compatibility of your package with a host tool or library, while not necessarily doing a `require` of this host. This is usually referred to as a plugin. 
 * @property {*} peerDependenciesMeta - When a user installs your package, npm will emit warnings if packages specified in `peerDependencies` are not already installed. The `peerDependenciesMeta` field serves to provide npm more information on how your peer dependencies are to be used. Specifically, it allows peer dependencies to be marked as optional.
 * @property {*} bundledDependencies - This defines an array of package names that will be bundled when publishing the package.
 * @property {*} optionalDependencies - If a dependency can be used, but you would like npm to proceed if it cannot be found or fails to install, then you may put it in the `optionalDependencies` object.
 * @property {*} overrides - If you need to make specific changes to dependencies of your dependencies, for example replacing the version of a dependency with a known security issue, replacing an existing dependency with a fork, or making sure that the same version of a package is used everywhere, then you may add an override. Overrides provide a way to replace a package in your dependency tree with another version, or another package entirely. These changes can be scoped as specific or as vague as desired.
 * @property {{node: String, npm: String}} engines - You can specify the version of `node` or `npm` that your stuff works on.
 * @property {Array.<String>} os - You can specify which operating systems your module will (or will not) run on.
 * @property {Array.<String>} cpu - If your code only runs on certain cpu architectures, you can specify which ones it does and does not work on.
 * @property {Boolean} private - If you set `"private": true` in your `package.json`, then npm will refuse to publish it.
 * @property {*} publishConfig - This is a set of config values that will be used at publish-time. It's especially handy if you want to set the tag, registry or access, so that you can ensure that a given package is not tagged with "latest", published to the global public registry or that a scoped module is private by default.
 * @property {Array.<String>} workspaces - The optional `workspaces` field is an array of file patterns that describes locations within the local file system that the install client should look up to find each workspace that needs to be symlinked to the top level `node_modules` folder. It can describe either the direct paths of the folders to be used as workspaces or it can define globs that will resolve to these same folders.
 */