import React, { Component } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import Page from './components/Page'
import config from '../config/axios' 
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { cleanupFlashMessages } from '../FlashMessages/actions'

import 'react-select/dist/react-select.css'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'
import 'react-quill/dist/quill.snow.css'
import 'sweetalert2/dist/sweetalert2.css'
import 'react-day-picker/lib/style.css'
import './static/custom.scss'

class AppContainer extends Component {
    
    static propTypes = {
        location: PropTypes.object.isRequired
    }

    componentWillReceiveProps(nextProps) {
      
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        this.props.cleanupFlashMessages();
    }

    render() {
       
        return (
            <div className="page-wrapper">
                    
                <Header />

                <div className="page-container">                     
                    <Sidebar />
                                    
                    <Page />                                    
                </div>
                
                <Footer />

            </div>  
        )
    }
}

const mapDispatchToProps = dispatch => {
  return {
    cleanupFlashMessages: _ => dispatch( cleanupFlashMessages() )
  }
}

export default withRouter(connect(null, mapDispatchToProps)(withRouter(AppContainer)))