import React, {Component} from 'react'
import PropTypes from 'prop-types'
import FlashMessages from 'FlashMessages'
import Select from 'react-select'
import ReactQuill from 'react-quill'
import config from 'Config/app.js'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import LocaleUtils from 'react-day-picker/moment'
import moment from 'moment'
import 'moment/locale/es'
import { formatDateForStorage } from 'Commons/utils/dates'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object,
        contacts: PropTypes.array.isRequired,
        save: PropTypes.func.isRequired,  
        cancel: PropTypes.func.isRequired,  
        handleContactChange: PropTypes.func.isRequired,  
        handleQuillChange: PropTypes.func.isRequired,  
        handleDateChange: PropTypes.func.isRequired
    }

    constructor(props) {

        super(props);

        this.state = props.data;
      
        // events
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentWillReceiveProps(newProps) { 

        const date = newProps.data.date ?  moment(newProps.data.date, config.dates.visual_format) : undefined;
        this.setState({
            ...newProps.data,
            date
        });
    }

    save() {

        const data = {
            ...this.state,
            date: formatDateForStorage(this.state.date),
            contact: this.state.contact
        };       
      
        this.props.save(data);
    }

    cancel() {
        this.props.cancel();  
    }

    render() {

        const data = this.state;
      
        const dayPickerProps = config.dates.dayPickerProps;

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
                                    { this.props.data.id ? ' Edición' : ' Nueva interacción' }</span>
                            </div>      
                        </div>     
                        <div className="col-xs-12 col-sm-6">
                            <button className="btn green pull-right" onClick={this.cancel} >
                                <i className="fa fa-arrow-left" /> Volver
                            </button>
                        </div>
                    </div>       
                </div>
                <div className="portlet-body form">
                    <form role="form">
                        <div className="form-body">

                            <div className="row">

                                <div className="col-xs-12 col-sm-3">
                                    <label>Fecha</label>
                                    <div className="form-group">
                                        
                                        <DayPickerInput
                                            name="date"                                            
                                            placeholder="dd/mm/yyyy"
                                            format={config.dates.visual_format}
                                            value={moment(this.state.date).format(config.dates.visual_format) || ''}
                                            onDayChange={this.props.handleDateChange}
                                            dayPickerProps={dayPickerProps}
                                            />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-3">
                                    <div className="form-group">
                                        <label>Contacto</label>
                                        { this.props.contacts.length > 0 && data.contact &&
                                            <Select
                                                name="contact"
                                                placeholder="Seleccione..."
                                                clearable={false}
                                                value={data.contact.id}
                                                options={this.props.contacts}
                                                disabled={this.props.isEdition}
                                                onChange={obj=>{this.props.handleContactChange(obj)}}
                                                />
                                        }                                  
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12 col-lg-8">
                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <ReactQuill className="form-control" 
                                            name="description" value={ this.state.description }
                                            onChange={value=>this.props.handleQuillChange("description", value)}
                                            ></ReactQuill>
                                    </div>  
                                </div>
                            </div>

                            <input type="hidden" name="id" value={this.state.id} />                                            
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