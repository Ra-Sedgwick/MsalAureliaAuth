
## Building The Code

To build the code, follow these steps.

1. Clone the repo
2. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
3. From the root project folder, execute the following command:
  ```shell
  npm install
  ```
4. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
5. Ensure the Aurelia Cli is installed

	```shell
    npm install aurelia-cli -g
    ```
6. To build the code, you can now run:
  ```shell
   au run
   - app runs on http://localhost:4747
  ```
7. Authentication Flow
  - Entry point to application is main.ts > aurelia.start()
  - Msal UserAgentApplication is initialized in /services/token-service.ts
  - Login logic located in /service/auth-service.ts
  - If authenticated the user is directed shell.ts
