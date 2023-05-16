# URL Shortener Microservice

This is the boilerplate code for the URL Shortener Microservice project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice.

This program will interact with a database that stores each URL with a short_url autoassigned, you can use theese short_url to redirect to the original url. 

# Set Up MongoDB

You need a MongoDB database and the URI to connect to that db (you must declare the envoirenment variable MONGO_URI="url" in the .env file). Also, you will have to manually create a collection named "counters" and create a document inside with the following format:
{
    _id: 'short-url',
    sequence_value: 0
}
This document will be used to store the "short_url" sequence, and we will query and update it to get the sequence value corresponding to each new URL document.
Inside index.js there is a schema definition with the document format exposed above, and a model declaration that points to the "counters" collection, that's why you must declare it as specified.

# Install packages

Use "npm install" in the terminal to get the needed packages specified in package.json.

# Test the program

Use "npm run start" in the terminal to run the program locally. Yo can acces it in http://localhost/3000
You will see a basic front end with a form to POST urls. If the url is valid, the program tries to find that url in order to return the data asociated, if is not found (there is no document with the introduced url) it will create a new document in the db and return that url with its short_url assigned automatically (using the counters collection, explained above, and the getNextSequenceValue function). 
Also, there is an API that redirects to a selected URL by using the short_url auto-assigned the first time a URL was introduced in the form mentioned above. The pipeline of this API is ".../api/shorturl/<short_url_number>" (e.g: if you're testing the program locally, the pipeline will be "localhost:3000/api/shorturl/<short_url_number>); you must replace <short_url_number> with a number.
For example: "localhost:3000/api/shorturl/1"






