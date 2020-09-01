export function expected_frequencies(sumh, sumv, total) {

    let expected = [];
    let enough = true;
    let warning = false;

    for (let row = 0; row < sumh.length; row++) {
        expected.push([]);

        let frac = sumh[row] / total
        for (let col = 0; col < sumv.length; col++) {
            let val = frac * sumv[col];

            if (!val) {
                enough = false;
            }

            if (val < 5) {
                warning = true;
            }

            expected[row].push(+val);
        }
    }

    return [expected, enough, warning];

}

export function chi_sq(freq, values) {

    let sum = 0

    for (let i = 0; i < freq.length; i++) {
        for (let k = 0; k < freq[i].length; k++) {
            let e = freq[i][k];
            let o = values[i][k];

            let cont = ((o - e) ** 2) / e

            sum += cont
            console.log(i, k, cont)
        }
    }

    return sum
}