---
title: Many-To-Many Queries - Dokklib-DB
description: Documentation on making many-to-many relational queries in DynamoDB with Dokklib-DB.
---
# Many-To-Many Queries

In a many-to-many relation both entities may have multiple relations to other entities of the same type.
A good example is users and groups, where one user may belong to multiple groups, but groups may have multiple users as well.

![Many-to-many relationship example: user and groups](/img/many-to-many.png)

Suppose that we have the following data in a table:

PK             | SK         
-------------- | ---------- 
USER#alice     | GROUP#1    
USER#alice     | GROUP#2    
USER#bob       | GROUP#2    

We can use `Table.query_prefix` with the primary index to retrieve all the groups that a user belongs to. 
If we use `Table.query_prefix` with the inverse primary index instead (which is a global seconday index), we can query all the members of a group as well.

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

# Get all the groups that Alice belongs to
pk_alice = db.PartitionKey(User, 'alice')
group_prefix = db.PrefixSortKey(Group)
alice_groups = table.query_prefix(pk_alice, group_prefix)

print(alice_groups)
# [{'SK': '1'}, {'SK': '2'}]

# Get all users in group two
pk_group_2 = db.PartitionKey(Group, '2')
user_prefix = db.PrefixSortKey(User)
inverse_index = db.InversePrimaryIndex()
members = table.query_prefix(pk_group_2, user_prefix, 
    global_index=inverse_index)

print(members)
# [{'PK': 'alice'}, {'PK': 'bob'}]
```

!!! note
    Check out the [Table Setup](table-setup.md) documentation to learn more about indices, primary keys and entity names.

