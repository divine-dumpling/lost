import axios from 'axios'
import { API_URL } from '../../lost_settings'
import { useMutation } from 'react-query'

// export const getMiaImage = (img) => async dispatch =>{
//     try {
//         const response = await axios.post(API_URL + '/mia/getimage', img)
//         console.log('REQUEST: mia/getimage response: ', response)
//         return response
//     } catch (e) {console.error(e)}
//         // const config = {
//         //     url: API_URL +'/'+ path,
//         //     type: 'image',
//         //     token: localStorage.getItem('token')
//         // }
//         // return await http.get(config)
// }

export const useGetAnnoExample = () => {
    return useMutation((example) =>
        axios
            .post(API_URL + `/annoExample/getAnnoExample`, example)
            .then((res) => res.data),
    )
}
