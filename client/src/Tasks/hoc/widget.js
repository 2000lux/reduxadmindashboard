import React, { Component } from 'react'
import { connect } from 'react-redux'
import TasksWidget from '../../Layout/components/Header/tasksWidget'
import { fetchTasksList, taskListSuccess } from '../actions'
import { fetchUserList } from '../../Users/actions'
import { mapForDropdownList } from '../../Commons/utils/dropdownlists'

const mapStateToProps = (store, ownProps) => {  

    return {
        tasks: store.tasks.assigned,
        current_user: store.session.profile || {}
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTasksList: (user_id, filters) => { return dispatch(fetchTasksList(user_id, filters)); }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TasksWidget)

