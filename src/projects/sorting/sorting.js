let c, ctx, height, width, arr, num, stop, speed, skip, bar_width;

function randomise() {
    arr = [];

    for (let i = 0; i < num; i++) {
        arr.push(randrange(5, width));
    }
}

export function init() {
    c = document.getElementById('sorting_canvas');
    ctx = c.getContext("2d");
    height = c.height;
    width = c.width;
    stop = 0;
    speed = 10;
    skip = 1;
}

export function reset() {
    stop = 1;
    randomise();

    let t = speed;
    speed = 0;
    draw();
    speed = t;

}

export function update(n, s, k, w) {
    num = n;
    speed = s;
    skip = k;
    bar_width = parseInt(w);
    height = c.height;

    draw();
}

function randrange(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function draw() {
    return new Promise((resolve) => {
        setTimeout(() => {
            ctx.clearRect(0, 0, width, height);

            ctx.beginPath();

            for (let i = 0; i < arr.length; i++) {

                ctx.rect(0, (i * (bar_width + 2)), arr[i], bar_width);
            }

            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            resolve("done drawing");
        }, speed)
    })
}

export async function bubble_sort() {
    stop = 0;
    let n = 0;

    //For each loop
    for (let i = 0; i < arr.length; i++) {
        //For remaining items
        for (let k = 0; k < arr.length - 1 - i; k++) {

            if (arr[k] > arr[k + 1]) {

                arr = swap(arr, k, k + 1)

                if (n % skip == 0) {
                    n = 0;
                    await draw();
                }

                if (stop) {
                    return
                }

                n++;
            }
        }
    }

    draw();
}

export async function selection_sort() {

    let n = 0;

    for (let i = 0; i < arr.length; i++) {
        let maxidx = 0;

        for (let k = 0; k < arr.length - i; k++) {
            if (arr[maxidx] < arr[k]) {
                maxidx = k;
            }
        }

        arr = swap(arr, arr.length - i - 1, maxidx);

        if (n % skip == 0) {
            n = 0;
            await draw();
        }

        n++;

    }

    draw();
}

function swap(a, i, j) {
    let temp = a[i];
    a[i] = a[j];
    a[j] = temp;

    return a;
}