//https://github.com/rhardin/node-statistics2/blob/master/lib/statistics2.js

export function pchi2dist(n, y) { return pchi2(n, 1.0 - y); }
export function chi2dist(n, x) { return 1.0 - q_chi2(n, x); }

function pchi2(n, y) {
    var w, eps, v, s, qe;

    if (n === 1) {
        w = pnorm(1 - y / 2);
        return w * w;
    } else if (n === 2) {
        return -2.0 * Math.log(y);
    }

    eps = 1.0e-5;
    v = 0.0;
    s = 10.0;
    while (true) {
        v = v + 2;

        if (s <= eps) { break; }
        if ((qe = q_chi2(n, v) - y) === 0.0) { break; }
        if (qe < 0.0) {
            v = v - s;
            s = s / 10.0;
        }
    }
    return v;
}

function pnorm(qn) {
    var b = [1.570796288, 0.03706987906, -0.8364353589e-3,
        -0.2250947176e-3, 0.6841218299e-5, 0.5824238515e-5,
        -0.104527497e-5, 0.8360937017e-7, -0.3231081277e-8,
        0.3657763036e-10, 0.6936233982e-12],
        w1 = qn,
        w3 = -Math.log(4.0 * w1 * (1.0 - w1)),
        i = 1;

    if (qn < 0.0 || qn > 1.0) { return 0.0; }
    if (qn === 0.5) { return 0.0; }
    if (qn > 0.5) { w1 = 1.0 - w1; }

    w1 = b[0];
    for (i; i < 11; i++) {
        w1 += b[i] * Math.pow(w3, i);
    }

    if (qn > 0.5) { return Math.sqrt(w1 * w3); }

    return -Math.sqrt(w1 * w3);
}


function normal__x(z) { return 1.0 - normaldist(z); }

function q_chi2(df, chi2) {
    var chi, t = 0, k = 0, s = 0;
    if ((df & 1) !== 0) {
        chi = Math.sqrt(chi2);

        if (df === 1) { return 2 * normal__x(chi); }

        t = chi * Math.exp(-0.5 * chi2) / Math.sqrt(2 * Math.PI);
        s = t;
        k = 3;
        while (k < df) {
            t = t * (chi2 / k);
            s = s + t;
            k = k + 2;
        }

        return 2 * (normal__x(chi) + s);
    }

    t = Math.exp(-0.5 * chi2);
    s = t;
    k = 2;
    while (k < df) {
        t = t * (chi2 / k);
        s = s + t;
        k = k + 2;
    }

    return s;
}




function normaldist(z) {
    return p_nor(z);
}

function p_nor(z) {
    var e, z2, prev = 0.0, t, p, i = 3;

    if (z < -12) { return 0.0; }
    if (z > 12) { return 1.0; }
    if (z === 0.0) { return 0.5; }
    if (z > 0) {
        e = true;
    } else {
        e = false;
        z = -z;
    }

    z2 = z * z;
    p = z * Math.exp(-0.5 * z2) / Math.sqrt(2 * Math.PI);
    t = p;

    for (i; i < 200; i = i + 2) {
        prev = p;
        t = t * (z2 / i);
        p = p + t;
        if (p <= prev) { return (e ? 0.5 + p : 0.5 - p); }
    }

    return (e ? 1.0 : 0.0);
}