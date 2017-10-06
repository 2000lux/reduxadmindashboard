import React, { Component } from 'react'
import { connect } from 'react-redux'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'
import TasksPage from '../components/list'
import { fetchTasksList, taskListSuccess, updateStatus, removeTask } from '../actions'
import { fetchUserList } from '../../Users/actions'
import { mapForDropdownList } from '../../Commons/utils/dropdownlists'

const mapStateToProps = (store, ownProps) => {  

    let users = store.users.list || [];
    if (users.length > 0) {
        users = mapForDropdownList(users, {label: "fullname"});
    }  

    const statuses = [
        {id: 'pendiente', value: 'pendiente', label: 'Pendiente'},
        {id: 'realizada', value: 'realizada', label: 'Realizada'},
        {id: 'finalizada', value: 'finalizada', label: 'Finalizada'}
    ]

    return {
        users,
        tasks: store.tasks,
        statuses,
        current_user: store.session.profile || {}
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTasksList: (user_id, filters) => { return dispatch(fetchTasksList(user_id, filters)); },
        fetchUsersList: () => { return dispatch(fetchUserList()); },
        onUpdateStatus: (data) => { return dispatch(updateStatus(data)) },
        onRemoveTask: (id) => { return dispatch(removeTask(id)) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(TasksPage))

