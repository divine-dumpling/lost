import axios from 'axios'
import { http } from 'l3p-frontend'
import { API_URL } from '../../lost_settings'
import TYPES from '../../types/index'

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')

export const getWorkers = () => async (dispatch) => {
    try {
        const response = await axios.get(API_URL + '/worker')
        dispatch({ type: TYPES.GET_WORKERS, payload: response.data })
    } catch (e) {}
}

export const getWorkerLogFile = async (id) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/data/workerlogs/${id}`, {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    })
    return response.text()
}

export const downloadWorkerLogfile = (id) => async (dispatch) => {
    const token = localStorage.getItem('token')
    const response = await http.get({
        url: `${API_URL}/worker/workerlogs/${id}`,
        token,
        type: 'image',
    })
    const objectURL = window.URL.createObjectURL(response)
    const link = document.createElement('a')
    link.href = objectURL
    link.download = `worker-idx-${id}.log`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(objectURL)
}
