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