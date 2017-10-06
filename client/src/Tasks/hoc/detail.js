import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Detail from '../components/detail'
import { saveTask, getTask, markViewed } from '../actions'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'

const mapStateToProps = (store) => {  
   
    const statuses = [
        {id: 'pendiente', value: 'pendiente', label: 'Pendiente'},
        {id: 'realizada', value: 'realizada', label: 'Realizada'},
        {id: 'finalizada', value: 'finalizada', label: 'Finalizada'}
    ]

    return {
        data: store.tasks.selected,
        current_user: store.session.profile,
        statuses,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTask: (id) => { return dispatch(getTask(id)); },
        markViewed: (id) => { return dispatch(markViewed(id)); },
        onSaveTask: (data) => { return dispatch(saveTask(data)) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(Detail))