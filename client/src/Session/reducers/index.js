
function session (state = {}, action) {

    switch (action.type) {  
        case 'USER_LOGGED_IN':   
            return Object.assign({}, state, action.payload.data);                    
        case 'USER_LOGGED_OUT':   
            return {};                  
        default:
            return state
    }
}

export default session 