import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import FlashMessages from '../../FlashMessages'
import { Input, DropdownList } from 'Commons/components/form'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        isEdition: PropTypes.bool,
        enterprises: PropTypes.array.isRequired,
        sectors: PropTypes.array.isRequired,  
        contact_states: PropTypes.array.isRequired,  
        handleInputChange: PropTypes.func.isRequired,  
        handleOptionChange: PropTypes.func.isRequired,  
        handleEnterpriseChange: PropTypes.func.isRequired,  
        handleEmailChange: PropTypes.func.isRequired,  
        save: PropTypes.func.isRequired,  
        cancel: PropTypes.func.isRequired,  
    }

    render() {
     
        const data = this.props.data;
        const {errors} = this.props;
    
        return (

            <div className="portlet light bordered">

                <div className="messages">
                    <FlashMessages />
                </div>

                <div className="portlet-title">
                    <div className="row">

                        <div className="col-xs-12 col-sm-6">
                            <div className="caption font-red-sunglo">
                                <i className="fa fa-circles font-red-sunglo"></i>
                                <span className="caption-subject bold uppercase">
                                    
                                   { this.props.isEdition ? ' Edición' : ' Nuevo contacto' }</span>
                            </div>     
                        </div>

                        <div className="col-xs-12 col-sm-6">
                            <button className="btn green pull-right" onClick={this.props.cancel} >
                                <i className="fa fa-arrow-left" /> Volver
                            </button>
                        </div>
                    </div>
                </div>
                <div className="portlet-body form">
                    <form className="" role="form">

                        <div className="form-body">

                            <div className="row">

                                <Input
                                    classnames="col-xs-12 col-sm-5 col-md-4"
                                    label="Nombre"
                                    name="fullname"
                                    value={data.fullname}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['fullname'])}
                                    />

                                <Input
                                    classnames="col-xs-12 col-sm-4 col-md-4"
                                    label="Cargo"
                                    name="position"
                                    value={data.position}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['position'])}
                                    />
                            
                                { this.props.contact_states.length > 0 && data.contact_state &&
                                    <DropdownList
                                        classnames="col-xs-12 col-sm-3 col-md-2"
                                        name="contact_state"
                                        label="Estado"
                                        clearable={false}
                                        value={data.contact_state.id}
                                        list={this.props.contact_states}
                                        handle={(field, obj)=>{this.props.handleOptionChange(field, obj)}}
                                        errorMessage={errors.messageContainer(errors['contact_state'])}
                                        />
                                }  
                            </div>

                            <div className="row">

                                { this.props.enterprises.length > 0 && data.enterprise &&
                                    <DropdownList
                                        classnames="col-xs-12 col-sm-6 col-md-3"
                                        name="enterprise"
                                        label="Empresa"
                                        clearable={false}
                                        value={data.enterprise.id}
                                        list={this.props.enterprises}
                                        handle={(field, obj)=>{this.props.handleEnterpriseChange(obj)}}
                                        errorMessage={errors.messageContainer(errors['enterprise'])}
                                        />
                                }  

                                { this.props.sectors.length > 0 && data.sector &&
                                    <DropdownList
                                        classnames="col-xs-12 col-sm-6 col-md-3"
                                        name="sector"
                                        label="Sector"
                                        clearable={false}
                                        value={data.sector.id}
                                        list={this.props.sectors}
                                        handle={(field, obj)=>{this.props.handleOptionChange(field, obj)}}
                                        errorMessage={errors.messageContainer(errors['sector'])}
                                        />
                                }                            
                            </div>

                            <div className="row">
                                <Input
                                    classnames="col-xs-12 col-sm-7 col-md-8"
                                    label="Teléfonos"
                                    name="phones"
                                    value={data.phones}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['phones'])}
                                    />
                              
                                <Input
                                    classnames="col-xs-12 col-sm-5 col-md-4"
                                    label="Celular"
                                    name="cellphone"
                                    value={data.cellphone}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['cellphone'])}
                                    />                             
                            </div>
                            
                            <div className="row">
                                <Input
                                    classnames="col-xs-12 col-sm-4"
                                    label="Emails"
                                    name="emails[0]"
                                    value={data.emails[0].email}
                                    handle={e=>this.props.handleEmailChange(0, e)}
                                    errorMessage={errors.messageContainer(errors["emails[0]"])}
                                    />

                                <Input
                                    classnames="col-xs-12 col-sm-4"
                                    label="&nbsp;"
                                    placeholder="Emails alternativo"
                                    name="emails[1]"
                                    value={data.emails[1].email}
                                    handle={e=>this.props.handleEmailChange(1, e)}
                                    errorMessage={errors.messageContainer(errors["emails[1]"])}
                                    />
                                
                                <Input
                                    classnames="col-xs-12 col-sm-4"
                                    label="&nbsp;"
                                    placeholder="Emails alternativo 2"
                                    name="emails[2]"
                                    value={data.emails[2].email}
                                    handle={e=>this.props.handleEmailChange(2, e)}
                                    errorMessage={errors.messageContainer(errors["emails[2]"])}
                                    />
                            </div>  

                            <input type="hidden" name="id" value={this.props.data.id} />                         
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn blue" onClick={this.props.save}>Guardar</button>
                            <button type="button" className="btn default" onClick={this.props.cancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Form