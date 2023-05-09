import axios from "axios"

export default async function verifyLoginAsync(csrfToken: string, cookie: string|null = null): Promise<any> {
    const headersDictionary = (cookie) ? {csrfToken: csrfToken, Cookie: cookie} : {csrfToken: csrfToken}
    const apiUrl = `${process.env.API_URL}/auth/session/verification`

    let data: { [name: string]: any }|null = null
    let error: number|null = null  

    // axios.defaults.withCredentials = true
    try {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:4040/auth/session/verification',
            headers: headersDictionary,
            withCredentials: true,
            timeout: 5000,
        })
        data = response.data
        return {data, error};
    } catch (error: any) {
        if (error.response) {
            // Handle response that falls out of the range of 2xx status code
            data = (error.response.data);
            error = error.response.status;
        } else if (error.code === 'ECONNABORTED'){
            // Handle Timeout
            error = 408; // Timeout
        } else if (error.request) {
            // Handle request was made but no response was received
            data = {reason: "No Response"};
            error = 444; // No Response
        } else {
            // Something happened in setting up the request that triggered an Error
            error = 400; // Bad Request
            data = {reason: "Unknown Error"};
        }
        return {data, error};
    }
} 