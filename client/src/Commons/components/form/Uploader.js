import React from 'react'
import classNames from 'classnames';

/**
 * Basic usage:
 *
   <Uploader
      classnames="col-xs-12 col-sm-8 col-md-10 col-lg-7"
      label="Dirección"
      name="address"
      value={data.address}
      handle={this.props.handleInputChange}
      errorMessage={errors.messageContainer(errors['address'])}
      />

 * More options:
 * inputclass="whatever"
 */
export class Uploader extends React.Component {

  static defaultProps = {
    name: undefined,
    label: undefined,
    icon: undefined,
    classnames: "",
    multiple: false,
    inputclass: "",
    link: undefined, // use this to provide a direct download link
    errorMessage: undefined // validation obj
  }

  render() {

    const classnames = classNames(this.props.classnames, {
      'has-error': this.props.errorMessage && this.props.errorMessage.props.children ? true : false
    });

    const input_group = this.props.icon;

    return (

        <div className={classnames}>
        <div className="panel panel-default panel-uploader">
            <div className="panel-heading">
              <span><i className={this.props.icon}></i> {this.props.label}</span> 
              
              { this.props.link && 
                <button type="button" className="btn btn-circle pull-right" 
                        onClick={e=>window.open(this.props.link)}
                        title="Descargar adjunto" >
                    <i className="fa fa-arrow-circle-o-down"></i>
                </button> }
            </div>
            <div className="panel-body"> 
                <div className="body-content">
                    <span className="btn fileinput-button">
                        <input name={this.props.name} 
                            multiple={this.props.multiple} 
                            type="file"
                            className={this.props.inputclass}
                            /> 
                    </span>                 
                    { this.props.errorMessage ? this.props.errorMessage : '' }
                </div>
            </div>
        </div>
      </div>  
    );
  }
}


    