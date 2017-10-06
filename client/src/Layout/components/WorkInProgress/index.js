import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

class inProgress extends Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    }

    render() {
        const { history } = this.props

        return (
            <div className="row">
                <div className="col-md-12">

                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="icon-social-dribbble font-dark hide"></i>
                                <span className="caption-subject font-dark bold uppercase">Work in Progress</span>
                            </div>
                        </div>
                        <div className="portlet-body">
                            Coming Soon ¯\_(ツ)_/¯
                        
                        </div>
                    </div>
                     
                    <div className="">
                        <button className="btn green" onClick={()=>{history.goBack()}} >
                            <i className="fa fa-arrow-left" /> Volver
                        </button>
                    </div>   
                </div>
            </div>
        )
    }
}

export default inProgress