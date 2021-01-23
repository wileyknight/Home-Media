export const rename = (
    name: string,
    directory: boolean = false,
    database: boolean = false
) => {
    let dropExtension: string = name;
    if (!directory) {
        dropExtension = name.substring(0, name.length - 4);
    }

    if (!database) {
        dropExtension = dropExtension.toLowerCase();
    }
    const removeSubs = dropExtension.split(' subs').join('');
    const removeMultiparts = removeSubs
        .split(' mp1')
        .join('')
        .split(' mp2')
        .join('')
        .split(' mp3')
        .join('')
        .split(' mp4')
        .join('');
    const removeCommentary = removeMultiparts.split(' commentary').join('');
    const removeCopies = removeCommentary
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
    let searchStr = removeCopies;
    if (!database) {
        searchStr = removeCopies.split(' ').join('+');
    }

    return searchStr;
};