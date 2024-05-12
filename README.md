# Github Repositories Listing SPA Solution

This README provides an overview of the solution for the Github Repositories Listing SPA challenge.

## Overview

This Angular 14+ single-page application (SPA) allows users to input a GitHub username and displays the public GitHub repositories associated with that user. The application meets the specific requirements outlined in the challenge description.

Live demo: https://co17502.github.io/fyle-internship-challenge-23/ 

## Features Implemented

- **Search Functionality**: Users can search for GitHub repositories by entering a username.
- **Zero State Handling**: An empty state is displayed if the user is not found, with the search bar still visible.
- **Topic Display**: Repositories display their associated topics, where one repository can have multiple topics.
- **Server-side Pagination**: Pagination is implemented on the server-side, with a dropdown for selecting the page size. The default is set to 10 repositories per page, with a maximum of 100.
- **Loader**: A skeleton loader is displayed during API calls to enhance user experience.
- **Unit Tests**: The solution includes unit tests for 1 component and 1 service, achieving 100% code coverage. Instructions for running the tests are provided in the README.
- **Hosting**: The SPA is hosted on [provide_hosting_service] and can be accessed at [provide_link_here].
- **API Caching**: GET API calls to external APIs are cached to avoid duplicates.


## Folder Structure

The folder structure follows best practices and is well-organized for easy navigation and maintenance.

## Additional Libraries Used

- lodash

## Running Locally

To run the application locally:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the development server with `ng serve`.
4. Navigate to `http://localhost:4200/` in your browser.

## Running Tests

To run unit tests:

1. Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Author

Aayushi Aggarwal

