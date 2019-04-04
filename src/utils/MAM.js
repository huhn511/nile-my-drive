import Mam from '@iota/mam';
import { trytesToAscii } from '@iota/converter'
import { provider } from '../config.json';


export const fetch = (
    root,
    mode = 'public',
    key = null,
    reportEvent,
    onFetchComplete
) => {
    if (!provider || !root) return;
    const promise = new Promise(async (resolve, reject) => {
        try {
            Mam.init(provider);
            await Mam.fetch(root, mode, key, data => {
                const event = JSON.parse(trytesToAscii(data));
                reportEvent(event);
            });
            return resolve(onFetchComplete());
        } catch (error) {
            console.log('MAM fetch error', error);
            return reject();
        }
    });

    return promise;
};

export const generateSeed = () => {
    if (window.crypto && window.crypto.getRandomValues) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
        let result = '';
        let values = new Uint32Array(81);
        window.crypto.getRandomValues(values);
        values.forEach(value => (result += charset[value % charset.length]));
        return result;
    } else throw new Error('Your browser is outdated and cant generate secure random numbers');
};