
import React from 'react'
import ReactQuill from 'react-quill'
import classNames from 'classnames';

/**
 * Example usage:
 <TextArea 
    name="description"
    classnames="col-xs-12 col-sm-12 col-md-12 col-lg-8"
    label="Descripción"
    placeholder="Descripción ..."
    content='Lorem Ipsum'
    handle={(field, value)=>this.props.handleQuillChange(field, value)}
    errorMessage={errors.messageContainer(errors['description'])}
 />
 */
export class TextArea extends React.Component {

    static defaultProps={
        name: "",
        classnames: "",
        label: "",
        placeholder: "",
        handle: _=>{},
        content: ''
    }
    
    render() {
       
        const classnames = classNames(this.props.classnames, {
            'has-error': this.props.errorMessage && this.props.errorMessage.props.children ? true : false
          });

        return (
            <div className={classnames}>
                <div className="form-group">
                    <label>{this.props.label}</label>
                    <ReactQuill className="form-control"
                        name={this.props.name} 
                        value={ this.props.content ? this.props.content : '' }
                        placeholder={this.props.placeholder}
                        onChange={obj=>{this.props.handle(this.props.name, obj)}}
                        ></ReactQuill>
                </div>      
                { this.props.errorMessage ? this.props.errorMessage : '' }   
            </div>
        );
    }
}

