import axios from 'axios'
import store from './store'
import { setLoading } from '../Commons/utils'
import { sessionEnded } from '../Session/actions'
import swal from 'sweetalert2'

/******************
 * Axios Defaults *
 ******************/
axios.defaults.baseURL = (window.location.hostname === 'localhost') ? 'http://localhost:8002/api/v1' : '/api/v1';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
axios.defaults.headers.common = {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
};

/**********************
 * Axios Interceptors *
 **********************/

// Add a request interceptor
axios.interceptors.request.use(function (config) {

    setLoading(true);

    // Do something with request data
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {

    setLoading(false);

    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

// try to handle CORS and some other issues  
axios.interceptors.response.use((response) => response, (error) => {
   
    setLoading(false);

    if (typeof error.response === 'undefined') {

        /*  A network error occurred. 
            This could be a CORS issue or a dropped internet connection. 
            It is not possible for us to know.*/
        console.log('CORS issue?');
        swal({
            title: "Error inesperado", 
            text: "Hubo un error inesperado. Revise su conexión e intentelo de nuevo, o contacte al administrador", 
            type: "error",
            timer: 3000
        }).then(
        function () {},
        function (dismiss) {
        // handling the promise rejection
        }); 
    }
    else if( error.response.status === 401 ) {
        
        sessionEnded(store.getState().session);        
    }
    else if (error.response.status === 500) {

        console.log('Error 500');
        swal({
            title: "Error del servidor", 
            text: "Hubo un error en el servidor, si el problema persiste por favor contacte al administrador", 
            type: "error",
            timer: 3000
        });
    }
    
    return Promise.reject(error)
})

