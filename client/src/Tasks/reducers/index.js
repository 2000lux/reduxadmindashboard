const skel = {
    created: [],
    assigned: [],
    selected: {}
}

function tasks (state = skel, action) {
    switch (action.type) {
        case 'TASK_LIST_SUCCESS':

            return Object.assign({}, state, {
                created: action.payload.list.created,
                assigned: action.payload.list.assigned
            });
        case 'TASK_SELECTED':
            return Object.assign({}, state, {
                selected: action.payload.data
            });
        case 'TASK_UNSELECTED':
            return Object.assign({}, state, {
                selected: undefined
            });
        case 'ADD_TASK':
            return Object.assign({}, state, {
                created: state.created.concat([action.payload.data])
            });
        case 'TASK_VIEWED':
        case 'TASK_STATUS_UPDATED':

            // replace item ONLY in "assigned by me" list
            const updated_list = state.assigned.map(item => {

                if(item.id === action.payload.data.id){
                    return { ...item, ...action.payload.data }
                }
                return item
            })

            return Object.assign({}, state, {
                assigned: updated_list
            });
        case 'SAVE_TASK':
            // replace item ONLY in "created by me" list
            const updatedList = state.created.map(item => {

                if(item.id === action.payload.data.id){
                    return { ...item, ...action.payload.data }
                }
                return item
            })

            return Object.assign({}, state, {
                created: updatedList
            });
        case 'REMOVE_TASK':
            return Object.assign({}, state, {
                created: state.created.filter( (task) => { return task.id !== action.payload.id } ),
                assigned: state.assigned.filter( (task) => { return task.id !== action.payload.id } )
            });
        case 'ADD_COMMENT':
            const {comment} = action
            const {selected} = state
            const comments = [comment].concat(selected.comments)
            const new_selected = {...selected, comments}
            return {...state, ...{selected: new_selected}}
        default:
            return state
    }
}

export default tasks
