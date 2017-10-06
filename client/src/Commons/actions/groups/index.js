import axios from 'axios'

/** IMPORTANT: store/reducers are shared with families */

// ------------------------------------
// Constants
// ------------------------------------
export const GROUP_LIST_SUCCESS = 'GROUP_LIST_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchGroupList(family_id) {

    // fetch data from DB
    return (dispatch, getState) => { 
        
        return axios.get('/families/'+family_id+'/groups').then(response => { 
            dispatch(groupListSuccess(response.data.data));
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function groupListSuccess(list) {
    return {
        type: 'GROUP_LIST_SUCCESS',
        payload: {
            list
        }
    }
}

