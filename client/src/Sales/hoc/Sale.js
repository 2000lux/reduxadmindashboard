import React, {Component} from 'react';
import axios from 'axios'

class Sale extends Component {

    constructor(props) {
       super(props)
    }

    render() {

        return (
            <div className="row">
                <div className="col-md-12">

                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="icon-social-dribbble font-dark hide"></i>
                                <span className="caption-subject font-dark bold uppercase">Ventas</span>
                            </div>
                        </div>
                        <div className="portlet-body">
                            Coming Soon
                           
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sale