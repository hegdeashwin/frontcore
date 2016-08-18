'use strict';

import path from 'path';
import fs from 'fs';

/**
 * Utility function to construct JavaScript object for directory & files structure.
 */
exports.getDirectoryTree = function directoryTree (projPath, onlyOneLevel, extensions) {
	const name = path.basename(projPath);
	const item = { projPath, name };
	item.isFile = false;
	let stats;

	try {
    stats = fs.statSync(projPath);
  } catch (e) {
    return null;
  }

	if (stats.isFile()) {
		const ext = path.extname(projPath).toLowerCase();
		if (extensions && extensions.length && extensions.indexOf(ext) === -1) {
      return null;
    }
		item.isFile = true;
		item.size = stats.size;  // File size in bytes
		item.extension = ext;
	} else if (stats.isDirectory()) {
		try {
      if(onlyOneLevel) {
        item.children = fs.readdirSync(projPath)
          .map(child => directoryTree(path.join(projPath, child), false, extensions))
          .filter(e => !!e);

        if (!item.children.length) {
          return null;
        }
        item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
      }
		} catch(ex) {
      /**
       * User does not have permissions, ignore directory
       */
			if (ex.code === "EACCES") {
        return null;
      }
		}
	} else {
    /**
     * Set item.size = 0 for devices, FIFO and sockets ?
     */
		return null;
	}
	return item;
}
