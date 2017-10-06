import axios from 'axios'
import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const UPDATE_QUOTATION = 'UPDATE_QUOTATION'
export const ADD_PRODUCT_TO_QUOTATION = 'ADD_PRODUCT_TO_QUOTATION'
export const UPDATE_QUOTATION_PRODUCT = 'UPDATE_QUOTATION_PRODUCT'
export const REMOVE_PRODUCT_FROM_QUOTATION = 'REMOVE_PRODUCT_FROM_QUOTATION'
export const SHIPMENT_TYPE_LIST_SUCCESS = 'SHIPMENT_TYPE_LIST_SUCCESS'
export const QUOTATION_IMPORT_EXPENDITURE_CALCULATION_SUCCESS = 'QUOTATION_IMPORT_EXPENDITURE_CALCULATION_SUCCESS'
export const QUOTATION_PRODUCTS_GROUP_SELECTED = 'QUOTATION_PRODUCTS_GROUP_SELECTED'
export const QUOTATION_GROUP_CREATED = 'QUOTATION_GROUP_CREATED'
export const REMOVE_QUOTATION_GROUP = 'REMOVE_QUOTATION_GROUP'
export const QUOTATION_MODELS_LIST_SUCCESS = 'QUOTATION_MODELS_LIST_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------

export function selectQuotationProductsGroup(data) {
    return {
        type: 'QUOTATION_PRODUCTS_GROUP_SELECTED',
        payload: {
            data
        }
    }
}

export function updateQuotation(data) {
 
    return {
        type: 'UPDATE_QUOTATION',
        payload: {
            data
        }
    }
}

export function addProduct(product) {
 
    product.id = product.product.id;

    return {
        type: 'ADD_PRODUCT_TO_QUOTATION',
        payload: {
            data: product
        }
    }
}

export function saveProduct(product) {
 
    return {
        type: 'UPDATE_QUOTATION_PRODUCT',
        payload: {
            data: product
        }
    }
}

export function removeProduct(id) {

    return (dispatch) => { 
        return new Promise( resolve => {
            dispatch({
                type: 'REMOVE_PRODUCT_FROM_QUOTATION',
                payload: {
                    id
                }
            });
            resolve();
        });
    }
}

export function calculateImportExpenditure(data) {
  
    return (dispatch, getState) => {
      
        const params = _.pickBy({
            shipment_type: data.shipment_type.value,
            fob_price: data.fob_price,
            volume: data.volume,
            weight: data.weight,
            containers_quantity: data.containers_quantity,
            size: data.size,
            client_transport: data.client_transport
        }, _.identity);

        return axios.post('sales/quotation/calculate-import-expenditure', params).then(response => {
            
            const updated_data = {
                ...data,                
                import_expenditure: response.data.import_expenditure,
                filename: response.data.filename,
                download_link: response.data.download_link
            }
            dispatch({
                type: 'QUOTATION_IMPORT_EXPENDITURE_CALCULATION_SUCCESS',
                payload: {
                    data: updated_data
                }
            });
        });
    }
}

export function createQuotationGroup(data) {
    return (dispatch) => {

        const params = {
            ...data,
            shipment_type_id: data.shipment_type.id,
            currency_id: data.currency.id
        }

        return axios.post('sales/quotation/create-group', params).then(response => {
          
            data.id = response.data.id;
         
            // update data with quotation group id
            dispatch({
                type: 'QUOTATION_GROUP_CREATED',
                payload: {
                    data
                }
            })  

            // update products (relate them to quotation group)
            data.products.forEach(function(p) {
               
                dispatch({
                    type: 'UPDATE_QUOTATION_PRODUCT',
                    payload: {
                        data: {
                            id: p.id,
                            quotation_group_id: data.id
                        }
                    }
                })  
            });           
        });
    }
}

export function saveQuotationGroup(id) {
    console.log("TODO");
}

export function removeQuotationGroup(id) {
       
    return (dispatch, getState) => { 
        return axios.delete('sales/quotation/'+id).then(response => {

            dispatch({
                type: 'REMOVE_QUOTATION_GROUP',
                payload: {
                    id
                }
            });

            // set products as orphans (not associated to quotation groups)
            getState().sales.selected.quotation.products
                .filter(x=>x.quotation_group_id === id)
                .forEach(function(p) {
                  
                    dispatch({
                        type: 'UPDATE_QUOTATION_PRODUCT',
                        payload: {
                            data: {
                                id: p.id,
                                quotation_group_id: null
                            }
                        }
                    })  
                });
        });
    }
}

export function fetchShipmentTypesList() {

    // fetch data from DB
    return (dispatch, getState) => { 
     
        if (shouldFetchShipmentTypes(getState())) {
            // Dispatch a thunk from thunk!
            return axios.get('/sales/shipment-types').then(response => { 
                dispatch(shipmentTypeListSuccess(response.data));
            });
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve();
        }
    }
}

export function fetchQuotationModels() {

    // fetch data from DB
    return (dispatch, getState) => { 
        
        if (shouldFetchQuotationModels(getState())) {
            // Dispatch a thunk from thunk!
            return axios.get('/sales/quotation/models').then(response => { 
                dispatch({
                    type: 'QUOTATION_MODELS_LIST_SUCCESS',
                    payload: {
                        list: response.data
                    }
                });
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
function shouldFetchShipmentTypes(state) {
    const shipments = state.sales.selected.quotation.shipment_types
    return (_.isEmpty(shipments)) ? true : false;
}

export function shipmentTypeListSuccess(list) {
    return {
        type: 'SHIPMENT_TYPE_LIST_SUCCESS',
        payload: {
            list
        }
    }
}

function shouldFetchQuotationModels(state) {
    const models = state.sales.selected.quotation.quotation_models
    return (_.isEmpty(models)) ? true : false;
}