
/**
 * @namespace FairuCallback
 */

/**
 * @callback FairuCallback.Path
 * @param {path} p - The path utility for constructing file-system paths.
 * @returns {String}
 */

/**
 * @callback FairuCallback.Condition
 * @param {PathState} state - The state of the path as discovered by Fairu.
 * @returns {Boolean}
 */

/**
 * @callback FairuCallback.PathStateCreate
 * @param {String} targetPath - The path utility for constructing file-system paths.
 * @returns {PathState}
 */

/**
 * @callback FairuCallback.DiscoverErrorHandler
 * @param {Error} err - The error being caught.
 * @param {PathState} state - The state of discovery surrounding a particular path.
 * @returns {Error} Return `null` to stop processing the error and don't throw, or return an Error object to continue
 *   processing and possibly throw (if enabled).
 */