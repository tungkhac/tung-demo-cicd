# AWS CICD Nodejs application

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#cicd-flow-github--aws">CICD Flow (Github + AWS)</a></li>
    <li><a href="#example-value">Example value</a></li>
    <li><a href="#s3">S3</a></li>
    <li><a href="#role-and-policy">Role and policy</a></li>
    <li><a href="#ec2">EC2</a></li>
    <li><a href="#create-codebuild">Create CodeBuild</a></li>
    <li><a href="#create-codedeploy">Create CodeDeploy</a></li>
    <li><a href="#create-pipeline">Create Pipeline</a></li>
  </ol>
</details>


## Example value
- S3 bucket name: `topnal-demo-cicd`
- S3 access policy (see below): `CodeDeploy-S3-Permissions`


- EC2 name: `ec2-topnal-demo-cicd`
- EC2 IAM Role: `CodeDeploy-EC2-Instance-Profile` (create by user)


- CodeBuild Project name: `topnal-demo-cicd-build`
- CodeBuild role: `CodeBuild-service-role-common` (auto create)


- CodeDeploy Application name: `topnal-demo-cicd`
- CodeDeploy Deployment group name: `topnal-demo-cicd-group`
- CodeDeploy role: `CodeDeployEC2Role`  (create by user)


- Pipeline name: `pipeline-topnal-demo-cicd`
- Pipeline role: `PipeLineRole` (auto create)


## CICD Flow (Github + AWS)
##### Step to step to deploy a future
1. Create `furure/sample_brand` branch from `master`
2. Commit and push code in `furure/sample_brand` branch
3. Github will run unittest in `furure/sample_brand` branch after push, see in the menu `Action`
4. Create pull request for `furure/sample_brand` branch
5. When unittest runs successfully, merge `furure/sample_brand` branch into master
6. AWS `Pipeline` will run auto deploy


## S3
##### Bucket name: `topnal-demo-cicd`
##### Object Ownership:
- Step:
    1. select ACLs enabled
    2. select Bucket owner preferred

## Role and policy
##### 1. EC2: Role and policy
- Refer link: https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-create-iam-instance-profile.html
- Step: 
    1. Create policy: Permission EC2 access to S3
        Name: `CodeDeploy-S3-Permissions`
        JSON: Specify the S3 bucket name and area
        ```
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": [
                        "s3:Get*",
                        "s3:List*"
                    ],
                    "Effect": "Allow",
                    "Resource": [
                        "arn:aws:s3:::topnal-demo-cicd/*",
                        "arn:aws:s3:::aws-codedeploy-ap-northeast-1/*"
                    ]
                }
            ]
        }
       ```
    2. Create role for EC2, use before policy: `CodeDeploy-S3-Permissions`
        - Name: `CodeDeploy-EC2-Instance-Profile`

##### 2. CodeDeploy: Create role for deployment group
- Refer link: https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-create-service-role.html
- Step: 
    1. Create role: `CodeDeployEC2Role`
    2. Attach system policy: `AWSCodeDeployRole`
		


## EC2
##### 1. Create EC2:
- Refer link: https://docs.aws.amazon.com/codedeploy/latest/userguide/instances-ec2-create.html
- Step: 
    - AMI: In this demo: Ubuntu Server 20.04 LTS (HVM), SSD Volume Type
    - IAM role: select created role: `CodeDeploy-EC2-Instance-Profile`
    - Tag: value is EC2 name, this name will be used in CodeDeploy
        - Key: Name
        - Value: `ec2-topnal-demo-cicd`
			
			
##### 2. EC2 Command setup:
```
$ cd /var
$ sudo mkdir www
$ sudo chown -R ubuntu:ubuntu www/
$ chmod -R 755 www/
$ sudo apt update
```
- Install codedeploy agent follow link: https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-verify.html

Demo with EC2 server information:
- Server type: Ubuntu 20.04
- Region: Tokyo

```
$ sudo apt update
$ sudo apt install ruby-full
$ sudo apt install wget
$ cd /home/ubuntu
$ wget https://aws-codedeploy-ap-northeast-1.s3.ap-northeast-1.amazonaws.com/latest/install
$ chmod +x ./install
$ sudo ./install auto > /tmp/logfile
$ sudo service codedeploy-agent status
$ sudo service codedeploy-agent start
$ sudo service codedeploy-agent status
```

## Create CodeBuild
- Source
    - Source provider: GitHub
    - Source version: master
- Environment
    - Environment image: Managed image
    - Operating system: Ubuntu
    - Runtime(s): Standard
    - Image: aws/codebuild/standard:5.0
    - Environment type: Linux
    - Service role: create new `CodeBuild-service-role-common` or use existing
        - Attach created `CodeDeploy-S3-Permissions` to CodeBuild role
        - System will auto create policies: CodeBuildBasePolicy-..
    - VPC: notset
- Buildspec
    - Buildspec name: specified buildspec filename. Example: buildspec_prod.yml
    - Refer link: Buildspec format sample: https://github.com/backspace-academy/aws-nodejs-sample-codebuild/blob/master/buildspec.yml
- Artifacts
    - Type: Amazon S3
    - Bucket name: `topnal-demo-cicd`
- Logs
    - Group name: `topnal-demo-cicd-group`
    - Stream name: `topnal-demo-cicd-stream`
	


## Create CodeDeploy
##### 1. Create application
- Application name: `topnal-demo-cicd`
- Compute platform: EC2/On-premises
			
##### 2. Create deployment group
- Deployment group name: `topnal-demo-cicd-group`
- Service role
    - Enter a service role: `CodeDeployEC2Role`
- Deployment type
    - In-place
- Environment configuration
    1. Select `Amazon EC2 instances`
    2. Tag: value is EC2 name
        - Key: Name
        - Value: `ec2-topnal-demo-cicd`
        -> "Matching instances" below will show EC2 instances number
- Agent configuration with AWS Systems Manager
    - Install AWS CodeDeploy Agent: Never (CodeDeploy Agent will install by commandline in EC2)
- Rollbacks
    - Select "Roll back when a deployment fails"

	
	
## Create Pipeline
- Pipeline settings
    - Pipeline name: `pipeline-topnal-demo-cicd`
    - Service role: create new `PipeLineRole` or use existing
        - System will auto create 1 policy: AWSCodePipelineServiceRole-..
- Advanced settings
    - Artifact store: Custom location
    - Bucket (same created S3 name): `topnal-demo-cicd`
- Source
    1. Source provider: GitHub (Version 2)
    2. Create a connnection and select your repository
    3. Branch: master
    4. Select "Start the pipeline on source code change": auto deploy when have a change in the source code
- Build
    - Build provider: AWS CodeBuild
    - Project name: select created CodeBuild
- Deploy
    - Deploy provider: AWS CodeDeploy
    - Application name: select created CodeDeploy application
    - Deployment group: select created Deployment group
