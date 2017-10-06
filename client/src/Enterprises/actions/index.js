import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
export const ENTERPRISE_LIST_SUCCESS = 'ENTERPRISE_LIST_SUCCESS'
export const ENTERPRISE_SELECTED = 'ENTERPRISE_SELECTED'
export const ENTERPRISE_UNSELECTED = 'ENTERPRISE_UNSELECTED'
export const ADD_ENTERPRISE = 'ADD_ENTERPRISE'
export const SAVE_ENTERPRISE = 'SAVE_ENTERPRISE'
export const REMOVE_ENTERPRISE = 'REMOVE_ENTERPRISE'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchEnterpriseList(filters) {

    // fetch data from DB
    return (dispatch) => { 
  
        return axios.get('/enterprises', {
            params: filters
        }).then(response => { 
            dispatch(enterpriseListSuccess(response.data.data));
        });
    }
}

export function getEnterprise(id) {

    // fetch data from DB
    return (dispatch) => { 
      
        return axios.get('/enterprises/'+id).then(response => { 
            dispatch(enterpriseSelected(response.data.data));
        });
    }
}

export function enterpriseListSuccess(list) {
    return {
        type: 'ENTERPRISE_LIST_SUCCESS',
        payload: {
            list
        }
    }
}

export function enterpriseSelected(data) {
    return {
        type: 'ENTERPRISE_SELECTED',
        payload: {
            data
        }
    }
}

export function enterpriseUnselected() {
    return {
        type: 'ENTERPRISE_UNSELECTED'
    }
}

export function addEnterprise(data) {

    // persist data in DB
    return (dispatch) => { 

        return axios.post('/enterprises', data).then(response => { 

            // set id
            data.id = response.data.enterprise_id;

            dispatch({
                type: 'ADD_ENTERPRISE',
                payload: {
                    data
                }
            });
        })
    }
}

export function saveEnterprise(data) {

    // persist data in DB
    return (dispatch) => { 

        return axios.put('/enterprises/' + data.id, data).then(response => { 
            dispatch({
                type: 'SAVE_ENTERPRISE',
                payload: {
                    data
                }
            });
        })
    }
}

export function removeEnterprise(id) {

    // remove data from DB
    return (dispatch) => { 

        return axios.delete('/enterprises/' + id).then(response => { 
            dispatch({
                type: 'REMOVE_ENTERPRISE',
                payload: {
                    id
                }
            });
        })
    }
}



