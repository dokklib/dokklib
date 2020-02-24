# Write Items

Write operations can either create a new item or change an existing item.
For transactional writes, check out the [Transaction](./transactions.md) docs.

## Put

`Table.put` either creates a new item or replaces an existing item with the supplied attributes.

Suppose we want to add a user to a new group and we don't care if the user is already part of that group.
The following code adds the user to the group:

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
table.put(pk, sk, attributes={'SomeAttribute': 2})
```

Resulting in the item below:

PK             | SK            | SomeAttribute | CreatedAt 
-------------- | ------------- | ------------- |-------------
USER#alice     | GROUP#my-group| 2             | 2020-02-15T19:09:38

`Table.put` corresponds to the `PutItem` DynamoDB API operation.

!!! note
    `PutItem` operations in Dokklib-DB automatically add a `CreatedAt` attribute to the item that is set to the current ISO timestamp (without microseconds).


## Insert

`Table.insert` tries to create a new item and raises a `ConditionalCheckFailedError` if the item already exists.

Suppose we wanted to add a user to a group as in the [Put](#put) example, but we wanted the operation to fail if the user was already a member of that group. We could then use the following code:

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

try:
    table.insert(pk, sk, attributes={'SomeAttribute': 2})
except db.ConditionalCheckFailedError:
    print(f'User "{pk.value}" is already a member of group "{sk.value}"')
```

`Table.insert` corresponds to a `PutItem` DynamoDB API operation with an `attribute_exists(PK)` conditional check.

## Update

TODO (abiro)

!!! note
    Check out the [Table Setup](table-setup.md) documentation to learn more about primary keys and entity names.
