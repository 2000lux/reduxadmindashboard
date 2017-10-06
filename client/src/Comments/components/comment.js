import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/es'

class Comment extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        onEdit: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired
    }

    render() {

        const data = this.props.data;
        const date = moment(data.create_at).format('LLLL');

        return(
            <div className="timeline-item">
                <div className="timeline-badge">
                    <img alt="avatar" className="timeline-badge-userpic" src="/assets/avatars/default_image.png" /> </div>
                <div className="timeline-body">
                    <div className="timeline-body-arrow"> </div>
                    <div className="timeline-body-head">
                        <div className="timeline-body-head-caption">
                            <a href="javascript:;" className="timeline-body-title font-blue-madison"> { data.author.fullname } </a>
                            <span className="timeline-body-time font-grey-cascade">{ date }hs</span>
                        </div>
                    </div>
                    <div className="timeline-body-content">
                        <span className="font-grey-cascade" dangerouslySetInnerHTML={{__html: data.content}}></span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Comment
