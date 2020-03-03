---
title: Transactions - Dokklib-DB
description: Documentation on using DynamoDB transactions with Dokklib-DB.
---
# Transactions

## Isolation Levels

Isolation levels determine how concurrently running transactions interact with other transactions or operations.
DynamoDB provides serializable isolation between multiple transactions, and between transactions and operations that involve only one item, but there is only a read-committed guarantee for operations involving multiple items (eg. query or batch operations).

Serializable isolation means that concurrent operations on the same items can not succeed at the same time, thus ensuring a consistent state of the data at all times. The downside of this is that if multiple transactions, or a transaction and other operations try to write the same item concurrently, only one of them can succeed.

Read-committed isolation means that only the results of successful transactions can be read, but there is no guarantee when reading multiple items that a consistent snapshot of the data will be returned.
 For example, if a transaction updates item A and B, and you read those items in a query at the same time, you might see the updates from the transaction for item A, but not for item B.
 
 The [AWS DynamoDB docs](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html#transaction-isolation) have the full list of isolation levels for each operation.

## TransactWriteItems

`Table.transact_write_items` can execute a group of up to 25 operations that succeed or fail as a unit. We currently support the following operations:

- `DeleteArg`
- `InsertArg`
- `PutArg`
- `UpdateArg`

You can read more about these operations in the [write](./write.md) and [delete](./delete.md) items docs.

!!! note
    `ConditionCheck` has an [open feature request,](https://github.com/dokklib/dokklib-db/issues/4) please give it a thumbs up if you need it.
 
`Table.transact_write_items` corresponds to the `TransactWriteItems` DynamoDB API operation.

### Example
    
Suppose that our application allows creating groups of users and each group has an owner.
We structure group ownership data as follows in order to let us [query](./many-to-many.md) both the owner of a group and the group ownerships of a user efficiently:

PK             | SK
-------------- | ---------- 
GROUP#my-group        | GROUPOWNER#alice

Now if we want to change the owner of a group, we have to use a transaction, because we can't update the sort key of an item. 
Instead, we have to insert a new item and delete the old item atomically using a transaction.
Here is the example code to do that:


```python
import dokklib_db as db


class Group(db.EntityName):
    """Group entity name.

    Key value: unique group name, eg. 'my-group'.
    Example key: 'GROUP#my-group'.

    """

class GroupOwner(db.EntityName):
    """Group owner entity name.

    Key value: unique user name, eg. 'alice'.
    Example key: 'GROUPOWNER#alice'.

    """


table = db.Table('SingleTable')

pk_group = db.PartitionKey(Group, 'my-group')
sk_alice = db.SortKey(GroupOwner, 'alice')
sk_bob = db.SortKey(GroupOwner, 'bob')

op_args = [
    # We set idempotent=False to make it an error if Alice is not the group 
    # owner.
    db.DeleteArg(pk_group, sk_alice, idempotent=False),
    # Insert will fail if Bob is already the owner of the group.
    db.InsertArg(pk_group, sk_bob)
]

try:
    # Transfer group ownership from Alice to Bob.
    table.transact_write_items(op_args)
except db.errors.TransactionCanceledException as e:
    # Transaction was cancelled because an other operation tried to write one 
    # of the items at the same time.
    if e.has_error(db.errors.TransactionConflictException):
        print('Transaction conflict')
    # Transaction was cancelled because Alice isn't the owner of group
    # or Bob is already the owner.
    elif e.has_error(db.errors.ConditionalCheckFailedException):
        # We can determine which operation failed by examining the reasons.
        if e.reasons[0] is db.errors.ConditionalCheckFailedException:
            print('Alice is not the owner of the group')
        if e.reasons[1] is db.errors.ConditionalCheckFailedException:
            print('Bob is already the owner of the group')
    else:
        raise e

```

!!! note
    The cancellation reasons in `db.errors.TransactionCanceledException` are exception classes, not exception instances, because we don't get error responses for the individual reasons, and thus can not instantiate exceptions for the individual reasons.

## TransactGetItems

!!! note
    `TransctGetItems` is not implemented yet, but it has an [open feature request,](https://github.com/dokklib/dokklib-db/issues/1) please give it a thumbs up if you need it.
