import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class ProfileWidget extends Component {

    static propTypes = {
        session: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        
        this.state = {
            session: props.session
        }
    }

    render() {

        const profile = this.state.session.profile;

        return (
            <li className="dropdown dropdown-user">
                <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <img alt="avatar" className="img-circle" src={ profile.image } />
                    <span className="username username-hide-on-mobile"> { profile.fullname } </span>
                    <i className="fa fa-angle-down"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-default">
                    <li>
                        <Link to={"/usuarios/"+profile.id+"/editar"}>
                            <i className="icon-user"></i> My Profile </Link>
                    </li>                            
                    <li className="divider"> </li>                            
                    <li>
                        <Link to="/logout">
                            <i className="icon-key"></i> Log Out </Link>
                    </li>
                </ul>
            </li>   
        )
    }
}

export default ProfileWidget