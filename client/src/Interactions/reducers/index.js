const skel = {
    list: [],
    selected: {}
}

function interactions (state = skel, action) {

    switch (action.type) {  
        case 'INTERACTION_LIST_SUCCESS':   
            return Object.assign({}, {
                list: action.payload.list
            });  
        case 'INTERACTION_SELECTED':
            return Object.assign({}, state, {
                selected: action.payload.data
            }); 
        case 'INTERACTION_UNSELECTED':
            return Object.assign({}, state, {
                selected: undefined
            });
        case 'ADD_INTERACTION':
            return Object.assign({}, state, {
                list: state.list.concat([action.payload.data])
            });
        case 'SAVE_INTERACTION':
          
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
        case 'REMOVE_INTERACTION':
            return Object.assign({}, state, {
                list: state.list.filter( (interaction) => { return interaction.id !== action.payload.id } )
            });                 
        default:
            return state
    }
}

export default interactions 
