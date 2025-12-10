import { v4 as uuidv4 } from 'uuid';

export const ItemCreate = (body) => {
    const item = uuidv4().replace(/-/g, '');
    return item;
}


export const ChecksumCreate = async (body) => {

    const { data } = body

    let nmbr = data.number.split('')
    let next = true;

    for (let x = nmbr.length - 1; x >= 0; x--) {

        nmbr[x] = nmbr[x].charCodeAt() - '0'.charCodeAt();
        if (next) nmbr[x] *= 2
        else nmbr[x] *= 1

        nmbr[x] = nmbr[x] % 9 === 0 ? 9 : nmbr[x] % 9
        next = !next
    }

    let chck = (nmbr.reduce((a, c) => a + c))
    return ((10 - (chck % 10)) % 10)

}
