import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import { handleInputChange, handleOptionChange } from 'Commons/utils/forms'
import View from './form.view'
import _ from 'lodash'
import Validate from 'Commons/hoc/validate'

class Form extends Component {

    /**
     * Pre-declaring nested fields
     */
    static defaultProps = {
        data: { 
            emails: [
                {},
                {},
                {}
            ]
        }
    }         
     
    static propTypes = {
        data: PropTypes.object,
        enterprises: PropTypes.array.isRequired,
        sectors: PropTypes.array.isRequired,
        states: PropTypes.array.isRequired,
        getEnterpriseContact: PropTypes.func.isRequired,
        getEnterprises: PropTypes.func.isRequired,
        getSectors: PropTypes.func.isRequired,
        getContactStates: PropTypes.func.isRequired,
        onAddContact: PropTypes.func.isRequired,
        onSaveContact: PropTypes.func.isRequired,
        unselectContact: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,  
        flashSuccess: PropTypes.func.isRequired
    }

    constructor(props) {

        super(props);

        this.state = Object.assign({}, Form.defaultProps, props, {
            data: Form.defaultProps.data,
            isEdition: props.match.params.contact_id ? true : false,
            pristine: true   
        });

        // events
        this.handleInputChange = handleInputChange.bind(this);
        this.handleOptionChange = handleOptionChange.bind(this);
        this.handleEnterpriseChange = this.handleEnterpriseChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    /**
     * Get data
     */
    componentDidMount() {

        const self = this;

        // clean up previous data
        this.props.unselectContact();

        // fetch data under edition
        if(this.state.isEdition) {
           
            this.props.getEnterpriseContact(this.props.match.params.enterprise_id, this.props.match.params.contact_id).then(_=>{
                this.fetchData(); // fetch dropdowns data
            });
        }  else {            
            this.fetchData();
        }  
    }

    fetchData() {
         
        const self = this;

        // fetch enterprise/sectors list
        this.props.getEnterprises()
        .then(()=> {
            // set predefined enterprise
            const enterprise = (self.state.isEdition) ? self.state.data.enterprise : self.props.enterprises[1];
            return self.handleEnterpriseChange(enterprise);
        })
        .then(()=>{
            return this.props.getContactStates();
        })
        .then(()=> {

            const contact_state = (self.state.isEdition) ? 
                _.find(self.props.states, {id: self.state.data.enterprise.state_id}) 
                : self.props.states[0];

            // set predefined sector
            self.setState({
                data: Object.assign({}, self.state.data, {
                    contact_state
                }),
                pristine: false
            });
        })
    }

    /**
     * Form data received for edition
     * 
     * @param {obj} newProps 
     */
    componentWillReceiveProps(newProps) {
       
        if(this.state.pristine) {
            this.setState({
                data: {
                    ... this.state.data,
                    ... newProps.data,   
                    emails: Object.assign([], Form.defaultProps.data.emails, newProps.data.emails)
                }                
            });
        }  
    }

    handleEnterpriseChange(enterprise) {
       
        const self = this;
       
        return this.props.getSectors(enterprise.id).then(_=> {

            const sector = (self.state.isEdition) ? self.state.data.sector : self.props.sectors[0];

            // set predefined sector
            self.setState({
                data: Object.assign({}, self.state.data, {
                    enterprise,
                    sector
                })
            });
        })
    }

    /**
     * Handle form nested values
     * @param {*} event 
     */
    handleEmailChange(key, event) {
        
        const value = event.target.value;
        
        const emails = this.state.data.emails;

        if(value) {
            emails[key].email = value;
        } else {
            emails[key] = {};
        }
        
        this.setState({
            data: Object.assign({}, this.state.data, {
                emails 
            })
        });
    }

    showErrorMessage = () => {
        this.props.flashError({
            text: "Hubo un error al guardar los datos"
        })
    }
    
    save() {
       
        const data = this.state.data;  
        const enterprise_id = data.enterprise.id;
        const contact_id = data.id;

        // will redirect to filtered list after saving
        const redirection = {
            pathname: '/empresas/contactos',
            search: queryString.stringify({
                enterprise_id,
                sector_id: data.sector,
                state_id: data.contact_state
            })
        }     

        if(!data.id) {
            // new
            return this.props.onAddContact(enterprise_id, data).then(_=>{
                this.props.flashSuccess({
                    text: "Se ha guardado los datos"
                })
                this.clear();
                this.props.history.push(redirection);
            }); 
        } else {
            // update
            return this.props.onSaveContact(enterprise_id, contact_id, data).then(_=>{
                this.props.flashSuccess({
                    text: "Se ha guardado el registro"
                })
                this.clear();
                this.props.history.push(redirection);
            });  
        }        
    }

    cancel() {
        this.clear();
        this.backToList();
    }

    clear() {
        this.setState({ data: Form.defaultProps.data}); // reset state
        this.props.unselectContact(); // redux action
    }

    backToList() {
        this.props.history.goBack(); // redirect
    }

    render() {
        return ( 
            <Validate onSubmit={this.save} errorCallback={this.showErrorMessage}>
                {(errors, onSubmit) => {
                    return ( 
                        <View data={this.state.data} 
                            isEdition={this.state.isEdition}
                            enterprises={this.props.enterprises}
                            errors={errors} 
                            sectors={this.props.sectors}
                            contact_states={this.props.states}
                            handleInputChange={this.handleInputChange}
                            handleOptionChange={this.handleOptionChange}
                            handleEnterpriseChange={this.handleEnterpriseChange}
                            handleEmailChange={this.handleEmailChange}
                            save={onSubmit}
                            cancel={this.cancel}
                        /> 
                    )
                }}
            </Validate>
        )
    }
}

export default Form