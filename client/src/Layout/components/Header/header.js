import React, { Component } from 'react'
import Logo from './logo'
import TopRightBar from './topRightBar'

class Header extends Component {

    render() {

        return (
            <div className="page-header navbar navbar-fixed-top">
                <div className="page-header-inner ">
                    <Logo />    
                    <a href="javascript:;" className="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
                        <span></span>
                    </a>
                    <TopRightBar />              
                </div>
                <div className="clearfix"> </div>
            </div>            
        )
    }

}

export default Header