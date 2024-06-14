# Society App

Welcome to the Society App! This application is designed to bring people together and foster a sense of community. Whether you're looking to connect with like-minded individuals, organize events, or share resources, the Society App has got you covered.

## Features

- User registration and authentication
- Profile customization
- Social networking capabilities
- Event creation and management
- Resource sharing
- Messaging system

## Running with Docker

To run the Society App with Docker, follow these steps:

1. Build the Docker image: `docker build -t society-app .`
2. Create a `.env` file in the root directory of the project and add your environment variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:3001/CuSociety
   SECRET=CJ348749284928HHSJDHIWOSNMDB
   ```
   Replace the values with your actual data.
3. Run the Docker container: `docker run --env-file .env -p 3000:3000 society-app`

The application will be available at `http://localhost:3000`.

Remember to replace `society-app` with the actual name of your Docker image if you named it differently.

## Installation

To get started with the Society App, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/society-app.git`
2. Install the required dependencies: `npm install`
3. Set up the database: [instructions here]
4. Configure the environment variables: [instructions here]
5. Start the application: `npm start`

## Contributing

We welcome contributions from the community! If you'd like to contribute to the Society App, please follow these guidelines:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit them: `git commit -m 'Add your feature'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a pull request

## Environment Variables

The application uses the following environment variables:

- `PORT`: The port on which the server will listen. Default is `3000`.
- `MONGODB_URI`: The URI for your MongoDB database. For local development, this is typically `mongodb://localhost:27017/your-database-name`.
- `SECRET`: The secret key used for authentication.

You can set these variables in a `.env` file in the root directory of the project.

## License

The Society App is open source software licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contact

If you have any questions or suggestions, please feel free to reach out to us at [calcifer_xoxo@protonmail.com].
