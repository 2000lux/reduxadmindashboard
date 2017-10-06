import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
export const TASK_LIST_SUCCESS = 'TASK_LIST_SUCCESS'
export const TASK_SELECTED = 'TASK_SELECTED'
export const TASK_UNSELECTED = 'TASK_UNSELECTED'
export const ADD_TASK = 'ADD_TASK'
export const SAVE_TASK = 'SAVE_TASK'
export const TASK_VIEWED = 'TASK_VIEWED'
export const TASK_STATUS_UPDATED = 'TASK_STATUS_UPDATED'
export const REMOVE_TASK = 'REMOVE_TASK'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchTasksList(user_id, filters) {

    // fetch data from DB
    return (dispatch) => { 
      
        return axios.get('/users/'+user_id+'/tasks', {
            params: filters
        }).then(response => { 
            dispatch(taskListSuccess(response.data));
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function taskListSuccess(list) {
    return {
        type: 'TASK_LIST_SUCCESS',
        payload: {
            list
        }
    }
}

export function getTask(task_id) {

    // fetch data from DB
    return (dispatch) => { 
      
        return axios.get('/tasks/'+task_id).then(response => { 
            dispatch(taskSelected(response.data.data));
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function taskSelected(data) {
    return {
        type: 'TASK_SELECTED',
        payload: {
            data
        }
    }
}

export function taskUnselected() {
    return {
        type: 'TASK_UNSELECTED'
    }
}

export function addTask(data) {
    // persist data in DB
    return (dispatch) => { 
       
        const params = {
            receiver_id: data.receiver.id,
            enterprise_id: data.enterprise.id,
            sector_id: data.sector.id,
            contact_id: data.contact.id,
            priority: data.priority,
            status: data.status.id,
            description: data.description
        }

        return axios.post('/tasks', params).then(response => { 
            
            // set id
            data.id = response.data.task_id;
            data.status = data.status.value; // no obj format

            dispatch({
                type: 'ADD_TASK',
                payload: {
                    data
                }
            });
        })
    }   
}

export function saveTask(data) {
     // persist data in DB
    return (dispatch) => { 

        const params = {
            receiver_id: data.receiver.id,
            enterprise_id: data.enterprise.id,
            sector_id: data.sector.id,
            contact_id: data.contact.id,
            priority: data.priority,
            status: data.status.value,
            description: data.description
        }

        return axios.put('/tasks/'+data.id, params).then(response => { 

            data.status = data.status.value; // no obj format

            dispatch({
                type: 'SAVE_TASK',
                payload: {
                    data
                }
            });
        })
    }
}

export function updateStatus(data) {
    return (dispatch) => { 

        return axios.put('/tasks/'+data.id, data).then(response => { 

            dispatch({
                type: 'TASK_STATUS_UPDATED',
                payload: {
                    data
                }
            });
        })
    }
}

export function markViewed(task_id) {
    
    return (dispatch) => { 

        return axios.put('/tasks/'+task_id+'/viewed').then(response => { 
            dispatch({
                type: 'TASK_VIEWED',
                payload: {
                    data: {
                        id: task_id,
                        viewed: true
                    }
                }
            });
        })
    }
}

export function removeTask(task_id) {
    // remove data from DB
    return (dispatch) => { 

        return axios.delete('/tasks/'+task_id).then(response => { 
            dispatch({
                type: 'REMOVE_TASK',
                payload: {
                    id: task_id
                }
            });
        })
    }
}



