import React, { Component } from 'react'

class Logo extends Component {

    render() {
        return(
            <div className="page-logo">
                <a href="/">
                    <img src="/assets/layouts/layout/img/logo-invert.png" alt="logo" className="logo-default" /> 
                </a>                
            </div>
        )
    }
}

export default Logo