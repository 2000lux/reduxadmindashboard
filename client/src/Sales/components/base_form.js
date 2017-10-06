import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import FlashMessages from 'FlashMessages'
import config from 'Config/app.js'
import ReactQuill from 'react-quill'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import LocaleUtils from 'react-day-picker/moment'
import moment from 'moment'
import 'moment/locale/es'
import QuotationForm from 'Sales/hoc/form.quotation'
import PurchaseOrderForm from 'Sales/hoc/form.purchase_order'
import {
    Input,
    TextArea,
    DropdownList,
    RadioGroup, Radio
} from 'Commons/components/form'
import { formatDateForStorage, formatDateVisually } from 'Commons/utils/dates'

class Form extends Component {

    static PropTypes = {
        data: PropTypes.object.isRequired,
        isEdition: PropTypes.bool,
        contactMeans: PropTypes.array.isRequired,
        enterprises: PropTypes.array.isRequired,
        contacts: PropTypes.array.isRequired,
        statuses: PropTypes.array.isRequired,
        currencies: PropTypes.array.isRequired,
        save: PropTypes.func.isRequired,
        cancel: PropTypes.func.isRequired
    }

    render() {

        const data = this.props.data;
        const dayPickerProps = config.dates.dayPickerProps;
        const {errors} = this.props;

        return (

            <div className="portlet light bordered">

                <div className="portlet-title">
                    <div className="row">

                        <div className="col-xs-12 col-sm-6">
                            <div className="caption font-red-sunglo">
                                <i className="fa fa-circles font-red-sunglo"></i>
                                <span className="caption-subject bold uppercase">

                                   { this.props.isEdition ? ' Edición' : ' Nueva venta' }</span>
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-6">
                            <button className="btn green pull-right" onClick={ this.props.cancel} >
                                <i className="fa fa-arrow-left" /> Volver
                            </button>
                        </div>
                    </div>
                </div>
                <div className="portlet-body form">
                    <form className="" role="form">

                        <div className="form-body">

                            <div className="row">

                                <div className="messages">
                                    <FlashMessages />
                                </div>

                                <div className="col-sm-12 col-md-2 col-lg-2">
                                    <label>Fecha</label>
                                    <div className="form-group date-small">

                                        <DayPickerInput
                                            name="date"
                                            placeholder="dd/mm/yyyy"
                                            format={config.dates.visual_format}
                                            value={formatDateVisually(data.date) || ''}
                                            onDayChange={this.props.handleDateChange}
                                            dayPickerProps={dayPickerProps}
                                            />
                                    </div>
                                </div>

                                <DropdownList
                                    classnames="col-xs-12 col-md-4 col-lg-4"
                                    label="Medio de Contacto"
                                    name="contact_mean"
                                    list={this.props.contactMeans}
                                    value={data.contact_mean}
                                    clearable={false}
                                    handle={this.props.handleOptionChange}
                                    />

                                <DropdownList
                                    classnames="col-xs-12 col-md-4 col-lg-6"
                                    label="Estado"
                                    name="status"
                                    list={this.props.statuses}
                                    value={data.status}
                                    clearable={false}
                                    handle={this.props.handleOptionChange}
                                    />
                            </div>

                            <div className="row">

                                <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
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

                                { this.props.enterprises.length > 0 && data.enterprise &&
                                    <DropdownList
                                        classnames="col-md-12 col-lg-10"
                                        name="enterprise"
                                        label="Empresa"
                                        clearable={false}
                                        value={data.enterprise.id}
                                        list={this.props.enterprises}
                                        handle={(field, obj)=>{this.props.handleEnterpriseChange(obj)}}
                                        errorMessage={errors.messageContainer(errors['enterprise_id'])}
                                        />
                                }
                            </div>

                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                               </div>
                   
                                <DropdownList
                                    classnames="col-md-12 col-lg-10"
                                    name="contact"
                                    label="Contacto"
                                    clearable={false}
                                    value={data.contact.id}
                                    list={this.props.contacts}
                                    handle={(field, obj)=>{this.props.handleOptionChange(field, obj)}}
                                    errorMessage={errors.messageContainer(errors['contact_id'])}
                                    />
                            </div>

                            <div className="row">
                                <div className="col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <ReactQuill className="form-control"
                                            name="observations" value={ data.observations }
                                            onChange={value=>this.props.handleQuillChange("observations", value)}
                                            ></ReactQuill>
                                    </div>
                                </div>
                            </div>

                            { data.status.code >= 3 &&

                                <QuotationForm
                                    sale_id={data.id}
                                    data={data.quotation}
                                    quoted={data.status.code >= 4}
                                    />
                            }

                            { data.status.code >= 6 &&

                                <PurchaseOrderForm
                                    defaultCurrencyRate={this.props.currencies_rates['USDARS']}
                                    data={data.payment_order}
                                    currencies={this.props.currencies}
                                    />
                            }

                            <input type="hidden" name="id" value={this.props.data.id} />
                        </div>

                        <div className="form-actions fixed">
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
