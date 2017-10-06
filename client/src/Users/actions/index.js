import axios from 'axios'
import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const USER_LIST_SUCCESS = 'USER_LIST_SUCCESS'
export const ADD_USER = 'ADD_USER'
export const SAVE_USER = 'SAVE_USER'
export const REMOVE_USER = 'REMOVE_USER'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchUserList() {

    // fetch data from DB
    return (dispatch) => { 
      
        return axios.get('/users').then(response => { 
            dispatch(userListSuccess(response.data.data));         
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function userListSuccess(data) {
    return {
        type: 'USER_LIST_SUCCESS',
        payload: {
            data
        }
    }
}

export function fetchUserRoles() {

    // fetch data from DB
    return (dispatch, getState) => { 
      
        const shouldFetchList = (_.isEmpty(getState().users.roles)) ? true : false;

        if(shouldFetchList) {

            return axios.get('/users/roles').then(response => { 
                dispatch({
                    type: 'USER_ROLES_LIST_SUCCESS',
                    payload: {
                        list: response.data
                    }
                });
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            return Promise.resolve();
        }
    }
}

export function addUser(data) {
   
    return (dispatch, getState) => {
        
        // server expects an id
        data.role = data.role.id;

        return axios.post('/users', data).then(response => {
        
            data.id = response.user_id; // assign user id

            // this prevent ddl breaks
            data.role = _.find(getState().users.roles, {id: data.role})
          
            dispatch({
                type: 'ADD_USER',
                payload: {
                    data
                }
            });
        })
    }
}

export function saveUser(data) {

    return (dispatch, getState) => {

        // server expects an id
        data.role = data.role.id;
      
        return axios.put('/users/'+data.id, data).then(response => {
            
            // this prevent ddl breaks
            data.role = _.find(getState().users.roles, {id: data.role})

            dispatch({
                type: 'SAVE_USER',
                payload: {
                    data
                }
            });
        })
    }
}

export function removeUser(id) {

    return (dispatch) => {

        return axios.delete('/users/'+id).then(response => {
            dispatch({
                type: 'REMOVE_USER',
                payload: {
                    id
                }
            });
        })
    }  
}



