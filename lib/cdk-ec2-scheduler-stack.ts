import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";

export class CdkEc2SchedulerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const stopRule = new events.Rule(this, "StopEC2Instances", {
      schedule: events.Schedule.expression("cron(0 15 ? * MON-FRI *)"),
      description: "Stop EC2 instance at 10pm UTC+7 weekday.",
    });
    // stop the document database cluster.
    stopRule.addTarget(
      new targets.AwsApi({
        service: "EC2",
        action: "stopInstances",
        parameters: {
          InstanceIds: [
            "i-0bdb7531eb547277f",
            "i-019e947c18e99571a"
          ]
        },
        policyStatement: new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["ec2:StopInstances"],
          resources: ["*"],
        }),
      })
    );
    // start the cluster at 8am UTC+7 weekday.
    const startRule = new events.Rule(this, "StartsEC2Instances", {
      schedule: events.Schedule.expression("cron(0 1 ? * MON-FRI *)"),
      description: "Start EC2 instances at 8am UTC+7 weekday.",
    });
    // start the document database cluster.
    startRule.addTarget(
      new targets.AwsApi({
        service: "EC2",
        action: "startInstances",
        parameters: {
          InstanceIds: [
            "i-0bdb7531eb547277f",
            "i-019e947c18e99571a"
          ]
        },
        policyStatement: new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["ec2:StartInstances"],
          resources: ["*"],
        }),
      })
    );
  }
}
