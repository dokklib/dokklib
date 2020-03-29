---
title: GCP Review - Dokklib
---
# GCP Review

## Containing Containers

Google Cloud Platform (GCP) has the best container orchestration technology out there, so it's no wonder that they are pushing the managed compute narrative of serverless. This is unfortunate, because the [real value](/serverles-stack) of serverless is in using managed services, not in simpler ways of running code, as writing code means that there is a missing feature somewhere.

## Firebase

It's too bad that GCP doesn't embrace the serverless stack in the managed services-sense, because Firebase, that Google acquired ca. 2014, is the single best integrated serverless product. Yet it's in a weird place, neither inside, neither outside GCP, and it doesn't interface well with the rest of the GCP services, which means that building on Firebase is very limited in scope compared to building on AWS or Azure.

## The Good

1. Firebase is the simplest way to build and deploy a serverless application.

## The Bad

1. Firebase is limited in scope and does not integrate well with the rest of GCP.
2. No infrastructure-as-code support for Firebase.

## Verdict

You should use Firebase if you want to build a quick throw-away prototype or if you know that your application is very limited in scope (like the proverbial TODO app), otherwise, avoid GCP for your serverless stack.