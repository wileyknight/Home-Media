"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rename = void 0;
exports.rename = function (name, directory, database) {
    if (directory === void 0) { directory = false; }
    if (database === void 0) { database = false; }
    var dropExtension = name;
    if (!directory) {
        dropExtension = name.substring(0, name.length - 4);
    }
    if (!database) {
        dropExtension = dropExtension.toLowerCase();
    }
    var removeSubs = dropExtension.split(' subs').join('');
    var removeMultiparts = removeSubs
        .split(' mp1')
        .join('')
        .split(' mp2')
        .join('')
        .split(' mp3')
        .join('')
        .split(' mp4')
        .join('');
    var removeCommentary = removeMultiparts.split(' commentary').join('');
    var removeCopies = removeCommentary
        .split('_1')
        .join('')
        .split('_2')
        .join('')
        .split('_3')
        .join('')
        .split('_4')
        .join('')
        .split('_5')
        .join('')
        .split('_6')
        .join('')
        .split('_7')
        .join('')
        .split('_8')
        .join('')
        .split('_9')
        .join('');
    var searchStr = removeCopies;
    if (!database) {
        searchStr = removeCopies.split(' ').join('+');
    }
    return searchStr;
};
//# sourceMappingURL=rename.js.map