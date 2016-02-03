# ms-cli

cli for running commands against microservices and printing the responses

```sh
Usage: ms-cli --q.offset=0 --q.limit=10 -p payments.transactions.common
-h rabbitmq -p 5672 | bunyan -o short

Options:
  -p, --port     rabbitmq port                                   [default: 5672]
  -h, --host     rabbitmq host                            [default: "localhost"]
  -r, --route    rabbitmq routing key                                 [required]
  -q             query object                                      [default: {}]
  -t, --timeout  request timeout                                [default: 15000]
```

