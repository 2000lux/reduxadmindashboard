import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
export const COUNTRY_LIST_SUCCESS = 'COUNTRY_LIST_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchCountryList() {

    // fetch data from DB
    return (dispatch) => { 
      
        return axios.get('/countries').then(response => { 
            dispatch(countryListSuccess(response.data.data));
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function countryListSuccess(list) {
    return {
        type: 'COUNTRY_LIST_SUCCESS',
        payload: {
            list
        }
    }
}

export function fetchProvinceList(country_id) {

    // fetch data from DB
    return (dispatch) => { 
      
        return axios.get('/countries/'+country_id+'/provinces').then(response => { 
            dispatch(provinceListSuccess(response.data.data));
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function provinceListSuccess(list) {
    return {
        type: 'PROVINCE_LIST_SUCCESS',
        payload: {
            list
        }
    }
}



