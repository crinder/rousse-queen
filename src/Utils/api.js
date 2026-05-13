/*const url = 'https://rousse-queen-demo.crissdev9.com/api/'//'http://localhost:3900/api/';
*/

const url = 'http://localhost:2002/api/';

export const apis = {

    get: async (path) => {
        const request = await fetch(`${url}${path}`, {
            method: 'GET'
        });

        const response = await request.json();
        console.log('data geeet', response);
        return response;
    },
    
    post: async (path, data) => {
        const request = await fetch(`${url}${path}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await request.json();
        console.log('data possst', response);
        return response;
    },

    put: async (path, data) => {
        const request = await fetch(`${url}${path}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await request.json();
        console.log('data possst', response);
        return response;
    },

    delete: async (path, data) => {
        const request = await fetch(`${url}${path}`, {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await request.json();
        console.log('data possst', response);
        return response;
    }
}