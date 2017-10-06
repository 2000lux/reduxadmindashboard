import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router'
import { alertMessage } from 'Commons/utils'
import { withRouter } from 'react-router'
import 'Layout/static/assets/pages/css/login.min.css'
import 'Layout/static/custom.scss'

class Login extends Component {

    static propTypes = {
        doLogin: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        // init state
        this.state = {username: '', password: '', rememberMe: false};

        // events
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Handle form interactions
     */
    handleSubmit(e) {

        e.preventDefault();

        // minimal validation
        if (this.state.username == "" || this.state.password == "")
        return alertMessage({
            message: "Usuario o contraseña incorrectos",
            type: "error",
            icon: "error",
            container: "#alert",
            focus: false
        })
    
        // dispatch action
        this.props.doLogin(this.state).then( (response) => {
            window.location.href = "/" // redirects home
        });
    }

    render() {
       
        return (
        
            <div className="login">
                
                <div className="content">     
                    <form className="login-form" onSubmit={this.handleSubmit}>

                    <h3 className="form-title font-green logo">         
                        <a href="/"><img src="/assets/layouts/layout/img/logo.png" alt="logo" /></a>
                    </h3>

                    <div id="alert"></div>

                    <div className="form-group">
                        <label className="control-label visible-ie8 visible-ie9">Username</label>
                        <input className="form-control form-control-solid placeholder-no-fix"
                        type="text" autoComplete="off"
                        placeholder="Usuario" name="username"
                        value={this.state.username}
                        onChange={e => {
                            this.setState({
                            username: e.target.value
                            })
                        }}
                        /> 
                    </div>

                    <div className="form-group">
                        <label className="control-label visible-ie8 visible-ie9">Password</label>
                        <input className="form-control form-control-solid placeholder-no-fix"
                        type="password" autoComplete="off"
                        placeholder="Contraseña" name="password"
                        value={this.state.password}
                        onChange={e => {
                            this.setState({
                            password: e.target.value
                            })
                        }}
                        /> 
                    </div>

                    <div className="form-actions">
                        <button className="btn green uppercase"
                        onClick={this.handleSubmit}>
                        Entrar
                        </button>

                        <label className="rememberme check mt-checkbox mt-checkbox-outline">
                        <input type="checkbox"
                            name="remember"
                            value={this.state.rememberMe}
                            onClick={e => {
                            this.setState({
                                rememberMe: e.target.checked
                            })
                            }}
                        />
                        <span></span>
                        Recordarme
                        </label>
                    </div>
                    </form>          
                </div>
                
                { this.state.loading && <div className="modal-backdrop fade in"></div> }
            </div>
        )
    }
}

export default Login