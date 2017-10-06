const skel = {
    list: []
}
function sectors (state = {}, action) {

    switch (action.type) {  
        case 'SECTOR_LIST_SUCCESS':   
            return Object.assign({}, {
                list: action.payload.list
            });     
        case 'ADD_SECTOR':
            return Object.assign({}, state, {
                list: state.list.concat([action.payload.data])
            });
        case 'SAVE_SECTOR':
          
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
        case 'REMOVE_SECTOR':
            return Object.assign({}, state, {
                list: state.list.filter( (sector) => { return sector.id !== action.payload.id } )
            });                 
        default:
            return state
    }
}

export default sectors 
