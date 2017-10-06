import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProfileWidget from '../../../Session/hoc/ProfileWidget'
import TasksWidget from '../../../Tasks/hoc/widget'
import { Link } from 'react-router-dom'

class TopRightBar extends Component {

    render() {
        return (

            <div className="top-menu">
                <ul className="nav navbar-nav pull-right">

                    <li className="dropdown page-quick-sidebar-toggle">
                        <Link to="/logout" className="dropdown-toggle">
                            <i className="icon-logout"></i>
                        </Link>
                    </li>

                    <ProfileWidget />

                    <TasksWidget />
                </ul>
            </div>
        )
    }
}

export default TopRightBar