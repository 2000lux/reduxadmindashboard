import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Form from '../components/form'
import { addTask, saveTask, getTask, taskUnselected } from '../actions'
import { fetchUserList } from '../../Users/actions'
import { fetchEnterpriseList } from '../../Enterprises/actions'
import { fetchContactsList } from '../../Contacts/actions'
import { fetchSectorList } from '../../Sectors/actions'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'
import { mapForDropdownList } from '../../Commons/utils/dropdownlists'

const mapStateToProps = (store) => {  
   
    let users = store.users.list || [];
    if (users.length > 0) {
        users = mapForDropdownList(users, {label: "fullname"});
    }  

    let enterprises = store.enterprises.list || [];
    if (enterprises.length > 0) {
        enterprises = mapForDropdownList(enterprises, {label:'legal_name'});
    }  

    let sectors = store.sectors.list || [];
    if (sectors.length > 0) {
        sectors = mapForDropdownList(sectors);
    }

    let contacts = store.contacts.list;
    if (contacts.length > 0) {
        contacts = mapForDropdownList(contacts, {label: 'fullname'});
    }  

    const statuses = [
        {id: 'pendiente', value: 'pendiente', label: 'Pendiente'},
        {id: 'realizada', value: 'realizada', label: 'Realizada'},
        {id: 'finalizada', value: 'finalizada', label: 'Finalizada'}
    ]

    return {
        data: store.tasks.selected,
        enterprises,
        sectors,
        users,
        contacts,
        statuses,
        current_user: store.session.profile
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTask: (id) => { return dispatch(getTask(id)); },
        getUsersList: () => { return dispatch(fetchUserList()); },
        getEnterprises: (filters) => { return dispatch(fetchEnterpriseList(filters)); },
        getSectors: (enterprise_id) => { return dispatch(fetchSectorList(enterprise_id)); },
        getContacts: (filters) => { return dispatch(fetchContactsList(filters)) },
        unselectTask: () => { dispatch(taskUnselected()) },
        onAddTask: (data) => { return dispatch(addTask(data)) },
        onSaveTask: (data) => { return dispatch(saveTask(data)) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(Form))