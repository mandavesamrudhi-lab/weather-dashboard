Weather Dashboard

Project Overview

This project is a Weather Dashboard developed project. The main purpose of the project is to display current weather information for a selected city in a simple and user-friendly dashboard.

The project started with a basic weather dashboard and was developed step by step by adding different features such as login, live weather information, weather alerts, map location, temperature history, responsive design, Docker support and other dashboard features.

The project uses a weather API to get the latest weather information instead of manually entering the temperature and other details.

1. Login Page

The first part of the project is the login page.

We created a separate login interface before opening the weather dashboard. The purpose of this page is to give the project a proper application-like structure instead of directly opening the dashboard.

Features added in the login page

- Username/email input
- Password input
- Show/Hide password option
- Remember Me option
- Login button
- Forgot password option
- Basic input validation
- Link between login page and dashboard

The login page was created using HTML and CSS, and JavaScript was used for the login-related functionality.

We also worked on fixing the password visibility and login functionality when some of the buttons were not responding correctly.

After successful login, the user is taken to the weather dashboard.

2. Weather Dashboard

After logging in, the main dashboard is displayed.

The dashboard contains the weather information of the selected city.

The main information displayed includes:

- City name
- Current temperature
- Weather condition
- Humidity
- Wind speed
- Weather icon
- Weather alerts
- Weather map
- Seven-day temperature history

The dashboard was designed using HTML and CSS, while JavaScript is used to connect the interface with the weather API and update the information.

3. Weather API Integration

One of the important parts of the project is the weather API.

Instead of storing weather information manually, the application sends a request to the weather API for the selected city.

The API provides information such as:

- Temperature
- Humidity
- Wind speed
- Weather condition
- Weather description
- Location information

JavaScript receives the API response and displays the required information on the dashboard.

This makes the dashboard dynamic because the information can change according to the selected city and the latest available weather data.

4. City Search

A city search option was added to the dashboard.

The user can enter a city name and search for its weather.

After searching, the dashboard updates the weather information according to the selected city.

For example, when another city is searched, the following information changes:

- City name
- Temperature
- Humidity
- Wind speed
- Weather condition
- Weather icon
- Map location

This was tested with different cities during development.

5. Dynamic Weather Background

We also added a dynamic background to make the dashboard more interactive.

The background can change according to the current weather condition.

For example:

- Sunny weather → sunny/warm background
- Rainy weather → rainy background
- Cloudy weather → cloudy background
- Snowy weather → snow-related background

JavaScript checks the weather condition received from the API and applies the suitable background to the dashboard.

This was added so that the dashboard does not look like a static webpage.

6. Temperature Display

The current temperature is displayed on the dashboard in degrees Celsius.

We also corrected the temperature display during development when the "°C" symbol was appearing twice.

The final display shows the temperature with the correct unit.

7. Humidity and Wind Speed

Apart from temperature, the dashboard also displays humidity and wind speed.

These values are received from the weather API.

The JavaScript code reads the API response and updates the corresponding dashboard elements.

This makes the weather information more useful than displaying temperature alone.

8. Weather Alerts

A weather alert feature was added to the project.

The dashboard checks the current temperature and weather information and can display an alert when the defined condition is reached.

For example, a high-temperature condition can be used to show a warning to the user.

The project was also tested with cities having higher temperatures to check whether the alert system works properly.

9. Browser Notifications

We also worked on browser notification support.

The browser asks the user for notification permission.

When permission is granted, the application can use browser notifications for weather alerts.

During development, there was an issue with the notification permission code. The notification API was checked and corrected so that the browser permission could be requested properly.

The notification feature was then tested after giving browser permission.

10. Weather Map

A weather map/location section was added to the dashboard.

The purpose of this section is to show the location of the searched city on a map.

The city information obtained from the location/weather data is used to get the required latitude and longitude.

These coordinates are then used to display the selected location on the map.

We also fixed an issue where the map was showing an error such as:

«Search a city to view its location.»

The city search and location data were connected so that the map can update according to the selected city.

11. Seven-Day Temperature History

Another feature added to the project is the Seven-Day Temperature History.

This section is used to display the temperature information for previous days in the form of a graph.

The purpose of this feature is to allow the user to compare recent temperature changes instead of seeing only the current temperature.

A graph/chart is used to represent the temperature values.

During development, this was one of the features that required additional debugging because the historical temperature data was initially showing an error such as:

«Unable to load temperature history.»

The API request and JavaScript code were checked and modified so that the historical data could be loaded correctly.

12. Temperature Graph

The seven-day history is displayed graphically so that the temperature change can be understood easily.

The graph contains:

- Previous days
- Temperature values
- Temperature change over the selected period

This makes the dashboard more informative and gives the user a quick idea about the recent temperature pattern.

13. Responsive Dashboard

The dashboard was also designed to work on different screen sizes.

The layout is adjusted using CSS so that the project can be viewed on:

- Laptop
- Desktop
- Tablet
- Mobile phone

The mobile view is especially useful because the user can check the weather dashboard directly from a phone.

The cards and dashboard sections are arranged according to the available screen size.

14. HTML Structure

HTML is used to create the structure of the project.

Different HTML files were used for different parts of the application.

The project contains pages/files related to:

- Login page
- Dashboard
- Weather information
- Map
- Temperature history
- Other dashboard sections

The dashboard contains different sections using elements such as "div", headings, buttons, input fields and containers.

JavaScript files are connected to the HTML pages using script tags.

15. CSS Styling

CSS is used to make the project look like a proper weather application.

The styling includes:

- Dashboard layout
- Login page design
- Weather cards
- Buttons
- Input fields
- Background
- Weather icons
- Graph section
- Map section
- Responsive layout
- Cloud/visual effects

Some visual elements such as cloud effects were also added to make the dashboard more attractive.

16. JavaScript

JavaScript is the main part responsible for making the dashboard interactive.

It is used for:

- Login functionality
- City search
- API requests
- Updating weather information
- Changing the city name
- Updating temperature
- Updating humidity
- Updating wind speed
- Changing the weather background
- Weather alerts
- Browser notifications
- Map location
- Temperature history
- Updating the graph

During development, JavaScript was also used to debug problems when the dashboard stopped updating information.

17. Backend

A Node.js/Express server was used as part of the project structure.

The server is responsible for serving the application and handling the project environment.

The project contains a "server.js" file and uses Node.js packages through "package.json".

Express was installed and used for the server setup.

We also faced and fixed dependency-related issues during development, such as missing Node.js packages.

19. Docker

Docker was also included in the project.

The purpose of Docker is to package the application along with its required environment so that it can be run consistently.

A "Dockerfile" was created for the project.

We also worked through Docker-related issues during development, including problems with finding the Dockerfile and Docker connection/port errors.

After correcting the setup, Docker was included as part of the project deployment process.
