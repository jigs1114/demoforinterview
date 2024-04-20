export async function apiCall(endpoint, auth = "", body = null, method = 'GET') {
     let serverUrl = process.env.NEXT_PUBLIC_API_URL
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