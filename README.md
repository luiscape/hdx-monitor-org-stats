## Calculate the Statistics of Organizations
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
    "organization": "foo-bar",
    "result": {
        "users": {
            "total": 6,
            "admins": 4,
            "editors": 0,
            "members": 2,
            "details": {
                "admins": ["dabo", "djiguiba", "ouane", "sekou"],
                "editors": [],
                "members": ["guido", "olivieruzel"]
            }
        },
        "datasets": {
            "total": 22,
            "views": {
                "total": 2657,
                "recent": 205,
                "mean": 121,
                "details": [
                  {
                    "id": "236bcfcb-e05e-4b8b-8df0-e62d133828e5",
                    "name": "Mali - Population Statistics 2013",
                    "views": 21
                  },
                  ...
                  ]
            },
            "downloads": {
                "total": 608,
                "recent": 147,
                "mean": 28,
                "details": [
                  {
                    "id": "236bcfcb-e05e-4b8b-8df0-e62d133828e5",
                    "name": "Mali - Population Statistics 2013",
                    "downloads": 0
                  },
                  ...
                  ]
            }
        }
    }
}


```

### Docker Usage
[![](https://badge.imagelayers.io/luiscape/hdx-monitor-org-stats:latest.svg)](https://imagelayers.io/?images=luiscape/hdx-monitor-org-stats:latest 'Get your own badge on imagelayers.io')

Run the docker command below passing your CKAN API key as the environment variable `DEFAULT_API_KEY`.

```shell
$ docker run -d --name org_stats \
  -e DEFAULT_API_KEY=foo \
  luiscape/hdx-monitor-org-stats:latest
```

### Coding Standard
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
