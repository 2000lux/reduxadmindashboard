import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { Link } from 'react-router-dom'
import { Input, DropdownList } from 'Commons/components/form'
import FlashMessages from '../../FlashMessages'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object,
        types: PropTypes.array.isRequired,
        providers: PropTypes.array.isRequired,
        families: PropTypes.array.isRequired,
        groups: PropTypes.array.isRequired,
        currencies: PropTypes.array.isRequired,
        handleInputChange: PropTypes.func.isRequired,  
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
            type: this.state.type.value
        }
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
                <div className="portlet-title">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6">
                            <div className="caption font-red-sunglo">
                                <span className="fa fa-circles font-red-sunglo"></span>
                                <span className="caption-subject bold uppercase">
                                    { this.props.data.id ? ' Edición' : ' Alta producto' }</span>
                            </div>     
                        </div>

                        <div className="col-xs-12 col-sm-6">
                            <Link to='/productos' className="btn green pull-right">
                                <span className="fa fa-arrow-left" /> Volver
                            </Link>
                        </div>
                    </div>                
                </div>
                <div className="portlet-body form">
                    <form role="form">
                        <div className="form-body">
                            <div className="messages">
                                <FlashMessages />
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-2">
                                    <div className="form-group">
                                        <label>Tipo</label>
                                        <Select
                                            name="type"
                                            clearable={false}
                                            value={this.state.type.value}
                                            options={this.props.types}
                                            onChange={obj=>{this.props.handleOptionChange("type", obj)}}
                                            />
                                    </div>
                                </div>

                                <Input
                                    classnames="col-xs-12 col-md-4"
                                    label="Código"
                                    name="code"
                                    icon="icon-tag"
                                    value={data.code}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['code'])}
                                    />  
                              
                                <Input
                                    classnames="col-xs-12 col-md-6"
                                    label="Nombre"
                                    name="name"
                                    icon="icon-tag"
                                    value={data.name}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['name'])}
                                    />  
                            </div>

                             <div className="row">      
                               
                                { this.props.providers.length > 0 && this.state && this.state.provider &&                                         
                                 
                                    <DropdownList
                                        classnames="col-xs-12 col-md-4"
                                        name="provider"
                                        label="Proveedor"
                                        value={data.provider.id}
                                        list={this.props.providers}
                                        handle={(field, obj)=>{this.props.handleOptionChange(field, obj)}}
                                        errorMessage={errors.messageContainer(errors['provider'])}
                                        />
                                }
                                
                                { this.props.families.length > 0 && this.state && this.state.family &&    

                                    <DropdownList
                                        classnames="col-xs-12 col-md-4"
                                        name="family"
                                        label="Familia"
                                        value={data.family.id}
                                        list={this.props.families}
                                        handle={(field, obj)=>{this.props.handleFamilyChange(obj)}}
                                        errorMessage={errors.messageContainer(errors['family'])}
                                        />
                                }
                        
                                { this.props.groups.length > 0 && this.state && this.state.group &&    
                    
                                    <DropdownList
                                        classnames="col-xs-12 col-md-4"
                                        name="group"
                                        label="Grupo"
                                        value={data.group.id}
                                        list={this.props.groups}
                                        handle={(field, obj)=>{this.props.handleOptionChange(field, obj)}}
                                        errorMessage={errors.messageContainer(errors['group'])}
                                        />
                                }
                            </div>

                            <div className="row">                     
                                <div className="col-xs-4 col-md-1">
                                    <div className="form-group">
                                        <label>Moneda</label>
                                        { this.props.currencies.length > 0 && this.state && this.state.currency &&    
                                            <Select
                                                name="currency"
                                                clearable={false}
                                                value={this.state.currency.id}
                                                options={this.props.currencies}
                                                onChange={obj=>{this.props.handleOptionChange("currency", obj)}}
                                                />
                                        }
                                    </div>         
                                </div>
                             
                                <Input
                                    classnames="col-xs-8 col-md-3"
                                    label="Precio"
                                    name="price"
                                    icon="fa fa-usd"
                                    value={data.price}
                                    handle={this.props.handleInputChange}
                                    errorMessage={errors.messageContainer(errors['price'])}
                                    />  
                                <div className="col-xs-12 col-md-8"></div>
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