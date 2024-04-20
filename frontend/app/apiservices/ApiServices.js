export let serverUrl = 'http://172.20.10.4:3001'
export async function apiCall(endpoint, auth = "", body = null, method = 'GET') {
    try {
        let header = body instanceof FormData ?
            { 'Authorization': 'Bearer ' + auth }
            :
            { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + auth }
          
        let dataObject = {
            method: method,
            headers: header,
        }
        if (body !== null) {

            if (body instanceof FormData) {
                dataObject.body = body
            } else {
                dataObject.body = JSON.stringify(body)
            }
        }
        let apiUrl = `${serverUrl}${endpoint}`
        let response = await fetch(apiUrl, dataObject)
        let result = response.json();
        if (result.data)
            return result.data
        else
            return result.error ? result.error : result
    } catch (error) {
        console.log(error);
    }
}