import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Comment from './comment'
import CommentForm from './form'

class List extends Component {

    static propTypes = {
        list: PropTypes.array.isRequired,
        id: PropTypes.number.isRequired
    }

    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onEdit(id) {
        console.log("on edit")
    }

    onDelete(id) {
        console.log("on delete")
    }

    render() {

        const list = this.props.list;

        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="portlet light portlet-fit bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="fa fa-comment-o font-green"></i>
                                <span className="caption-subject bold font-green uppercase"> Comentarios</span>
                                <span className="caption-helper"> ...</span>
                            </div>
                        </div>
                        <CommentForm parent_id={this.props.id} />
                        <div className="portlet-body">
                            <div className="timeline">

                                { list.length > 0 &&
                                    list.map(data=>{
                                        return <Comment data={data}
                                                key={data.id}
                                                onEdit={_=>{this.onEdit(data.id)}}
                                                onDelete={_=>this.onDelete(data.id)} />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default List
