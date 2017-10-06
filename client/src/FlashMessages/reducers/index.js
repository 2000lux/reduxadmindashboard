import {FLASH_MESSAGE} from '../actions';
import {REMOVE_FLASH_MESSAGE} from '../actions';
import {VIEWED_FLASH_MESSAGE} from '../actions';
import {CLEANUP_FLASH_MESSAGES} from '../actions';

export default (state = [], action) => {
    switch (action.type) {
        case FLASH_MESSAGE:
            return state.concat(action.payload.message);
        case REMOVE_FLASH_MESSAGE:
            return state.filter(item  => { return item.id !== action.payload.id });
        case VIEWED_FLASH_MESSAGE:
            return state.map( item => {
                if(item.id !== action.payload.id) {
                    return state
                }
                return {
                    ...item,
                    viewed: true
                }
            });
        case CLEANUP_FLASH_MESSAGES:
            return state.filter( item => { return item.viewed !== true })
        default:
            return state;
    }
};

/** skel reference:
{
    title: null,
    message: null,
    type: null,
    viewed: false, // will not be render on next page change
    target: null, // string. Used to filter messages and render only the ones with a given target
}
*/