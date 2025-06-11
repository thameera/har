# HAR Tool

A tool to view and analyzer [HAR files](<https://en.wikipedia.org/wiki/HAR_(file_format)>).

Visit the live version at [https://hartool.dev](https://hartool.dev).

## Running the project locally

1. Clone the repo.
2. Install the dependencies with `npm i`.
3. Build the project with `npm run build`.
4. Run the project with `npm start`. The app will be available at [http://localhost:8890](http://localhost:8890).

## Development

Run `npm run dev` to run the app in development mode.

> [!NOTE]
> If you switch between production build and dev build, you will get conflicts between Webpack and Turbopack. In such a case you will need to delete the `.next` directory and try again. Ideally, you should stick to one or the other when running the app.
