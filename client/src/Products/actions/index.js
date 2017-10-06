import axios from 'axios'
import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS'
export const PRODUCT_SELECTED = 'PRODUCT_SELECTED'
export const PRODUCT_UNSELECTED = 'PRODUCT_UNSELECTED'
export const ADD_PRODUCT = 'ADD_PRODUCT'
export const SAVE_PRODUCT = 'SAVE_PRODUCT'
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchProductList() {

    // fetch data from DB
    return (dispatch, getState) => { 
      
        if (shouldFetchProducts(getState())) {

            // Dispatch a thunk from thunk!
            return axios.get('/products').then(response => { 
                dispatch(productListSuccess(response.data.data));
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
function shouldFetchProducts(state) {
    const products = state.products.list;    
    return (_.isEmpty(products)) ? true : false;
}

export function getProduct(id) {
   
   // get data from DB
    return (dispatch) => { 

        return axios.get('/products/'+id).then(response => { 
            dispatch(productSelected(response.data.data));
        })
    }
}

export function productListSuccess(list) {
    return {
        type: 'PRODUCT_LIST_SUCCESS',
        payload: {
            list
        }
    }
}

export function productSelected(data) {
    return {
        type: 'PRODUCT_SELECTED',
        payload: {
            data
        }
    }
}

export function productUnselected() {
    return {
        type: 'PRODUCT_UNSELECTED'
    }
}

export function addProduct(data) {

    // persist data in DB
    return (dispatch) => { 

        const params = {
            ...data,
            provider: data.provider.id,
            family: data.family.id,
            group: data.group.id,
            currency: data.currency.id
        }

        return axios.post('/products', params).then(response => { 

            // set id
            data.id = response.data.enterprise_id;

            dispatch({
                type: 'ADD_PRODUCT',
                payload: {
                    data
                }
            });
        })
    }
}

export function saveProduct(data) { 

    // persist data in DB
    return (dispatch) => { 

        const params = {
            ...data,
            provider: data.provider.id,
            family: data.family.id,
            group: data.group.id,
            currency: data.currency.id
        }

        return axios.put('/products/' + data.id, params).then(response => { 
            dispatch({
                type: 'SAVE_PRODUCT',
                payload: {
                    data
                }
            });
        })
    }
}

export function removeProduct(id) {

    // remove data from DB
    return (dispatch) => { 

        return axios.delete('/products/' + id).then(response => { 
            dispatch({
                type: 'REMOVE_PRODUCT',
                payload: {
                    id
                }
            });
        })
    }
}



