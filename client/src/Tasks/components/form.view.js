import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import ReactQuill from 'react-quill'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import config from '../../config/app.js'
import moment from 'moment'
import 'moment/locale/es'
import { formatDateVisually, formatDateForStorage } from 'Commons/utils/dates'
import {
    Input,
    TextArea,
    DropdownList
} from 'Commons/components/form'
import FlashMessages from '../../FlashMessages'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        isEdition: PropTypes.bool,
        current_user: PropTypes.object.isRequired,
        users: PropTypes.array.isRequired,
        enterprises: PropTypes.array.isRequired,
        sectors: PropTypes.array.isRequired,
        contacts: PropTypes.array.isRequired,
        statuses: PropTypes.array.isRequired,
        save: PropTypes.func.isRequired,
        cancel: PropTypes.func.isRequired,
    }

    /**
     * Pre-declaring nested fields
     */
    static defaultProps = {
        data: {
            receiver: {},
            sector: {},
            status: {}
        }
    }

    constructor(props) {

        super(props);

        this.state = {
            ...props.data,
            ...Form.defaultProps.data
        }
        // events
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentWillReceiveProps(newProps) {

        let newState = {
            isEdition: newProps.data.id ? true : false
        }

        this.setState({
            ...newProps.data,
            ...newState
        });
    }

    save() {

        const data = {
            ...this.state
        };

        this.props.save(data);
    }

    cancel() {
        this.props.cancel();
    }

    render() {

        const data = this.state;
        const {errors} = this.props;

        // just view, don't edit
        const justView = !this.isEdition || (this.props.current_user.id == this.state.author_id);

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

                                   { this.state.isEdition ? ' Edición' : ' Nueva tarea' }</span>
                            </div>

                            { data.created_at &&
                                <div className="col-xs-12 col-sm-12 col-md-3">
                                    <h4><small>Creada el</small> {data.created_at}</h4>
                                </div>
                            }
                        </div>

                        <div className="col-xs-12 col-sm-6">
                            <button className="btn green pull-right" onClick={this.cancel} >
                                <i className="fa fa-arrow-left" /> Volver
                            </button>
                        </div>
                    </div>
                </div>
                <div className="portlet-body form">
                    <form className="" role="form">

                        <div className="form-body">

                            <div className="row">

                                { this.props.users.length > 0 && data.receiver &&
                                    <DropdownList
                                        classnames="col-xs-12 col-sm-3 col-md-3"
                                        name="receiver"
                                        label="Dirigida a"
                                        value={data.receiver.id}
                                        list={this.props.users}
                                        clearable={false}
                                        handle={this.props.handleOptionChange}
                                        errorMessage={errors.messageContainer(errors['receiver_id'])}
                                        />
                                }  

                                <div className="col-xs-12 col-sm-4 col-md-2">
                                    <div className="form-group">
                                        <label>Prioridad</label>
                                        <div className="mt-radio-inline">
                                            <label className="mt-radio">
                                                Normal
                                                <input type="radio" value="normal" name="priority"
                                                    checked={data.priority == 'normal'}
                                                    onChange={e=>{this.props.handleOptionChange("priority", e.target.value)}} />
                                                <span></span>
                                            </label>
                                            <label className="mt-radio">
                                                Urgente
                                                <input type="radio" value="urgente" name="priority"
                                                    checked={data.priority == 'urgente'}
                                                    onChange={e=>{this.props.handleOptionChange("priority", e.target.value)}} />
                                                <span></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>


                                <div className="col-xs-12 col-sm-1 col-md-4"></div>

                                <div className="col-xs-12 col-sm-4 col-md-2">
                                    <div className="form-group">
                                        <label>Estado</label>
                                        { this.props.statuses.length > 0 && data.status &&
                                            <Select
                                                name="status"
                                                placeholder="Seleccione..."
                                                value={data.status.value}
                                                options={this.props.statuses}
                                                clearable={false}
                                                onChange={obj=>{this.props.handleOptionChange("status", obj)}}
                                                />
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-2 col-lg-3">
                                    <div className="form-group">
                                        <div className="mt-radio-inline">
                                            <label className="mt-radio">
                                                Cliente
                                                <input type="radio" value="cliente" name="client_type"
                                                    checked={data.client_type == 'cliente'}
                                                    onChange={e=>{this.props.handleClienTypeChange(e.target.value)}} />
                                                <span></span>
                                            </label>
                                            <label className="mt-radio">
                                                Otros clientes
                                                <input type="radio" value="otros_clientes" name="client_type"
                                                    checked={data.client_type == 'otros_clientes'}
                                                    onChange={e=>{this.props.handleClienTypeChange(e.target.value)}} />
                                                <span></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-6 col-md-5 col-lg-6">
                                    <div className="form-group">
                                        <label>Empresa</label>
                                        { this.props.enterprises.length > 0 && data.enterprise &&
                                            <Select
                                                name="enterprise"
                                                placeholder="Seleccione..."
                                                value={data.enterprise.id}
                                                options={this.props.enterprises}
                                                clearable={false}
                                                onChange={obj=>{this.props.handleEnterpriseChange(obj)}}
                                                />
                                        }
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-6 col-md-5 col-lg-3">
                                    <div className="form-group">
                                        <label>Sector</label>
                                        { this.props.sectors && data.sector &&
                                            <Select
                                                name="sector"
                                                placeholder="Seleccione..."
                                                noResultsText="Sin resultados"
                                                value={data.sector.id}
                                                options={this.props.sectors}
                                                onChange={obj=>{this.props.handleSectorChange(obj)}}
                                                />
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                    <div className="form-group">
                                        <label>Contacto</label>
                                        { this.props.contacts && data.contact &&
                                            <Select
                                                name="contact"
                                                placeholder="Seleccione..."
                                                clearable={false}
                                                value={data.contact.id}
                                                options={this.props.contacts}
                                                onChange={obj=>{this.props.handleContactChange(obj)}}
                                                />
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                        
                                { justView &&
                                    <TextArea 
                                        name="description"
                                        classnames="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                                        label= "Descripción"
                                        content={ this.state.description ? this.state.description : '' }
                                        handle={(field, value)=>this.props.handleQuillChange(field, value)}
                                        errorMessage={errors.messageContainer(errors['description'])}
                                    />
                                }
                                        
                                { !justView &&
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
                                        <div className="portlet light bg-inverse">
                                            <div className="portlet-title">
                                                <div className="caption">
                                                    <i className="icon-paper-plane font-yellow-casablanca"></i>
                                                    <span className="caption-subject bold font-yellow-casablanca uppercase"> Descripción</span>
                                                    <span className="caption-helper"></span>
                                                </div>
                                            </div>
                                            <div className="portlet-body">
                                                <h4></h4>
                                                <p> {this.state.description} </p>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                            { this.props.isEdition &&
                                <div className="row caption">
                                    <div className="col-xs-12 col-sm-6">
                                        <div className="caption-desc font-grey-cascade">Ultima modificación: { data.updated_at }</div>
                                    </div>
                                </div>
                            }

                            <input type="hidden" name="id" value={this.props.data.id} />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn blue" onClick={this.save}>Guardar</button>
                            <button type="button" className="btn default" onClick={this.cancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Form
