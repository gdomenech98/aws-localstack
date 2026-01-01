# How to setup an aws human user

This guide helps aws human user creation with minimum permissions to allow asume role and allow from this account switch into envrionment role. Check README.md.

# Steps 

1. Create a user named `uncert-devops`.
2. Create a group named `uncert-humans`.
3. Attach the policy to `uncert-humans` group.
4. Add user to `uncert-humans` group.


{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "signin:Login",
        "aws-portal:ViewAccount"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": [
        "arn:aws:iam::ACCOUNT_ID:role/uncert-app-dev-role",
        "arn:aws:iam::ACCOUNT_ID:role/uncert-app-staging-role",
        "arn:aws:iam::ACCOUNT_ID:role/uncert-app-prod-role"
      ]
    }
  ]
}
