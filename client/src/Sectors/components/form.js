import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import FlashMessages from '../../FlashMessages'
import _ from 'lodash'

class Form extends Component {

    static defaultProps = {
        data: {
            id: '',
            name: ''
        }
    };

    static PropsType = {
        data: PropTypes.array,
        onSaveSector: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props = {}) {
        super(props)
        
        this.state = this.props.data;

        // events
        this.handleInputChange = this.handleInputChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    /**
     * Form data received for edition
     * 
     * @param  nextProps 
     */
    componentWillReceiveProps(nextProps) {       
        this.setState({           
            name: nextProps.data.name
        })
    }

    /**
     * Handle form interactions
     * @param {*} event 
     */
    handleInputChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    save(event) {
        event.preventDefault();
        this.props.onSaveSector({
             id: this.props.data.id,
             name: this.state.name
        });  
    }

    cancel() {
        this.props.onCancel(); 
    }

    goBack() {
        this.props.history.goBack();
    }

    render() {
      
        return (

            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6">
                            <div className="caption font-red-sunglo">
                                <i className="fa fa-circles font-red-sunglo"></i>
                                <span className="caption-subject bold uppercase">
                                    { this.props.data.id ? ' Edición' : ' Alta sector' }</span>
                            </div>    
                        </div> 

                        <div className="col-xs-12 col-sm-6">
                            <button className="btn green pull-right" onClick={this.goBack} >
                                <i className="fa fa-arrow-left" /> Volver
                            </button>
                        </div> 
                    </div>             
                </div>
                <div className="portlet-body form">

                    <div className="messages">
                        <FlashMessages target="form" />
                    </div>

                    <form role="form" onSubmit={this.save}>
                        <div className="form-body">

                            <div className="form-group">
                                <label>Nombre</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Nombre"
                                        onChange={this.handleInputChange}
                                        value={this.state.name}
                                        />
                                    <span className="input-group-addon">
                                        <i className="fa fa-font"></i>
                                    </span>
                                </div>
                            </div>

                            <input type="hidden" name="enterprise_id" value={this.props.enterprise_id} />                                            
                            <input type="hidden" name="id" value={this.props.data.id} />                                            
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn blue">Guardar</button>
                            <button type="button" className="btn default" onClick={this.cancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(Form)
