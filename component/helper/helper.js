import env from '../environment/env';
const BASE_URL = env;
const helper =  {
    getUser: async(access_token) => {
        header = {
            method: 'GET',
            headers: {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + access_token,
            }
        } ;
        const data = await fetch(BASE_URL + "Account/GetUserInformation", header)
            .then ((response) => response.json())
            .then (json => {
                return json;
            })
            .catch(e => {
                console.warn('GetUser Error',e)
                return null;
            })
        return data;
    },
    getRequest : async(access_token) => {
        header = {
            method: 'GET',
            headers: {
                'cache-control': 'no-cache',
                Authorization: 'Bearer ' + access_token,
                },
            } 
       const data = await fetch(BASE_URL + 'Request/GetRequest', header)
            .then(res => res.json())
            .then(json => {
                return json;
            })
            .catch(e => {
                console.warn('GetRequest Error',e);
                return null;
            })
        return data;
    },
    getSupervisor : async(access_token) => {
        header = {
            method: 'GET',
            headers: {
                'cache-control': 'no-cache',
                Authorization: 'Bearer ' + access_token,
                }
            }
        const data = await fetch(BASE_URL + 'Account/GetSupervisor',header)
            .then((res) => res.json())
            .then(json => {
                return json;
            })
            .catch(e => {
                console.warn('Error',e);
                return null;
            })
        return data;
    }
}
export default helper;