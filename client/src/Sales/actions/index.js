import axios from 'axios'
import { formatDateForStorage } from '../../Commons/utils/dates'

// ------------------------------------
// Constants
// ------------------------------------
export const SALE_LIST_SUCCESS = 'SALE_LIST_SUCCESS'
export const SALE_SELECTED = 'SALE_SELECTED'
export const SALE_UNSELECTED = 'SALE_UNSELECTED'
export const ADD_SALE = 'ADD_SALE'
export const SAVE_SALE = 'SAVE_SALE'
export const SALE_STATUSES_LIST_SUCCESS = 'SALE_STATUSES_LIST_SUCCESS'
export const CONTACT_MEANS_LIST_SUCCESS = 'CONTACT_MEANS_LIST_SUCCESS'
export const REMOVE_SALE = 'REMOVE_SALE'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchSalesList(filters) {

    // fetch data from DB
    return (dispatch) => { 

        return axios.get('/sales', {
            params: filters
        }).then(response => { 
            dispatch(saleListSuccess(response.data.data));
        });
    }
}

export function saleListSuccess(list) {
    return {
        type: 'SALE_LIST_SUCCESS',
        payload: {
            list
        }
    }
}

export function getSale(sale_id) {

    // fetch data from DB
    return (dispatch) => { 
      
        return axios.get('/sales/'+sale_id).then(response => { 
            dispatch(saleSelected(response.data.data));
        });
    }
}

export function saleSelected(data) {
    return {
        type: 'SALE_SELECTED',
        payload: {
            data
        }
    }
}

export function saleUnselected() {
    return {
        type: 'SALE_UNSELECTED'
    }
}

export function addSale(data) {
    // persist data in DB
    return (dispatch, getState) => { 
   
        const params = {
            date: data.date,
            contact_mean: data.contact_mean.value,
            sale_status_id: data.status.id,
            enterprise_id: data.enterprise.id,
            contact_id: data.contact.id,
            observations: data.observations,
            quotation: data.quotation
        }

        return axios.post('/sales', params).then(response => { 
            
            // set id
            data.id = response.data.sale_id;
            data.status = data.status.value; // no obj format

            dispatch({
                type: 'ADD_SALE',
                payload: {
                    data
                }
            });
        })
    }   
}

export function saveSale(data) {
     // persist data in DB
    return (dispatch, getState) => { 

        const params = {
            date: data.date,
            contact_mean: data.contact_mean.value,
            sale_status_id: data.status.id,
            enterprise_id: data.enterprise.id,
            contact_id: data.contact.id,
            observations: data.observations,
            quotation: data.quotation
        }
       
        return axios.put('/sales/'+data.id, params).then(response => { 

            data.status = data.status.value; // no obj format

            dispatch({
                type: 'SAVE_SALE',
                payload: {
                    data
                }
            });
        })
    }
}

export function fetchStatuses() {
    return (dispatch) => { 

        return axios.get('/sales/statuses').then(response => { 

            dispatch({
                type: 'SALE_STATUSES_LIST_SUCCESS',
                payload: {
                    data: response.data
                }
            });
        })
    }
}

export function fetchContactMeans() {
    return (dispatch) => { 

        return axios.get('/sales/contact-means').then(response => { 

            dispatch({
                type: 'CONTACT_MEANS_LIST_SUCCESS',
                payload: {
                    data: response.data
                }
            });
        })
    }
}

export function removeSale(sale_id) {
    // remove data from DB
    return (dispatch) => { 

        return axios.delete('/sales/'+sale_id).then(response => { 
            dispatch({
                type: 'REMOVE_SALE',
                payload: {
                    id: sale_id
                }
            });
        })
    }
}



