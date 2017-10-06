import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ContactsForm from '../components/form'
import { addContact, saveContact, getEnterpriseContact, contactUnselected, fetchContactStates } from '../actions'
import { fetchEnterpriseList } from 'Enterprises/actions'
import { fetchSectorList } from 'Sectors/actions'
import withFlashMessages from 'FlashMessages/hoc/with-flash-messages'
import { mapForDropdownList } from 'Commons/utils/dropdownlists'

const mapStateToProps = (store, ownProps) => {  
    
    let enterprises = store.enterprises.list || [];
    if (enterprises.length > 0) {
        enterprises = mapForDropdownList(enterprises, {label:'legal_name'});
    }  

    let sectors = store.sectors.list || [];
    if (sectors.length > 0) {
        sectors = mapForDropdownList(sectors);
    }  

    let states = store.contacts.states || [];
    if (states.length > 0) {
        states = mapForDropdownList(states);
    }  

    return {
        data: store.contacts.selected || {},
        enterprises,
        sectors,
        states
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getEnterpriseContact: (enterprise_id, contact_id) => { return dispatch(getEnterpriseContact(enterprise_id, contact_id)); },
        getEnterprises: () => { return dispatch(fetchEnterpriseList()); },
        getSectors: (enterprise_id) => { return dispatch(fetchSectorList(enterprise_id)); },
        getContactStates: () => { return dispatch(fetchContactStates()); },
        unselectContact: () => { dispatch(contactUnselected()) },
        onAddContact: (enterprise_id, data) => { return dispatch(addContact(enterprise_id, data)) },
        onSaveContact: (enterprise_id, contact_id, data) => { return dispatch(saveContact(enterprise_id, contact_id, data)) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(ContactsForm))