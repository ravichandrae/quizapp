# quizapp
Quiz App
This project has two components, Backend and Front end.
Backend is developed in Java Springboot and the Front end is developed using ReactJS.

You can run this application locally using the following in two ways after cloning the repository
# Using Docker
1. Make sure you have Docker installed on your respective operating systems
2. Run `docker compose up --build` to start running the application
3. Type the URL http://localhost:3000 to test if your application is working.

# Running the individual services
## Running the Backend
1. Open the backend project as a Gradle project in Intellij IDEA.
2. Intellij automatically identifies the project as a Gradle project and gives options to build it.
3. You can run the QuizApplication.java to run the backend API from the IDE.
4. Test by accessing the API http://localhost:8080/api/quiz either from your browser or from any API testing tool like Postman
5. You can try the API using the swagger docs using the URL `http://localhost:8080/swagger-ui/index.html#/`
## Running the Frontend
1. Make sure you have Node v18 running on your machine
2. navigate to frontend directory
3. Run `npm install` to install the dependencies
4. Run `npm start` to start the front end application
5. Type the URL http://localhost:3000 to test if your application is working.
