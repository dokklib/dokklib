# Get an Item

Getting an item requires knowing its composite primary key (`PK` and `SK`) .

Suppose we want to get the date of an order by a user and we know the order id.
Then if we have the following data in the table:

PK             | SK            | CreatedOn 
-------------- | ------------- |-------------
USER#alice     | ORDER#1       | 2020-02-24

We can get the item with `Table.get` as follows:

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
sk = db.SortKey(Order, '1')
item = table.get(pk, sk, attributes=['CreatedOn'])
print(item)
# {'CreatedOn': '2020-02-24'}
```



`Table.get` corresponds to the `GetItem` DynamoDB API operation which is eventually consistent by default. This means that we are not guaranteed to read the latest version of an item, but if we repeat the read and no write occurs, we will eventually receive the latest version. If we need to read the latest version of the item, we can set `consistent=True` in `Table.get`:

```python
item = table.get(pk, sk, consistent=True)
```

This is called a strongly consistent read. The downside of strongly consistent reads is that they take longer, cost more and may fail due to a temporary degradation in DynamoDB when an eventually consistent read would succeed.



!!! note
    Check out the [Table Setup](table-setup.md) documentation to learn more about primary keys and entity names.
    
