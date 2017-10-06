/**
 * Handle form interactions
 * 
 * @param {object} event 
 * @param {string} key Referes to state key. Defaults to data but may be something else in complex forms. 
 */
export function handleInputChange(event, key = 'data') {

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    const data = Object.assign({}, this.state[key], {
        [name]: value
    })

    this.setState({ [key]: data });
}

/**
 * Handle dropdowns & radio buttons 
 * @param {*} field name
 * @param {*} value 
 */
export function handleOptionChange(field, value, key = 'data') {

    const data = Object.assign({}, this.state[key], {
        [field]: value
    })

    this.setState({ [key]:data });
}

/**
 * Handle dayPicker 
 * @param {*} date 
 */
export function handleDateChange (date) {
    this.setState({ 
        data: Object.assign({}, this.state.data, {
            date
        })
    });
};

/**
 * Handle Quill wysiwyg
 * @param {*} event 
 */
export function handleQuillChange(field, value) {
    this.setState({
        data: Object.assign({}, this.state.data, {
            [field]: value
        })
    });
}