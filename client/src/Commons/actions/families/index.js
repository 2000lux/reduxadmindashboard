import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
export const FAMILY_LIST_SUCCESS = 'FAMILY_LIST_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchFamilyList() {

    // fetch data from DB
    return (dispatch, getState) => { 
     
        if (shouldFetchFamilies(getState())) {
            // Dispatch a thunk from thunk!
            return axios.get('/families').then(response => { 
                dispatch(familyListSuccess(response.data.data));
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
function shouldFetchFamilies(state) {
    const families = state.families.list
    return (_.isEmpty(families)) ? true : false;
}

export function familyListSuccess(list) {
    return {
        type: 'FAMILY_LIST_SUCCESS',
        payload: {
            list
        }
    }
}


