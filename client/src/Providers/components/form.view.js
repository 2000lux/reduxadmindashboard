import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import ReactQuill from 'react-quill'
import FlashMessages from '../../FlashMessages'
import { Input, DropdownList } from 'Commons/components/form'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object,
        countries: PropTypes.array.isRequired,
        provinces: PropTypes.array.isRequired,  
        handleCountryChange: PropTypes.func.isRequired,  
        handleInputChange: PropTypes.func.isRequired,  
        handleQuillChange: PropTypes.func.isRequired,  
        handleOptionChange: PropTypes.func.isRequired,  
        save: PropTypes.func.isRequired,  
        cancel: PropTypes.func.isRequired,  
    }

    constructor(props) {

        super(props);

        this.state = props.data;
      
        // events
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps.data);
    }

    save() {

        const data = {
            ...this.state,
            country: this.state.country.id,
            province: this.state.province.id
        };       

        this.props.save(data);
    }

    cancel() {
        this.props.cancel();  
    }

    render() {

        const data = this.state;
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
                                   { this.props.data.id ? ' Edición' : ' Alta proveedores' }</span>
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
                    <form className="" role="form">

                        <div className="form-body">

                            <div className="row">
                                <Input
                                    classnames="col-xs-12 col-sm-6 col-lg-6"
                                    inputclass="form-control text-uppercase"
                                    label="Razón Social"
                                    name="legal_name"
                                    value={data.legal_name}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['legal_name'])}
                                    />

                                <Input
                                    classnames="col-xs-12 col-sm-4 col-lg-3"
                                    label="CUIT"
                                    name="cuit"
                                    value={data.cuit}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['cuit'])}
                                    />                                
                            </div>

                            <div className="row">
                                { this.props.countries.length > 0 && data.country &&
                                    <DropdownList
                                        classnames="col-xs-12 col-sm-4 col-lg-3"
                                        name="country"
                                        label="País"
                                        value={data.country.id}
                                        list={this.props.countries}
                                        handle={(field, obj)=>{this.props.handleCountryChange(obj)}}
                                        errorMessage={errors.messageContainer(errors['country'])}
                                        />
                                } 

                                { this.props.provinces.length > 0 && data.province &&
                                    <DropdownList
                                        classnames="col-xs-12 col-sm-4 col-lg-3"
                                        name="province"
                                        label="Provincia"
                                        value={data.province.id}
                                        list={this.props.provinces}
                                        handle={this.props.handleOptionChange}
                                        errorMessage={errors.messageContainer(errors['province'])}
                                        />
                                }  

                                <Input
                                    classnames="col-xs-12 col-sm-4 col-lg-3"
                                    label="Localidad"
                                    name="town"
                                    value={data.town}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['town'])}
                                    />
                            </div>

                            <div className="row">
                                <Input
                                    classnames="col-xs-12 col-sm-4 col-lg-2"
                                    label="Código Postal"
                                    placeholder="Cód. Postal" 
                                    name="zipcode"
                                    value={data.zipcode}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['zipcode'])}
                                    />  

                                <Input
                                    classnames="col-xs-12 col-sm-8 col-md-10 col-lg-7"
                                    label="Dirección"
                                    name="address"
                                    value={data.address}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['address'])}
                                    /> 
                            </div>    

                            <div className="row">   
                                <Input
                                    classnames="form-group col-xs-12 col-sm-12 col-md-8 col-lg-9"
                                    label="Teléfonos"
                                    name="phone"
                                    value={data.phone}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['phone'])}
                                    />
                            </div>  

                            <div className="row">
                                <div className="col-xs-12 col-sm-3">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Email" 
                                            name="email"
                                            value={data.email}
                                            onChange={this.props.handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6">
                                    <div className="form-group">
                                        <label>Web</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Web" 
                                            name="web"
                                            value={data.web}
                                            onChange={this.props.handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Observaciones</label>
                                <ReactQuill className="form-control" 
                                    name="observations"
                                    value={data.observations}
                                    onChange={value=>this.props.handleQuillChange("observations", value)} ></ReactQuill>
                            </div>  

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