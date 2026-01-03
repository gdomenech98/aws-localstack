1. Create User (same as `profile_name`) at AWS and enable Console Access and Access Key.
2. aws configure --profile <profile_name>
3. Check correct setup `aws sts get-caller-identity --profile <profile_name>`