
function products (state = {}, action) {

    switch (action.type) {  
        case 'PRODUCT_LIST_SUCCESS':   
            return Object.assign({}, {
                list: action.payload.list
            });  
        case 'PRODUCT_SELECTED':
            return Object.assign({}, state, {
                selected: action.payload.data
            }); 
        case 'PRODUCT_UNSELECTED':
            return Object.assign({}, state, {
                selected: {}
            }); 
        case 'ADD_PRODUCT':

            /* In case user reload form page and there's no cache for the list to insert this item */
            if(typeof state.list === 'undefined') 
                return state;

            return Object.assign({}, state, {
                list: state.list.concat([action.payload.data])
            });
        case 'SAVE_PRODUCT':

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
        case 'REMOVE_PRODUCT':
            return Object.assign({}, state, {
                list: state.list.filter( (item) => { return item.id !== action.payload.id } )
            }); 
        default:
            return state
    }
}

export default products 