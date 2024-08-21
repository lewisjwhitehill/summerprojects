// Import the Firebase Functions and Axios libraries
const functions = require('firebase-functions');
const axios = require('axios');

// Define an HTTP-triggered Cloud Function
// This function will be triggered when a request is made to its URL
exports.apiCallFunction = functions.https.onRequest(async (req, res) => {
    
    // Try-catch block to handle potential errors
    try {
        // Make an API call using Axios (GET request in this example)
        // Replace 'https://api.example.com/data' with the API URL you want to call
        const response = await axios.get('https://api.example.com/data');
        
        // If the API call is successful, send the response data back to the client
        res.status(200).send(response.data);
    } catch (error) {
        // If the API call fails, log the error and send a 500 error response
        console.error('API call failed:', error);
        res.status(500).send('Something went wrong');
    }
});

// Another example: HTTP-triggered Cloud Function for handling POST requests
exports.postApiCallFunction = functions.https.onRequest(async (req, res) => {

    // Check if the incoming request is a POST request
    if (req.method !== 'POST') {
        // If not a POST request, send a 405 (Method Not Allowed) response
        return res.status(405).send('Method Not Allowed');
    }
    // Try-catch block to handle potential errors
    try {
        // Extract data from the request body
        const postData = req.body;

        // Make an API call using Axios (POST request in this example)
        // Replace 'https://api.example.com/data' with the API URL you want to call
        // and pass postData as the body of the request
        const response = await axios.post('https://api.example.com/data', postData);
        
        // If the API call is successful, send the response data back to the client
        res.status(200).send(response.data);
    } catch (error) {
        // If the API call fails, log the error and send a 500 error response
        console.error('API call failed:', error);
        res.status(500).send('Something went wrong');
    }
});