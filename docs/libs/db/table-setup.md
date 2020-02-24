# Table Setup

## Table Objects

Dokklib-DB is centered around the `Table` class that exposes DynamoDB operations with a friendly interface designed to make the single table pattern easy. You can create a `Table` object as follows:

```python
import dokklib_db as db


table = db.Table('MySingleTable')
```

## Primary Keys

Dokklib-DB assumes by default that the DynamoDB table has a composite key schema where the string `HASH` key's name is `PK` and the string `RANGE` key's name is `SK`. Corresponding CloudFormation template snippet:

```yaml
Resources:
    SingleTable:
        Type: AWS::DynamoDB::Table
        Properties:
          KeySchema:
            -
              AttributeName: "PK"
              KeyType: "HASH"
            -
              AttributeName: "SK"
              KeyType: "RANGE"
          AttributeDefinitions:
            -
              AttributeName: "PK"
              AttributeType: "S"
            -
              AttributeName: "SK"
              AttributeType: "S"
```

The default key names can be overridden by providing a custom primary index when creating a `Table`:

```python
import dokklib_db as db


class MyPrimaryIndex(db.GlobalIndex):
    @property
    def primary_key(self):
        return 'MyPrimaryKeyName'

    @property
    def sort_key(self):
        return 'MySortKeyName'


table = db.Table('MySingleTable', primary_index=MyPrimaryIndex())

```

## Global Secondary Indices

Global secondary indices can be supplied as arguments to `Table.query` and `Table.query_prefix` to make relational queries. Your table should have at least one global secondary index that provides an inverse view of the primary index. Example inverse index Cloudformation snippet:

```yaml
Resources:
  SingleTable:
    Type: AWS::DynamoDB::Table
    Properties:
      # Inverse primary index for querying relational data.
      GlobalSecondaryIndexes:
        -
          IndexName: "GSI_1"
          KeySchema:
            -
              AttributeName: "SK"
              KeyType: "HASH"
            -
              AttributeName: "PK"
              KeyType: "RANGE"
          Projection:
            ProjectionType: "KEYS_ONLY"
```

Dokklib-DB provides a secondary index implementation for convenience that corresponds to `GSI_1` in the snippet from above as `dokklib_db.InverseGlobalIndex`. You can define your own secondary indices as follows:

```python
import dokklib_db as db


class MyGlobalSecondaryIndex(db.GlobalSecondaryIndex):
    @property
    def name(self):
        return 'MyIndexName'

    @property
    def partition_key(self):
        return 'MyIndexPartitionKey'

    @property
    def sort_key(self):
        return 'MyIndexSortKey'

```

## Entity Prefixes

The DynamoDB single table pattern uses index overloading to make relational queries for different entity types. This is why the composite key names are the generic `PK` and `SK`, and to keep things orderly, key values are prefixed with their entity names. For example, if we had a table with user, address, product and order entities, the items would have the following prefixes:


PK             | SK 
-------------- | ------------- 
ORDER#1        | USER#alice
ORDER#1        | PRODUCT#book
ORDER#1        | PRODUCT#cd
ORDER#2        | USER#bob
ORDER#2        | PRODUCT#book
USER#alice     | ADDRESS#unique-home-address

Dokklib-DB supports this pattern by requiring that keys for database queries are specified via the `PartitionKey`, `SortKey` or `PrefixSortKey` classes. These key classes take an entity name class as the first argument and the string key value as the second argument. The following snippet demonstrates how we would get the first item from the table above:

```python
import dokklib_db as db


class Order(db.EntityName):
    """Order entity name.

    Key value: unique order id.
    Example key: 'ORDER#1'.

    """


class User(db.EntityName):
    """User entity name.

    Key value: unique user name, eg. 'alice'.
    Example key: 'USER#alice'.

    """


pk = db.PartitionKey(Order, '1')
print(str(pk))
# ORDER#1

sk = db.SortKey(User, 'alice')
print(str(sk))
# USER#alice

item = db.Table('SingleTable').get_item(pk, sk)
print(item)
# {'PK': '1', 'SK': 'alice'}

```

Requiring entity names to be Python classes brings us two things: First, it prevents data corruption from typos, and second, it gives us documentation of our entities. Best practice is to put all your entity name definitions into a single file in your project (eg. `entities.py`).

!!! note
    `Table` methods that return items from DynamoDB automatically strip entity name prefixes from string values of top level keys.
    
## Time to Live

TODO (abiro)

## Cloudformation Template

You can use the [Cloudformation template](https://github.com/dokklib/dokklib-db/blob/master/tests/integration/cloudformation.yml) from the Dokklib-DB integration tests to set up your DynamoDB single table. 
If you use this template for anything other than testing, make sure to change the table's `DeletionPolicy` and `UpdateReplacePolicy` attributes from `Delete` to `Retain`.



