import { readFileSync } from "fs-promise";


export function base64_encode(file) {
    var bitmap = readFileSync(file);

    return new Buffer(bitmap).toString('base64');
}