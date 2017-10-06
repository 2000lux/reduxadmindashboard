import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import Validate from 'Commons/hoc/validate'
import View from './form.view'

class Form extends Component {

    static defaultProps = {
        data: {
            'id': '',
            'legal_name': '',
            'cuit': '',
            'town': '',
            'address': '',
            'zipcode': '',
            'phone': '',       
            'observations': '',
            'email': '',
            'web': '',
            'country': {},
            'province': {},
        }
    };

    static propTypes = {
        data: PropTypes.object,
        countries: PropTypes.array.isRequired,
        provinces: PropTypes.array.isRequired,
        getProvider: PropTypes.func.isRequired,
        getCountries: PropTypes.func.isRequired,
        getProvinces: PropTypes.func.isRequired,
        onSaveProvider: PropTypes.func.isRequired,
        unselectProvider: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,  
        flashSuccess: PropTypes.func.isRequired,  
        flashError: PropTypes.func.isRequired
    }

    constructor(props) {

        super(props);
      
        this.state = Object.assign({}, Form.defaultProps, props, {
            isEdition: props.match.params.id ? true : false     
        });

        // events
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleQuillChange = this.handleQuillChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    /**
     * Get data
     */
    componentDidMount() {

        const self = this;

        // fetch data under edition
        if(this.state.isEdition) {
            this.props.getProvider(this.props.match.params.id).then(_=>{
                this.fetchData();
            });
        } else {
            this.clear();
            this.fetchData();
        }   
    }

    fetchData() {

        const self = this;

        // fetch country/provinces list
        this.props.getCountries().then(()=> {
            // set predefined country
            const country = (self.state.isEdition) ? self.state.data.country : self.props.countries[1];
            self.handleCountryChange(country, self.state.data.province);
        });
    }

    /**
     * Form data received for edition
     * 
     * @param {obj} nextProps 
     */
    componentWillReceiveProps(nextProps) {

        let newState = {
            data: nextProps.data,
            countries: nextProps.countries,
            provinces: nextProps.provinces
        };  

        this.setState(newState);
    }

    handleCountryChange(country, province = null) {
      
        const self = this;

        this.props.getProvinces(country.id).then(_=> {

            // set predefined province
            const province = province ? province : self.props.provinces[1]; 
           
            self.setState({ 
                data: Object.assign({}, self.state.data, {
                    country,
                    province
                }) 
            });
        })
    }

    /**
     * Handle form interactions
     * @param {*} event 
     */
    handleInputChange(event) {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const data = Object.assign({}, this.state.data, {
            [name]: value
        })

        this.setState({ data });
    }

    /**
     * Handle Quill wysiwyg
     * @param {*} event 
     */
    handleQuillChange(field, value) {

        const data = Object.assign({}, this.state.data, {
            [field]: value
        })

        this.setState({ data });
    }

    /**
     * Handle dropdowns changes 
     * @param {*} field name
     * @param {*} value 
     */
    handleOptionChange(field, value) {

        const data = Object.assign({}, this.state.data, {
            [field]: value
        })

        this.setState({ data });
    }

    save(data) {

        // will redirect to filtered list after saving
        const redirection = {
            pathname: '/proveedores',
            search: queryString.stringify({
                country_id: data.country
            })
        }     

        const self = this;
      
        if(!data.id) {
            return this.props.onAddProvider(data).then(_=>{
                self.props.flashSuccess({
                    text: "Se ha guardado los datos"
                });
                self.clear();
                self.props.history.push(redirection);
            });  
        } else {
            return this.props.onSaveProvider(data).then(_=>{
                self.props.flashSuccess({
                    text: "Se ha guardado los datos"
                });
                self.clear();
                self.props.history.push(redirection);
            });    
        }      
    }

    showErrorMessage = () => {
        this.props.flashError({
            text: "Hubo un error al guardar los datos"
        })
    }

    cancel() {
        this.clear();
        this.backToList();
    }

    clear() {
        this.setState({ data: Form.defaultProps.data }); // reset state
        this.props.unselectProvider(); // redux action
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
                        countries={this.props.countries}
                        provinces={this.props.provinces}
                        handleCountryChange={this.handleCountryChange}
                        handleInputChange={this.handleInputChange}
                        handleQuillChange={this.handleQuillChange}
                        handleOptionChange ={this.handleOptionChange}
                        errors={errors}
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