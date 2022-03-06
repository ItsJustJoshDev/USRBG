const { writeFileSync } = require('fs');
async function compile() {
    const data = JSON.parse(readFileSync("./dist/usrbg.json"));

    const createRule = (uids, rules) => `${uids.map(uid => `[src*="${uid}"]`).join()}{${rules.join("")}}`

    const backgrounds = new Map(Object.entries({ none: new Map, left: new Map, right: new Map }))

    for (const { orientation, img, uid } of data) {
        const parsedImage = img.startsWith("http") ? img : `https://i.imgur.com/${img}.gif`;
        const map = backgrounds.get(orientation);
        const background = map.get(parsedImage);
        if (!background) map.set(parsedImage, [uid]);
        else background.push(uid);
    }

    const css = [...backgrounds].map(([orientation, map]) => {
        return [...map].map(([img, uids]) => {
            if (orientation === "none") return createRule(uids, [`--user-background:url("${img}")`])
            else return createRule(uids, [`--user-background:url("${img}");`, `--user-popout-position:${orientation}!important`])
        }).join("");
    }).join("");
    return ".userPopout-xaxa6l{--user-popout-position:center}" + css
}


try { compile().then(css => writeFileSync("./dist/usrbg.css", css)) }
catch (err) { console.log(err) }
