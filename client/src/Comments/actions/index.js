import axios from 'axios'

export function saveComment({parent_id,comment,dispatch}) {

  return axios.post(`/tasks/${parent_id}/comments`, {
    comment
  }).then(res => {
    dispatch({
      type: 'ADD_COMMENT',
      comment: res.data.comment,
      task_id: parent_id
    })
  })
}
