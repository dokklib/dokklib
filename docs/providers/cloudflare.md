---
title: Cloudflare Review - Dokklib
---
# Cloudflare Review

## Living on the Edge

Cloudflare is a company built to serve your storage, security and, most recently, computing needs at the network edge. They have built a lot of goodwill in the developer community by providing free DDOS protection and with good reason.

## Workers

Cloudflare Workers let you run JavaScript on the Cloudflare CDN's edge locations and also provide a key-value store at those edge locations. This is huge, as no other provider has anything remotely close to such a zero-effort, globally distributed data store. Most recently, the Workers team also hacked a static hosting solution called Workers Sites on top of Workers and the key-value store. This works surprisingly well and I can recommend it if you need a highly customizable static hosting solution.

If you're using Cloudflare anyway, adding Workers to your stack is a no brainer, but if you're on a single provider, adding a new one to your stack will bring a lot of complexity. This can be worth it however, if you want any of the goodies below, all of which are unique to Cloudflare's offering.

## The Good

1. Free DDOS protection (including costs).
2. Zero-effort key-value store on the network edge.
3. No data transfer costs.
4. The [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in Workers is the best serverless function API out there.

## The Bad

1. Poor developer experience: gaps in the documentation and misleading error messages.
2. No logs.

## Verdict

Use Workers if you're already on Cloudflare, or if you need a highly customizable static hosting solution.