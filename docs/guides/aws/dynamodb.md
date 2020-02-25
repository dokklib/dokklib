# AWS DynamoDB

DynamoDB is a wide-column NoSQL database that was originally built to handle traffic at a scale where relational databases break down, but it turned out to be a surprisingly good fit for serverless applications as well. With traditional cloud stacks, it's often the relational database that causes most operational headaches.  The promise of DynamoDB is that all the problems you will ever have with your database can be solved my migrating data structures in code at your convenience.

I recommend choosing DynamoDB as your default serverless database on AWS. It is preferable to managed SQL databases due to simpler operations and deployments, with the trade-off being inflexible querying. Read detailed pros and cons below.

## DynamoDB vs SQL

### Cons

1. Inflexible querying

### Pros

1. No operational overhead (zero effort 99.99% availability)
2. Burst-capability and auto-scaling for compute and storage
3. Cost savings due to elasticity
4. Consistently low latency
5. HTTP API (only TLS overhead for new connections)
6. IAM-based security
7. Simple multi-region replication (eventually consistent only, no transactions and last write wins conflict resolution)
8. No schema migrations => simpler application deployment

## Single Table: Relational DynamoDB

NoSQL is a very broad term that is often assumed to imply a lack of support for relational queries. This is not the case with DynamoDB, as it supports both one-to-many and many-to-many relational queries on items in the same table. 

!!! note
    DynamoDB terminology can be confusing if you have a SQL background, as tables are not really tables in the SQL sense, but databases. So when people talk about putting all your data into a single DynamoDB table what they mean is putting all your data into one database.

You should put all data into a single DynamoDB table that you may need to execute relational queries on (think join in SQL), as besides relational queries, the single table pattern makes monitoring simpler, leads to lower costs and better performance, and simplifies backup management.

The key to the single table pattern is being able to anticipate query patterns, as data is now structured around these query patterns. While adding new queries carries no overhead for a normalized SQL database, this is not the case for DynamoDB where adding new query patterns might require changes to how you store the data. This is not as bad as it sounds in practice, because you have full control over how and when it happens (ie. choose between online and offline migrations and you do this when you develop features not in the middle of the night) and the trade-off is well worth it given all the benefits of DynamoDB over SQL databases for serverless applications.

## Single Table Library

The implementation of the single table pattern can be tricky to get right with the AWS SDKs, but fortunately the [Dokklib-DB](/libs/db/) Python library has your back.

## Don't Use DynamoDB

The DynamoDB single table pattern is not a good fit if 

1. You need to do real-time ad-hoc queries like in online analytical processing (OLAP).
2. You are prototyping novel technology when you can't anticipate query patterns by definition.

## DynamoDB Limitations

TODO (abiro)

## Resources

Check out the [Dokklib-DB docs](/libs/db/resources/) for more resources on the single table pattern.

