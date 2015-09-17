## HDX Monitor Service to Calculate the Stats of Organizations
At times, an organization would like to know general stats about how their datasets are doing. CKAN's base functionality doesn't provide a total count of downloads that datasets and resources have much less a time-series of how they are performing. This service addresses those needs by creating a simple HTTP JSON API that both calculate and tracks that functionality.

[![Build Status](https://travis-ci.org/luiscape/hdx-monitor-org-stats.svg)](https://travis-ci.org/luiscape/hdx-monitor-org-stats) [![Coverage Status](https://coveralls.io/repos/luiscape/hdx-monitor-org-stats/badge.svg?branch=master&service=github)](https://coveralls.io/github/luiscape/hdx-monitor-org-stats?branch=master)

### Usage
The API has the following working methods:

* `/[ORGANIZATION_ID]` **GET**: Retrieves statistics about an organization in CKAN.

Example request:
```shell
$ curl -X GET localhost:2000/foo-bar
```

The output will then be:

```json
{
    "success": true,
    "message": "Fetched organization information successfully.",
    "result": {
        "organization": "foo-bar",
        "users": {
            "count": 6,
            "ids": null,
            "editors": 0,
            "admins": 4,
            "members": 2
        },
        "datasets": {
            "count": 22
        },
        "downloads": {
            "total": 2619,
            "details": [
              {
                "id": "4037c956-8c24-45a0-9150-0235b17eb522",
                "name": "Foo Bar dataset",
                "downloads": 47
              },
              ...
            ]
        }
    }
}

```

### Docker Usage
Run the docker command below passing your CKAN API key as the environment variable 'DEFAULT_API_KEY'.

```shell
$ docker run -d --name org_stats \
  -e DEFAULT_API_KEY=foo \
  luiscape/hdx-monitor-org-stats:latest
```

### Coding Standard
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
