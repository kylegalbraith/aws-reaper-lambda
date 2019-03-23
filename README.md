# aws-reaper-lambda
This is an AWS Lambda function that will trigger everyday via an AWS CloudWatch Rule. Once fired, it lists any available EBS volumes in the region it is configured to run in. If it finds any, it deletes them.

**Disclaimer: This is a destructive operation and there is no logic built into the function to determine _if_ the available volume should be removed. You should use this function only if you are certain available volumes should _always_ be deleted. If that is not the case, you should add logic to this function to account for that or not even use it at all.**

### Dependencies
This repository makes use of the [Serverless Framework](https://serverless.com/). You need to have that installed and configured to provision this function.

### Deployment
To deploy this function simply clone this repo and run the following command:
```
$ serverless deploy
```