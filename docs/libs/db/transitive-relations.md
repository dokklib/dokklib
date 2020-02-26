---
title: Transitive Relations - Dokklib-DB
description: Documentation on querying transitive relations in DynamoDB with Dokklib-DB.
---
# Transitive Relations

In a transitive relation, two entities are related, because both of them have a relation to a third entity. For example, if users belong to groups in an application, and groups have subscriptions to products, then the relation between a user and a subscription is transitive.

![Transitive relation example: user has access, because they are membmer of a group that has a subscription](/img/transitive-relations.png)

If we want to check whether a user has access to a product, we have to know which groups they belong to, and if any of the groups have a valid subscription to said product. 
There are two ways to do this with DynamoDB: One is to simply issue multiple queries and the other is to denormalize (duplicate) the group subscription info.

## Multiple Queries

We can expect single digit millisecond response times from DynamoDB within a data center, so issuing two successive queries has a relatively low performance overhead. Suppose that we have the following data in a table:

PK             | SK         | Subscriptions
-------------- | ---------- | ---------- 
USER#alice     | GROUP#1    | 
USER#alice     | GROUP#2    |     
GROUP#1        | GROUP#1    | ['prod1', 'prod2']
GROUP#2        | GROUP#2    | ['prod2', 'prod3']

Now we can query all the subscription memberships of Alice as follows:

```python
import dokklib_db as db


class User(db.EntityName):
    """User entity name.

    Key value: unique user name, eg. 'alice'.
    Example key: 'USER#alice'.

    """


class Group(db.EntityName):
    """Group entity name.

    Key value: unique group name, eg. 'my-group'.
    Example key: 'GROUP#my-group'.

    """


table = db.Table('SingleTable')

# First: get all the groups that Alice belongs to
pk_alice = db.PartitionKey(User, 'alice')
group_prefix = db.PrefixSortKey(Group)
alice_groups = table.query_prefix(pk_alice, group_prefix)

print(alice_groups)
# [{'SK': '1'}, {'SK': '2'}]

# Second: get the subscriptions for the groups
keys = []
for item in alice_groups:
    pk = db.PartitionKey(Group, item['SK'])
    sk = db.SortKey(Group, item['SK'])
    keys.append(db.PrimaryKey(pk, sk))

group_subs = table.batch_get(keys)

print(group_subs)
# [{'PK': '2', 'SK': '2', 'Subscriptions': ['prod2', 'prod3']},
#  {'PK': '1', 'SK': '1', 'Subscriptions': ['prod1', 'prod2']}]
```

!!! note
    The Dynamodb `BatchGetItem` API operation doesn't return items in order, so the primary key (`PK` and `SK`) of the item is always included in `Table.batch_get` results. 
    
    Further, note that while it's possible to make indiviual reads in `Table.batch_get` strongly consistent, `BatchGetItem` results have no isolation guarantees. If you need a consistent snapshot of multiple items in the database, you should use a transaction.

## Denormalization

To avoid multiple queries, we can replicate our data and structure it in a way to fit our query pattern.
This is called denormalization.

Suppose that, as in the groups and subscriptions example above, we want to check whether a user has an active subscription, but now we want to get this data with a single query.
We could then replicate group subscription info for each user as in the table below:

PK             | SK         
-------------- | ---------- 
USER#alice     | GROUPSUB#prod1\|group1
USER#alice     | GROUPSUB#prod2\|group1
USER#alice     | GROUPSUB#prod2\|group2
USER#alice     | GROUPSUB#prod3\|group2
USER#bob       | GROUPSUB#prod1\|group1
USER#bob       | GROUPSUB#prod2\|group1

Our `GroupSub` entity has a composite value: the product identifier followed by the group identifier (eg. `prod1|group1`). This is necessary, because a user may be a member of multiple groups that have a subscription to the same product. If one group cancels the subscription, we need to know which `GroupSub` entity to remove from the user. 

We should also consider which item to put first when creating composite values. 
Here we chose the product identifier, because that lets us construct group subscription prefix queries for a specific product. 
Lets see how we can check if a user has a subscription to a specific product with a single query using our denormalized data:

```python
import dokklib_db as db


class User(db.EntityName):
    """User entity name.

    Key value: unique user name, eg. 'alice'.
    Example key: 'USER#alice'.

    """


class GroupSub(db.EntityName):
    """Group subscription entity name.

    Key value: composite of product id and group id, eg. 'prod1|group1'.
    Example key: 'GROUPSUB#prod1|group1'.

    """


table = db.Table('SingleTable')

pk = db.PartitionKey(User, 'alice')
sk_prefix = db.PrefixSortKey(GroupSub, 'prod1')

res = table.query_prefix(pk, sk_prefix)

print(res)
# [{'SK': 'prod1|group1'}]

```

## Multiple Queries vs Denormalization

My advice is to stick with multiple queries by default and view denormalization as an optimization opportunity. 

If performance requirements or the higher cost of multiple queries lead you to consider denormalization, you should first decide if your access pattern is read or write heavy. For a read heavy access pattern, denormalization makes sense, but for a write heavy pattern, replicating the data can be taxing and thus multiple read queries are preferable.

If you decide that you need to denormalize data, you should carefully consider the consistency implications on your application, as you will most likely end up with a last write wins conflict resolution by default, and that may be undesirable. 
For example, in the groups and users example above, we can use DynamoDB's serializable [transactions](./transactions.md) to make sure that only one subscription update can proceed to a `Group` entity at a time, but we lose this guarantee for the replicated subscription info of the users. 
If we are not careful, we can easily end up in a situation where a subscription is removed and added in quick succession, and during our replication process some members receive the remove event after the create event, thus leaving them without a subscription.

