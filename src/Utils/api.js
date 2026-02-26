const url = 'http://localhost:3900/api/';

export const apis = {

    get: async (path) => {
        const request = await fetch(`${url}${path}`, {
            method: 'GET'
        });
        return request.json();
    },
    
    post: async (path, data) => {
        const request = await fetch(`${url}${path}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return request.json();
    }
}