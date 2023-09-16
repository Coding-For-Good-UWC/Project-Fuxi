# Testing APIs with Serverless

## Introduction

Testing APIs in a serverless environment is essential to ensure the functionality, performance, and security of your serverless applications. This README provides detailed information and best practices for testing APIs using AWS Lambda, a key component of Amazon Web Services (AWS) serverless computing.

## Installation

Follow these steps to set up your development environment for testing serverless APIs:

### 1. Clone project

```
git clone https://github.com/alvin-mission-plus/Project-Fuxi/tree/main-v2
```

### 2. Install the required Node.js dependencies:

```
cd serverless
npm install
```

### 3. Install Serverless Framework

If you haven't already, install the Serverless Framework globally on your system:

```
npm install -g serverless
```

### 4. Configure Serverless with AWS Credentials

Make sure you have the AWS Access Key ID and Secret Access Key for this user.

Run the following command to configure Serverless with your AWS credentials:

```
serverless config credentials --provider aws --key <your-access-key-id> --secret <your-secret-access-key>
```

### 5. Reading Configuration and Functions

To understand and test your serverless application, you can explore the `serverless.yml` file. This file serves as the central configuration file for your serverless project and contains information about your functions, resources, and other settings.

1. **Open `serverless.yml`**: Navigate to the root directory of your serverless project and open the `serverless.yml` file using a text editor or code editor of your choice.

2. **Function Definitions**: In the `serverless.yml` file, you'll find a section that defines your serverless functions. These definitions include details such as the function's name, handler file, and any associated event triggers.

   ```yaml
   functions:
     hello:
       handler: handler.hello
   ```

3. **Service Configuration**: Below the `functions` section, you'll find the service-level configuration options. This is where you can define environment variables, set up custom resources, specify deployment settings, and more.

   ```yaml
   provider:
     name: aws
     runtime: nodejs18.x
   ```

   Make sure to review and, if necessary, update the service configuration for your testing needs.

## Usage

This section provides instructions on how to test your serverless APIs. Include code examples, testing frameworks, and other relevant details.

### Testing Locally

Run Command Prompt with the following command

```
serverless offline
```

Afterwards, you will see a table comprising HTTP methods and URLs for testing.

Prior to conducting API tests, it is crucial to diligently prepare the necessary data. Adequate data preparation is fundamental for comprehensive and accurate testing, encompassing tasks such as configuring database entries, setting up test data, and providing appropriate input for your API endpoints. This thorough preparation ensures that your API testing validates functionality and reliability across diverse scenarios

## Additional Resources

- [AWS Lambda Documentation](https://aws.amazon.com/lambda/)
- [Serverless Framework Documentation](https://serverless.com/framework/docs/)
- [Postman API Testing](https://www.postman.com/)
