import React, {Component} from 'react'
import PropTypes from 'prop-types'
import FlashMessages from '../../FlashMessages'
import Select from 'react-select'
import _ from 'lodash'

import {
  InputPassword,
  Input
} from 'Commons/components/form'

class Form extends Component {

    static defaultProps = {
        role: {},
        password: '',
        password_confirmation: ''
    };

    static PropsType = {
        data: PropTypes.array,
        roles: PropTypes.array.isRequired,
        fetchUserRoles: PropTypes.func.isRequired,
        onSaveUser: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    }

    constructor(props) {

        super(props)

        this.state = {...this.props.data, ...Form.defaultProps};

        // events
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        this.props.fetchUserRoles().then(_=>{
            // set default role
            this.state.role =  this.props.roles[0];
        });
    }

    /**
     * Form data received for edition
     *
     * @param {obj} nextProps
     */
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data)
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

    /**
     * Handle dropdowns changes
     * @param {*} field name
     * @param {*} value
     */
    handleOptionChange(field, value) {

        this.setState({
            [field]: value
        });
    }

    save() {
        const data = this.state;
        this.props.onSaveUser(data);
    }

    cancel() {
        this.props.onCancel();
    }

    render() {
      const {errors} = this.props
        return (
          <div className="portlet light bordered">
              <div className="portlet-title">
                  <div className="caption font-red-sunglo">
                      <i className="fa fa-circles font-red-sunglo"></i>
                      <span className="caption-subject bold uppercase">
                          { this.props.data.id ? ' Edición' : ' Alta usuario' }</span>
                  </div>
              </div>
              <div className="portlet-body form">

                  <div className="messages">
                      <FlashMessages target="form" />
                  </div>

                  <form>
                    <div className="form-body">

                            <Input 
                                classnames={`form-group ${errors.hasError('fullname')}`}
                                label="Nombre completo"
                                name="fullname"
                                value={this.state.fullname}
                                icon="fa fa-user"
                                handle={this.handleInputChange}
                                errorMessage={errors.messageContainer(errors['fullname'])}
                            />

                        <div className="row">

                            <Input 
                                classnames={`col-xs-12 col-sm-6 ${errors.hasError('username')}`}
                                label="Nombre de usuario"
                                name="username"
                                value={this.state.username}
                                icon="fa fa-user"
                                handle={this.handleInputChange}
                                errorMessage={errors.messageContainer(errors['username'])}
                            />

                            <div className="col-xs-12 col-sm-6">
                                <div className="form-group">
                                    <label>Rol</label>
                                    <div className="input-group">
                                         <Select
                                            name="role"
                                            placeholder="Seleccione..."
                                            value={this.state.role.id}
                                            clearable={false}
                                            onChange={obj=>{this.handleOptionChange("role", obj)}}
                                            options={this.props.roles}
                                        />
                                        <span className="input-group-addon">
                                            <i className="fa fa-user"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Input
                          classnames={`${errors.hasError('email')}`}
                          label="Email"
                          name="email"
                          placeholder="Email"
                          value={this.state.email}
                          handle={this.handleInputChange}
                          icon="fa fa-envelope"
                          errorMessage={errors.messageContainer(errors['email'])}
                        />

                        { this.props.data.id &&
                            <div className="note note-info">
                                <h4 className="block">Opcional</h4>
                                <p>Al dejar vacios los siguientes campos no se sobreescribirá la <b>contraseña</b> actual</p>
                            </div>
                        }

                        <InputPassword
                          classnames={`${errors.hasError('password')}`}
                          label="Contraseña"
                          name="password"
                          placeholder="Contraseña"
                          value={this.state.password}
                          handle={this.handleInputChange}
                          icon="fa fa-key"
                          errorMessage={errors.messageContainer(errors['password'])}
                        />

                        <InputPassword
                          label="Confirmar Contraseña"
                          name="password_confirmation"
                          placeholder="Contraseña"
                          value={this.state.password_confirmation}
                          handle={this.handleInputChange}
                          icon="fa fa-key"
                        />

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
