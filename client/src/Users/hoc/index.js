import React from 'react'
import { connect } from 'react-redux'
import UsersPage from '../components'
import { fetchUserList, fetchUserRoles, userListSuccess, addUser, saveUser, removeUser } from '../actions'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'
import { mapForDropdownList } from '../../Commons/utils/dropdownlists'

const mapStateToProps = (store, ownProps) => {  

    let roles = store.users.roles;
    if (roles.length > 0) {
        roles = mapForDropdownList(roles, {label: 'description'});
    }  

    return {
        users: store.users.list || [],
        roles
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchUserList: () => { return dispatch(fetchUserList()) },
        fetchUserRoles: () => { return dispatch(fetchUserRoles()) },
        onAddUser: (data) => { return dispatch(addUser(data)) },
        onSaveUser: (data) => { return dispatch(saveUser(data)) },
        onRemoveUser: (id) => { return dispatch(removeUser(id)) },
        onUserListSuccess: (users) => { dispatch(userListSuccess(users)) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(UsersPage))

