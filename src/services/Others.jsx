const SplitBirthday = date => {
    if (date) {
        const _split = date.split("-");
        const splitedBirthday = {
            day: _split[2],
            month: _split[1],
            year: _split[0]
        };

        return splitedBirthday;
    }
    return null;
};

export {SplitBirthday};
