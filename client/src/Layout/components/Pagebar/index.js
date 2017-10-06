import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Pagebar extends Component {
    render() {
        const {pageGroup, pageName} = this.props

        return (
            <div className="page-bar">
                <ul className="page-breadcrumb">
                    <li>
                        <a href="index.html">{pageGroup}</a>
                        <i className="fa fa-circle"></i>
                    </li>
                    <li>
                        <span>{pageName}</span>
                    </li>
                </ul>
                <div className="page-toolbar hide">
                    <div className="btn-group pull-right">
                        <button type="button" className="btn green btn-sm btn-outline dropdown-toggle" data-toggle="dropdown"> Actions
                            <i className="fa fa-angle-down"></i>
                        </button>
                        <ul className="dropdown-menu pull-right" role="menu">
                            <li>
                                <a href="#">
                                    <i className="icon-bell"></i> Action</a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="icon-shield"></i> Another action</a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="icon-user"></i> Something else here</a>
                            </li>
                            <li className="divider"> </li>
                            <li>
                                <a href="#">
                                    <i className="icon-bag"></i> Separated link</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Type validation
 */
Pagebar.propTypes = {
    pageGroup: PropTypes.string,
    pageName: PropTypes.string,
    items: PropTypes.array  
}

export default Pagebar