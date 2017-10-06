function enterprises (state = {}, action) {

    switch (action.type) {  
        case 'ENTERPRISE_LIST_SUCCESS':   
            return Object.assign({}, state, {
                list: action.payload.list
            });  
        case 'ENTERPRISE_SELECTED':
            return Object.assign({}, state, {
                selected: action.payload.data
            }); 
        case 'ENTERPRISE_UNSELECTED':
            return Object.assign({}, state, {
                selected: undefined
            }); 
        case 'ADD_ENTERPRISE':

            /* In case user reload form page and there's no cache for the list to insert this item */
            if(typeof state.list === 'undefined') 
                return state;

            return Object.assign({}, state, {
                list: state.list.concat([action.payload.data])
            });
        case 'SAVE_ENTERPRISE':

            /* In case user reload form page and there's no cache for the list, so it cannot be updated */
            if(typeof state.list === 'undefined') 
                return state;

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
        case 'REMOVE_ENTERPRISE':
            return Object.assign({}, state, {
                list: state.list.filter( (item) => { return item.id !== action.payload.id } )
            });  
        default:
            return state
    }
}

export default enterprises 