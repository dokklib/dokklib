---
title: One-To-Many Queries - Dokklib-DB
description: Documentation on making one-to-many relational queries in DynamoDB with Dokklib-DB.
---
# One-To-Many Queries

In a one-to-many relation, one entity may have multiple entities attached to it from a different type, but those entities can only have one relation to the first entity type.
For example, the relation between a user and their orders is a one-to-many relation, as users can have multiple orders, but in most applications, one order belongs to only one user.

![One-to-many relationship example: user has orders](/img/one-to-many.png)

Suppose that we want to get all the orders for a user and we have the following data in a table:

PK             | SK         | Product         
-------------- | ---------- | ---------- 
USER#alice     | ORDER#1    | book    
USER#alice     | ORDER#2    | cd    

We can use `Table.query_prefix` to retrieve all the orders for the user as follows:

```python
import dokklib_db as db


class User(db.EntityName):
    """User entity name.

    Key value: unique user name, eg. 'alice'.
    Example key: 'USER#alice'.

    """


class Order(db.EntityName):
    """Order entity name.

    Key value: unique order id.
    Example key: 'ORDER#1'.

    """


table = db.Table('SingleTable')

pk = db.PartitionKey(User, 'alice')
sk_prefix = db.SortKeyPrefix(Order)

orders = table.query_prefix(pk, sk_prefix, attributes=['SK', 'Product'])
print(orders)
# [{'SK': '1', 'Product': 'book'}, 
#  {'SK': '2', 'Product': 'cd'}]

```

!!! note
    Check out the [Table Setup](table-setup.md) documentation to learn more about primary keys and entity names.
