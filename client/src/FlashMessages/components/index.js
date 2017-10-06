import React, {Component} from 'react';

class FlashMessages extends Component {

    static defaultProps = {
        target: null // string: used to render messages only in certain parts of the screen
    }

    close(id) {
        this.props.removeFlashMessage(id);
    }

    render() {
        
        const messages = this.props.messages || [];

        if(messages.length == 0) {
            return null;
        }
       
        return (
            <div>
                {
                    messages.map((message) => {

                        if(!message.viewed) {
                            setTimeout(function(){this.props.markAsViewed(message.id)}.bind(this), 1000)
                        }

                        if(this.props.target) {
                            /** Only render messages matching the target */
                            if(message.target && message.target == this.props.target) {
                                return this.renderMessage(message);
                            }
                        } else {
                            return this.renderMessage(message);
                        }
                    })
                }
            </div>
        );
    }

    renderMessage(message) {
        return (
            <div key={message.id}
                className={`alert alert-${message.type} alert-dismissable animated flipInX`}>
                <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-hidden="true"
                    onClick={_ => this.close(message.id)}></button>
                <strong>{message.title}</strong> {message.text}
            </div>
        );
    }
}

export default FlashMessages