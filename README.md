# Empire and their cities API

This API fetch data from csv and return 3 informations
* __/api/v1/empires__ return all the empires and their cities
* __/api/v1/empires?cities=citya,cityb__ return the empire with the highest population from the empires who has one of the cities in the query params
* __/api/v1/cities?filter=lowestDensity__ return the city with the lowest density

## To Install
Clone this repository and run __npm install__

## To build
Run the command __npm run build__

## To Run
Run the command __npm start__. You can specify the environment variable PORT to change the listening port
