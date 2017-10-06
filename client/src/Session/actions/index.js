import axios from 'axios'
import queryString from 'query-string';
import config from '../../config/axios' 
import swal from 'sweetalert2'

// ------------------------------------
// Constants
// ------------------------------------
export const USER_LOGGED_IN = 'USER_LOGGED_IN'
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT'

// ------------------------------------
// Actions
// ------------------------------------
export function login(data) {

    // fetch data from DB
    return (dispatch) => { 
   
        return getToken(data).then( (tokens) => {

            return axios({
                method: 'get',
                url: '/users/me',
                headers: {
                    'Authorization': 'Bearer ' + tokens.data.access_token
                }
            }).then(user => { 
                const session = Object.assign(tokens.data, { 
                    rememberMe: data.rememberMe,
                    profile: user.data.data
                 });
                dispatch(userLoggedIn(session));
            }).catch(function (err) {
                console.log(err);
            });
        });
    }
}

function getToken(data) {

    const params = queryString.stringify({
        'username': data.username,
        'password': data.password
    });
    
    return axios({
        baseURL: (window.location.hostname === 'localhost') ? 'http://localhost:8002/api' : '/api',
        method: 'post',
        url: '/authenticate',
        data: params
    }).then(response => { 

        return response;
    }).catch(function (err) {
        console.log(err);
        return err;
    });
}

function refreshToken(profile, refresh_token) {

    const params = queryString.stringify({
        'refresh_token': refresh_token
    });

    return axios({
        baseURL: (window.location.hostname === 'localhost') ? 'http://localhost:8002/api' : '/api',
        method: 'post',
        url: '/refresh-token',
        data: params
    }).then(response => { 
        return response;
    }).catch(function (err) {
        return err;
    });
}

export function sessionEnded(session) {
   
    if(session.rememberMe) {
      
       refreshToken(session.profile, session.refresh_token)
        .then( response => {
          
            const session = Object.assign(tokens.data, { 
                    expires_in: response.expires_in,
                    access_token: response.access_token,
                    refresh_token: response.refresh_token,
                });
            dispatch(userLoggedIn(session));
        }).catch(function (err) {
            
            showSessionEndedPrompt()
        });
    
    } else {
        showSessionEndedPrompt()
    }    
}

function showSessionEndedPrompt() {

    swal({
            title: "Sesión vencida",
            text: "Por favor vuelva a ingresar al sistema", 
            type: "warning",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ok",
        }).then(function(){ 
            // will empty localstorage and redirect to login
            window.location.href = '/logout'
        });
}

export const userLoggedIn = (data) => {

    return {
        type: "USER_LOGGED_IN",
        payload: {
            data
        } 
    }
}

export function logout() {

    return {
        type: "USER_LOGGED_OUT"
    }
}