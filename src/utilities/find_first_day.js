/**
 *
 * @param {string} date A string representing a date in the
 * same format as the one returned by calling toDateString()
 * on a date object.
 * @return Assuming a calendat widget of six columns, which
 * shows a single month on its entirety, this function returns
 * the first day on the widget.
 */
export default function find_dates(year, month) {
    const millisInDay = 24 * 60 * 60 * 1000;
    const dates = [];
    let presentDay, presentTime, checked;

    presentDay = new Date(year, month, 1);
    presentTime = presentDay.toDateString().split(" ")[0];
    checked = false;

    if (presentTime === "Sun") {
        presentDay = new Date(presentDay.valueOf() - 7 * millisInDay);
        presentTime = presentDay.toDateString().split(" ")[0];
    }

    while (presentTime !== "Sun") {
        presentDay = new Date(presentDay.valueOf() - millisInDay);
        presentTime = presentDay.toDateString().split(" ")[0];
    }

    for (let i = 0; i < 42; i++) {
        let date;

        date = new Date(presentDay.valueOf() + millisInDay * i).toDateString();
        presentTime = date.split(" ");

        if (!checked && presentTime[1] === "Nov" && presentTime[0] === "Sun") {
            presentDay = new Date(presentDay.valueOf() + millisInDay);
            date = new Date(
                presentDay.valueOf() + millisInDay * i
            ).toDateString();
            checked = true;
        }

        dates.push(date);
    }
    return dates;
}

function find_duplicates(array) {
    const duplicates = [];

    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++)
            if (!duplicates.some((elem) => elem.indices.includes(j))) {
                if (array[j] === array[i]) {
                    const dup = duplicates.find(
                        (elem) => elem.duplicate === array[i]
                    );

                    if (!dup)
                        duplicates.push({
                            duplicate: array[i],
                            indices: [i, j],
                        });
                    else dup.indices.push(j);
                }
            }
    }
    return duplicates;
}

function foo(year) {
    console.log(`Analysis for Year ${year.year} :`);

    for (let m = 0; m < 12; m++) {
        console.log(`Duplicates of month ${m} :`);
        console.log(find_duplicates(year.months[m]));
    }
    console.log("----------------------------------------------------------");
}

const years = [];

for (let y = 2010; y < 2025; y++) {
    const year = { year: y, months: [] };

    for (let m = 0; m < 12; m++) year.months.push(find_dates(y, m));
    years.push(year);
}

// for (let year of years) foo(year);

// console.log(find_dates(2024, 9));
// console.log(find_dates(2024, 10));
// console.log(find_dates(2024, 11));
