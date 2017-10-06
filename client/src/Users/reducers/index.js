const skel = {
    list: [],
    roles: []
}

function users (state = skel, action) {

    switch (action.type) {  
        case 'USER_LIST_SUCCESS':   
            return Object.assign({}, state, {
                list: action.payload.data
            });  
        case 'USER_ROLES_LIST_SUCCESS':   
            return Object.assign({}, state, {
                roles: action.payload.list
            });  
        case 'ADD_USER':
            return Object.assign({}, state, {
                list: state.list.concat([action.payload.data])
            });
        case 'SAVE_USER':
          
            // replace item in list
            const updatedList = state.list.map(item => {

                if(item.id === action.payload.data.id){
                    return { ...item, ...action.payload.data }
                }
                return item
            })
           
            return Object.assign({}, state, {
                list: updatedList
            });
        case 'REMOVE_USER':
            return Object.assign({}, state, {
                list: state.list.filter( (user) => { return user.id !== action.payload.id } )
            });                 
        default:
            return state
    }
}

export default users 