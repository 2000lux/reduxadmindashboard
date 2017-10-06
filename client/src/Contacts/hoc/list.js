import React, {Component} from 'react';
import { connect } from 'react-redux'
import ContactsList from '../components'
import { fetchContactsList, contactListSuccess, fetchContactStates, addContact, 
         updateContactState, replaceContact, transferContact, removeContact } from '../actions'
import { fetchEnterpriseList } from '../../Enterprises/actions'
import { fetchSectorList } from '../../Sectors/actions'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'
import { mapForDropdownList } from '../../Commons/utils/dropdownlists'

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
        states = mapForDropdownList(states, {value:'keyname'});
    }  

    return {
        contacts: store.contacts.list,
        enterprises,
        sectors,
        states
    }
}

const mapDispatchToProps = dispatch => { 
    return {
        fetchEnterpriseList: () => { return dispatch(fetchEnterpriseList()); },
        fetchSectorList: (enterprise_id = null) => { return dispatch(fetchSectorList(enterprise_id)); },
        fetchContactStates: () => { return dispatch(fetchContactStates()); },
        fetchEnterpriseContactList: (filters) => { return dispatch(fetchContactsList(filters)); },
        onAddContact: (data) => { dispatch(addContact(data)) },
        onChangeContactState: (enterprise_id, data) => { return dispatch(updateContactState(enterprise_id, data)) },
        onReplaceContact: (data) => { return dispatch(replaceContact(data)) },
        onTransferContact: (data) => { return dispatch(transferContact(data)) },
        onRemoveContact: (id) => { return dispatch(removeContact(id)) },
        onContactListSuccess: (list) => { dispatch(contactListSuccess(list)) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(ContactsList))