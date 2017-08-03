# @microfleet/cli

CLI for running commands against AMQP transport in @microfleet/core services.

```sh
Usage: bin/ms-cli.js --q.offset=0 --q.limit=10 -r payments.transactions.common

Options:
  --port, -p      rabbitmq port                                  [default: 5672]
  --host, -h      rabbitmq host                           [default: "localhost"]
  --login, -l     rabbitmq user                               [default: "guest"]
  --password, -P  rabbitmq password                           [default: "guest"]
  --route, -r     rabbitmq routing key                                [required]
  --query, -q     query object                                     [default: {}]
  --timeout, -t   request timeout                               [default: 15000]
  --config        Path to JSON config file
  --help          Show help                                            [boolean]
```

## Usage example

Assuming you are running node 8.x.x, where `npx` is bundled you can do the following
to run commands against AMQP-enabled endpoints

```sh
$ docker exec -it <@microfleet/container-name> sh
$ npx @microfleet/cli -r pdf.render -q '{"meta":false,"context":{},"template":"sample"}'
```

Response will be printed to stdout/stderr based on success/failure of the request
In the real-world you'd likely want to run some less complicated requests or prepare them
elsewhere and just use this cli to issue requests so that they end up correctly serialized
and response is then correctly deserialized and printed
