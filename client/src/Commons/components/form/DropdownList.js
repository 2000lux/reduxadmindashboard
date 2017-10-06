
import React from 'react'
import Select from 'react-select'
import classNames from 'classnames';

/**
 * Example usage:
 * <DropdownList 
        classnames="col-xs-12"
        clearable={false}
        label="Types"
        name="type"
        list={this.props.types}
        value={this.state.type.value}
        handle={this.props.handleOptionChange}
        errorMessage={errors.messageContainer(errors['type'])}
    />
 */
export class DropdownList extends React.Component {

    static defaultProps={
        name: "",
        classnames: "",
        label: "",
        placeholder: "Seleccione...",
        noResultsText: "Sin resultados",
        clearable: true,
        list: [], // options
        handle: _=>{},
        value: {} // may be object or string
    }
    
    render() {
       
        const classnames = classNames(this.props.classnames, {
            'has-error': this.props.errorMessage && this.props.errorMessage.props.children ? true : false
          });

        return (
            <div className={classnames}>
                <div className="form-group">
                    <label>{this.props.label}</label>
                    { this.props.list && this.props.value &&    
                        <Select
                            name={this.props.name}
                            errorText={this.props.errorMessage}
                            clearable={this.props.clearable}
                            placeholder={this.props.placeholder}
                            noResultsText={this.props.noResultsText}
                            value={this.props.value.id || this.props.value}
                            options={this.props.list}
                            onChange={obj=>{this.props.handle(this.props.name, obj)}}
                            />
                    }
                </div>      
                { this.props.errorMessage ? this.props.errorMessage : '' }   
            </div>
        );
    }
}

