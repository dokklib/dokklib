---
title: Delete Item - Dokklib-DB
description: Documentation on deleting an item from DynamoDB with Dokklib-DB.
---
# Delete an Item

Deleting an item requires knowing its composite primary key (`PK` and `SK`).

Suppose that we want to remove a user from a group.
If we store the group membership as follows:

PK             | SK            
-------------- | ------------- 
USER#alice     | GROUP#my-group

We can remove the user from the group like this:

```python
import dokklib_db as db


class User(db.EntityName):
    """User entity name.

    Key value: unique user name, eg. 'alice'.
    Example key: 'USER#alice'.

    """


class Group(db.EntityName):
    """Group entity name.

    Key value: unique group name.
    Example key: 'GROUP#my-group'.

    """


table = db.Table('SingleTable')

pk = db.PartitionKey(User, 'alice')
sk = db.SortKey(Group, 'my-group')
table.delete(pk, sk)
```

`Table.delete` is idempotent by default, which means that deleting a non-existent item will succeed without an error.
If we want to be notified if the item doesn't exist, we can set `idempotent=False`:

```python
try:
    table.delete(pk, sk, idempotent=False)
except db.ConditionalCheckFailedError:
    print(f'User "{pk.value}" is not a member of group "{sk.value}"')
```

`Table.delete` corresponds to the `DeleteItem` DynamoDB API operation.

!!! note
    Check out the [Table Setup](table-setup.md) documentation to learn more about primary keys and entity names.
