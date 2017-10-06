import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import config from 'Config/app.js'
import ReactQuill from 'react-quill'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import LocaleUtils from 'react-day-picker/moment'
import moment from 'moment'
import 'moment/locale/es'
import { formatDateVisually } from 'Commons/utils/dates'
import {
    handleInputChange, handleOptionChange, handleDateChange } from 'Commons/utils/forms'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Input, DropdownList } from 'Commons/components/form'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object,
        currencies: PropTypes.array.isRequired,
        contacts: PropTypes.array.isRequired,
        isEdition: PropTypes.bool,
    }

    /**
     * Pre-declaring nested fields
     */
    static defaultProps = {
        data: {
            currency: {}
        }
    }

    constructor(props) {

        super(props);

        this.state = {
            ...props.data,
            ...Form.defaultProps.data
        }

        this.handleDateChange = handleDateChange.bind(this);
        this.handleInputChange = handleInputChange.bind(this);
        this.handleOptionChange = handleOptionChange.bind(this);
    }

    /**
     * Get data
     */
    componentDidMount() {

        const self = this;

        this.props.getCurrencies();
        this.props.getProducts();
    }

    componentWillReceiveProps(newProps) {

        const date = newProps.data.date ? moment(newProps.data.date, config.dates.visual_format) : undefined;

        this.setState({
            ...newProps.data,
            date
        });
    }

    render() {

        const data = this.state;

        const dayPickerProps = config.dates.dayPickerProps;

        return (

            <div className="portlet light bordered">

                <div className="portlet-title">
                    <div className="row">

                        <div className="col-xs-12 col-sm-6">
                            <div className="caption font-green-sharp">
                                <i className="fa fa-circles font-red-sunglo"></i>
                                <span className="caption-subject bold uppercase">
                                   Orden de Compra</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="portlet-body form">

                    <div className="form-body">

                        <div className="row">

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

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label htmlFor="code">Monto</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="code"
                                            className="form-control"
                                            placeholder="Monto"
                                            value={this.state.code}
                                            onChange={this.props.handleInputChange}
                                            />
                                        <span className="input-group-addon">
                                            <span className="icon-tag"></span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <DropdownList
                                classnames="col-xs-4 col-md-2"
                                label="Moneda"
                                name="currency"
                                list={this.props.currencies}
                                value={this.state.currency}
                                clearable={false}
                                handle={this.props.handleOptionChange}
                                />

                            <Input
                                classnames="col-xs-8 col-md-3"
                                label="Tipo de Cambio"
                                name="total_price"
                                data={this.state.total_price}
                                value={this.props.defaultCurrencyRate.toFixed(3)}
                                handle={this.props.handleInputChange}
                                icon={"fa fa-usd"}
                            />
                        </div>

                        <div className="row">

                            <div className="col-md-12 col-lg-6">
                                <div className="form-group">
                                    <label>Contacto</label>
                                    { this.props.contacts.length > 0 && data.contact &&
                                        <Select
                                            name="contact"
                                            placeholder="Seleccione..."
                                            value={data.contact.id}
                                            options={this.props.contacts}
                                            clearable={false}
                                            disabled={this.state.isEdition}
                                            onChange={obj=>{this.props.handleOptionChange(obj)}}
                                            />
                                    }
                                </div>
                            </div>

                            <div className="col-xs-8 col-md-3">
                                <div className="form-group">
                                    <label htmlFor="total_price">Número de OC</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="total_price"
                                            className="form-control"
                                            placeholder="Número"
                                            value={this.state.total_price}
                                            onChange={this.props.handleInputChange}
                                            />
                                        <span className="input-group-addon">
                                            <span className="fa fa-usd"></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                          <div className="col-xs-8 col-md-3">

                              <span className="btn green fileinput-button">
                                  <i className="fa fa-plus"></i>
                                  <span> Add files... </span>
                                  <input name="files[]" multiple="" type="file" /> </span>
                          </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Form
