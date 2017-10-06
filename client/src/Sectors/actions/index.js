import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
export const SECTOR_LIST_SUCCESS = 'SECTOR_LIST_SUCCESS'
export const ADD_SECTOR = 'ADD_SECTOR'
export const SAVE_SECTOR = 'SAVE_SECTOR'
export const REMOVE_SECTOR = 'REMOVE_SECTOR'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchSectorList(enterprise_id = null) {

    // empty sector list
    if(!enterprise_id || isNaN(enterprise_id)) { 
        return (dispatch) => {
            dispatch(sectorListSuccess([]));
            return Promise.resolve();
        }
    }

    // fetch data from DB
    return (dispatch) => { 
      
        return axios.get('/enterprises/'+enterprise_id+'/sectors').then(response => { 
            dispatch(sectorListSuccess(response.data));
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function sectorListSuccess(list) {
    return {
        type: 'SECTOR_LIST_SUCCESS',
        payload: {
            list
        }
    }
}

export function addSector(enterprise_id, data) {
    // persist data in DB
    return (dispatch) => { 

        return axios.post('/enterprises/'+enterprise_id+'/sectors', data).then(response => { 
            
            // set id
            data.id = response.data.sector_id;
            
            dispatch({
                type: 'ADD_SECTOR',
                payload: {
                    data
                }
            });
        })
    }
}

export function saveSector(enterprise_id, data) {
       
    // persist data in DB
    return (dispatch) => { 

        return axios.put('/enterprises/'+enterprise_id+'/sectors/'+data.id, data).then(response => { 
            dispatch({
                type: 'SAVE_SECTOR',
                payload: {
                    data
                }
            });
        })
    }
}

export function removeSector(enterprise_id, sector_id) {

    // remove data from DB
    return (dispatch) => { 

        return axios.delete('/enterprises/'+enterprise_id+'/sectors/'+sector_id).then(response => { 
            dispatch({
                type: 'REMOVE_SECTOR',
                payload: {
                    id: sector_id
                }
            });
        })
    }
}



