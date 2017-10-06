let skel = {
    list: [],
    selected: {
        emails: [
            {},
            {},
            {}
        ]
    }
}

function contacts (state = skel, action) {

    switch (action.type) {  
        case 'CONTACT_STATES_LIST_SUCCESS':  
            return Object.assign({}, state, {
                states: action.payload.list
            });  
        case 'CONTACT_LIST_SUCCESS':   
            return Object.assign({}, state, {
                list: action.payload.list
            });  
        case 'CONTACT_SELECTED': 
            return Object.assign({}, state, {
                selected: action.payload.data
            }); 
        case 'CONTACT_UNSELECTED':
            return Object.assign({}, state, {
                selected: undefined
            }); 
        case 'ADD_CONTACT':

            /* In case user reload form page and there's no cache for the list */
            if(typeof state.list === 'undefined') 
                return state;

            return Object.assign({}, state, {
                list: state.list.concat([action.payload.data])
            });
        case 'SAVE_CONTACT':

            /* In case user reload form page and there's no cache for the list */
            if(typeof state.list === 'undefined') 
                return state;

            // replace item in list
            const updatedList = state.list.map(item => {

                const contact_id = action.payload.data.id;
                const enterprise_id = action.payload.data.enterprise_id; // update the contact only in this enterprise 

                if(item.id === contact_id && item.enterprise === enterprise_id){
                    return { ...item, ...action.payload.data }
                }
                return item
            })

            return Object.assign({}, state, {
                list: updatedList
            });
        case 'REMOVE_CONTACT':
            return Object.assign({}, state, {
                list: state.list.filter( (item) => { return item.id !== action.payload.id } )
            });  
        default:
            return state
    }
}

export default contacts 