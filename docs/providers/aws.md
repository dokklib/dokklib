---
title: AWS Review - Dokklib
---
# AWS Review

## Serverless Pioneers

Amazon Web Services (AWS) pioneered serverless computing and continues to innovate at the highest velocity in the space. This is the single most important factor when choosing a serverless cloud provider, as the offerings of your cloud provider define the scope of your serverless stack. This is why I recommend AWS as your default serverless backend provider. AWS is, however, not without its idiosyncrasies which is why I explain their billing and integrated products problems in detail.

## The Integrated Products Problem

AWS excels at building cloud services, but they are not good at building integrated products on top of those services. Just compare Elastic Beanstalk with Heroku or Google App Engine to see what I'm talking about. AWS of course doesn't advertise their integrated products problem, but as a serverless developer, it's critical to understand this issue to avoid wasting your time after the latest marketing splash.

To understand why AWS is bad at integrated products, you have to understand how AWS operates. AWS is made up of small teams that operate independently, working on one service at a time. Because teams are small and autonomous, they get to move quickly, and because teams use other teams' services, they are constantly iterating on tight feedback loops. This is how great services are built, but this organizational structure runs counter to building great integrated products. That requires a top down approach which sacrifices the velocity of individual services to ensure a smooth overall experience.

Service-oriented architecture has been the [operating principle](https://gist.github.com/chitchcock/1281611) at Amazon for almost two decades now, so don't expect them to change any time soon. Nor should they, in my opinion, as optimizing for integrated products would slow down services innovation on AWS, and the velocity of the cloud provider is the single most important factor when choosing a serverless provider, as noted above.

So why does AWS even bother building integrated products? The answer is that they are building integrated products defensively, ie. when the lack of such a product could be an advantage that a competitor could exploit. This brings us to AWS Amplify which is the integrated product of the AWS serverless offerings.

### AWS Amplify

AWS Amplify [claims](https://aws.amazon.com/amplify/) to be the "[f]astest way to build mobile and web applications". They try to support web and mobile app UIs and backends, analytics, AI/ML, AR & VR, CI/CD... The only buzzword that is missing from the landing page is Big Data.

You can immediately spot the problem with Amplify: it is an incredibly ambitious integrated product made by a company that is bad at building integrated products. The results are just as expected: half-baked solutions with varying quality, bad gotchas, and a cool ~1500 open [Github issues](https://github.com/aws-amplify/) between the various SDKs. Amplify development seems to be driven by imagined user journeys, not actual usage, and this leads to a framework where moving beyond the starting tutorials is a very painful experience.

The best way to understand Amplify is as a customer acquisition funnel for AWS that was prompted by increasing competition from new serverless providers who offer limited, but streamlined services. Hopefully I've already convinced you to use AWS as your default serverless provider, so you can save yourself some trouble and ignore Amplify.

!!! note
    None of this is the fault of the Amplify team who are doing heroic work. They were simply set up for failure by the AWS organization structure and operating principles. My best wishes to them.

## The Billing Problem

AWS costs are so hard to understand that people have built very successful consulting businesses on top explaining and optimizing them. (Shout out to The Duckbill Group for a [great AWS newsletter](https://www.lastweekinaws.com/)!)

The root of this problem is the same as the integrated products problem. The AWS organizational structure and operating principles lead to teams rarely paying attention to how their pricing model interacts with other teams' models. Consequently, many billing issues come from data transfer pricing surprises. 

Consider the (non-serverless) scenario where you have an Elastic Container Service (ECS) cluster with a regional Application Load Balancer (ALB) in front of it that is connected to a Global Accelerator (GA) for optimized routing to the load balancer. How much will you pay for data egress? The right answer is that you have no idea, because you will be charged for inter-availability zone traffic and data egress for the EC2 instances under your ECS cluster + ALB Capacity Units for processed bytes + GA Data Transfer-Premium. And then multiply all this by having different data egress prices for different end user locations. 

I haven't seen a serverless scenario yet where users are charged for data transfer between AWS services fortunately, which makes calculating serverless data egress costs much simpler, but given the AWS track record of billing surprises, I shall stay vigilant.

## The Good

1. AWS is very good at building cloud services.
2. AWS has the richest ecosystem of serverless services and they continue innovating at a high velocity.
3. AWS [uses](https://aws.amazon.com/blogs/opensource/real-world-serverless-application/) its own serverless products internally. 

## The Bad

1. AWS is not good at building integrated products.
2. Byzantine billing.
3. Lack of affordable DDOS protection.

## Verdict

Use AWS as the default choice for your serverless backends.