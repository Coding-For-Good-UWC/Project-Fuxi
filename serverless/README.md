# Running the Application Locally

To run the application on your local development environment, follow these comprehensive steps:

### 1. Install Required Node.js Dependencies

Begin by navigating to the `serverless` directory within your project and installing the necessary Node.js dependencies. Open your terminal and run the following command:

```bash
cd serverless
npm install
```

### 2. Install Serverless Framework

If you haven't already, install the Serverless Framework globally on your system using npm. Open your terminal and execute the following command:

```bash
npm install -g serverless
```

### 3. Configure Serverless with AWS Credentials

In order to deploy and run your serverless functions locally, you need to configure Serverless with your AWS credentials. Ensure that you have both the AWS Access Key ID and Secret Access Key for your AWS user. Run the following command and replace `<your-access-key-id>` and `<your-secret-access-key>` with your actual credentials:

```bash
serverless config credentials --provider aws --key <your-access-key-id> --secret <your-secret-access-key>
```

### 4. Start the Local Server

To initiate your serverless application locally, open your terminal and use the following command:

```bash
serverless offline --host 0.0.0.0
```

### 5. Explore `serverless.yml` Configuration

To better understand and test your serverless application, explore the `serverless.yml` file. This file serves as the central configuration file for your serverless project and contains vital information about your functions, resources, and other settings. Here's how you can navigate and utilize it:

1. **Open `serverless.yml`**: Go to the root directory of your serverless project and open the `serverless.yml` file using a text editor or code editor of your choice.

2. **Function Definitions**: Inside the `serverless.yml` file, you'll find a dedicated section for defining your serverless functions. These definitions include essential details such as the function's name, handler file, and any associated event triggers. An example is provided below:

    ```yaml
    functions:
        hello:
            handler: handler.hello
    ```

3. **Service Configuration**: Below the `functions` section, you'll discover the service-level configuration options. This is where you can define environment variables, set up custom resources, specify deployment settings, and more. An example of service-level configuration is shown below:

    ```yaml
    provider:
        name: aws
        runtime: nodejs18.x
    ```

    Be sure to review and, if necessary, update the service configuration to align with your specific testing requirements.

By following these comprehensive steps, you will be able to seamlessly run and explore your serverless application in your local development environment, facilitating thorough development and testing processes.

## Additional Resources

-   [AWS Lambda Documentation](https://aws.amazon.com/lambda/)
-   [Serverless Framework Documentation](https://serverless.com/framework/docs/)
