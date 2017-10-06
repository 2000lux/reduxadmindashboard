import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
export const CURRENCY_LIST_SUCCESS = 'CURRENCY_LIST_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchCurrencies() {

    // fetch data from DB
    return (dispatch, getState) => { 
    
        if (shouldFetchCurrencies(getState())) {
            // Dispatch a thunk from thunk!
            return axios.get('/currencies').then(response => { 
                dispatch(currencyListSuccess(response.data));
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve();
        }
    }
}

/**
 * Cache
 */
function shouldFetchCurrencies(state) {
    const currencies = state.currencies;
    return (currencies.length === 0) ? true : false;
}

export function currencyListSuccess(list) {
    return {
        type: 'CURRENCY_LIST_SUCCESS',
        payload: {
            list
        }
    }
}


