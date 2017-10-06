import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
export const INTERACTION_LIST_SUCCESS = 'INTERACTION_LIST_SUCCESS'
export const INTERACTION_SELECTED = 'INTERACTION_SELECTED'
export const INTERACTION_UNSELECTED = 'INTERACTION_UNSELECTED'
export const ADD_INTERACTION = 'ADD_INTERACTION'
export const SAVE_INTERACTION = 'SAVE_INTERACTION'
export const REMOVE_INTERACTION = 'REMOVE_INTERACTION'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchContactInteractionList(contact_id) {

    // fetch data from DB
    return (dispatch) => {

        return axios.get('/contacts/'+contact_id+'/interactions').then(response => {
            dispatch(interactionListSuccess(response.data.data));
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function fetchEnterpriseInteractionList(enterprise_id, contact_id = null) {

    // fetch data by contact_id
    if(contact_id) {
        return fetchContactInteractionList(contact_id);
    }

    // fetch data by enterprise_id
    return (dispatch) => {

        return axios.get('/enterprises/'+enterprise_id+'/interactions').then(response => {
            dispatch(interactionListSuccess(response.data.data));
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function interactionListSuccess(list) {
    return {
        type: 'INTERACTION_LIST_SUCCESS',
        payload: {
            list
        }
    }
}

export function getInteraction(enterprise_id, interaction_id) {

    // fetch data from DB
    return (dispatch) => {

        return axios.get('/enterprises/'+enterprise_id+'/interactions/'+interaction_id).then(response => {
            dispatch(interactionSelected(response.data.data));
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function interactionSelected(data) {
    return {
        type: 'INTERACTION_SELECTED',
        payload: {
            data
        }
    }
}

export function interactionUnselected() {
    return {
        type: 'INTERACTION_UNSELECTED'
    }
}

export function addInteraction(contact_id, data) {
    // persist data in DB
    return (dispatch) => {

        return axios.post('/contacts/'+contact_id+'/interactions', data).then(response => {

            // set id
            data.id = response.data.interaction_id;

            dispatch({
                type: 'ADD_INTERACTION',
                payload: {
                    data
                }
            });
        })
    }
}

export function saveInteraction(contact_id, data) {
     // persist data in DB
    return (dispatch) => {

        return axios.put('/contacts/'+contact_id+'/interactions/'+data.id, data).then(response => {
            dispatch({
                type: 'SAVE_INTERACTION',
                payload: {
                    data
                }
            });
        })
    }
}

export function removeInteraction(contact_id, interaction_id) {
    // remove data from DB
    return (dispatch) => {
        let URL = `/contacts/${contact_id}/interactions/${interaction_id}`
        return axios.delete(URL).then(response => {
            dispatch({
                type: 'REMOVE_INTERACTION',
                payload: {
                    id: interaction_id
                }
            });
        })
    }
}
