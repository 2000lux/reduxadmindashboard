const skel = {
    list: [],
    groups: []
}

function families (state = skel, action) {

    switch (action.type) {  
        case 'FAMILY_LIST_SUCCESS':   
            return Object.assign({}, state, {
                list: action.payload.list
            });  
        case 'GROUP_LIST_SUCCESS':   
            return Object.assign({}, state, {
                groups: action.payload.list
            }); 
        default:
            return state
    }
}

export default families 
