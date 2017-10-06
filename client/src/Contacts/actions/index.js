import axios from 'axios'
import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const CONTACT_LIST_SUCCESS = 'CONTACT_LIST_SUCCESS'
export const CONTACT_SELECTED = 'CONTACT_SELECTED'
export const CONTACT_UNSELECTED = 'CONTACT_UNSELECTED'
export const ADD_CONTACT = 'ADD_CONTACT'
export const SAVE_CONTACT = 'SAVE_CONTACT'
export const REMOVE_CONTACT = 'REMOVE_CONTACT'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchContactsList(filters) {

    // fetch data from DB
    return (dispatch) => { 
  
        return axios.get('/enterprises/contacts', {
            params: filters
        }).then(response => { 
            dispatch(contactListSuccess(response.data.data));
        });
    }
}

export function fetchEnterpriseContactList(enterprise_id) {

    // fetch data from DB
    return (dispatch) => { 
  
        return axios.get('/enterprises/'+enterprise_id+'/contacts').then(response => { 
            dispatch(contactListSuccess(response.data.data));
        });
    }
}

export function getEnterpriseContact(enterprise_id, contact_id) {

    // fetch data from DB
    return (dispatch) => { 
      
        return axios.get('/enterprises/'+enterprise_id+'/contacts/'+contact_id).then(response => { 
            dispatch(contactSelected(response.data));
        });
    }
}

export function fetchContactStates() {

    // fetch data from DB
    return (dispatch, getState) => { 
      
        const shouldFetchList = (_.isEmpty(getState().contacts.states)) ? true : false;

        if(shouldFetchList) {

            return axios.get('/contacts/states').then(response => { 
                dispatch({
                    type: 'CONTACT_STATES_LIST_SUCCESS',
                    payload: {
                        list: response.data
                    }
                });
            });
        } else {
            return Promise.resolve();
        }
    }
}

export function contactListSuccess(list) {
    return {
        type: 'CONTACT_LIST_SUCCESS',
        payload: {
            list
        }
    }
}

export function contactSelected(data) {
    return {
        type: 'CONTACT_SELECTED',
        payload: {
            data
        }
    }
}

export function contactUnselected() {
    return {
        type: 'CONTACT_UNSELECTED'
    }
}

export function addContact(enterprise_id, raw_data) {

    // persist data in DB
    return (dispatch, getState) => { 
       
        const data = {
            ...raw_data,
            enterprise: enterprise_id,
            sector: raw_data.sector.id,
            contact_state: raw_data.contact_state.id,
            emails: raw_data.emails.filter(x=>{ return (x.id || x.email) })
        };  

        const endpoint = '/enterprises/' + enterprise_id + '/contacts';

        return axios.post(endpoint, data).then(response => { 

            // set id
            data.id = response.data.contact_id;

            // set contact state as object
            data.state = _.find(getState().contacts.states, {id:data.contact_state}); 

            dispatch({
                type: 'ADD_CONTACT',
                payload: {
                    data
                }
            });
        })
    }
}

export function saveContact(enterprise_id, contact_id, raw_data) {

    // persist data in DB
    return (dispatch, getState) => { 
       
        const data = {
            ...raw_data,
            enterprise: enterprise_id,
            sector: raw_data.sector.id,
            contact_state: raw_data.contact_state.id,
            emails: raw_data.emails.filter(x=>{ return (x.id || x.email) })
        };  
       
        const endpoint = '/enterprises/' + enterprise_id + '/contacts/' + contact_id;

        return axios.put(endpoint, data)
        .then(response => { 

            // set contact state as object
            data.state = _.find(getState().contacts.states, {id:data.contact_state}); 
           
            dispatch({
                type: 'SAVE_CONTACT',
                payload: {
                    data
                }
            });
        })
    }
}

export function updateContactState(enterprise_id, data) {

    // persist data in DB
    return (dispatch) => { 

        const { contact_id, state } = data;

        const endpoint = '/enterprises/' + enterprise_id + '/contacts/' + contact_id + '/state';
       
        return axios.put(endpoint, data)
        .then(response => { 

            dispatch({
                type: 'SAVE_CONTACT',
                payload: {
                    data: {
                        id: contact_id,
                        enterprise_id,
                        state
                    }
                }
            });
        })
    }
}

export function replaceContact(data) {

    const { enterprise_id, replaced, replacement } = data;

    // persist data in DB
    return (dispatch) => { 

        const endpoint = '/enterprises/' + enterprise_id + '/contacts/' + replaced.contact_id + '/replace-with/' + replacement.contact_id;
       
        return axios.put(endpoint)
            .then(response => { 

                // update store
                // mark this contact as "active"
                dispatch({
                    type: 'SAVE_CONTACT',
                    payload: {
                        data: {
                            id: replacement.contact_id,
                            enterprise_id,
                            state: replacement.state
                        }
                    }
                });

                 // mark this contact as "replaced"
                dispatch({
                    type: 'SAVE_CONTACT',
                    payload: {
                        data: {
                            id: replaced.contact_id,
                            enterprise_id,
                            state: replaced.state
                        }
                    }
                });
            })
    }
}

export function transferContact(data) {
    const {contact_id, origin, target, state } = data;

    // persist data in DB
    return (dispatch) => { 

        const endpoint = '/enterprises/' + origin + '/contacts/' + contact_id + '/transfer-to/' + target;
       
        return axios.put(endpoint)
            .then(response => { 

                // mark this contact as "transfered"
                dispatch({
                    type: 'SAVE_CONTACT',
                    payload: {
                        data: {
                            id: contact_id,
                            enterprise_id: origin,
                            state: state
                        }
                    }
                });
            })
    }
}

export function removeContact(id) {

    // remove data from DB
    return (dispatch) => { 

        return axios.delete('/contacts/' + id).then(response => { 
            dispatch({
                type: 'REMOVE_CONTACT',
                payload: {
                    id
                }
            });
        })
    }
}



