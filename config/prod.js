module.exports = {
  'CkanInstance': 'https://data.hdx.rwlabs.org',
  'ApiKey': process.env.DEFAULT_API_KEY || null,
  'version': 'v.0.3.3',
  'repository': 'https://github.com/luiscape/hdx-monitor-org-stats',
  'DataFolder': 'data',
  'database': [
    {
      'name': 'historic',
      'schema': {
        'organization': 'TEXT',
        'date': 'TEXT',
        'number_of_datasets': 'INTEGER',
        'total_views': 'INTEGER',
        'recent_views': 'INTEGER',
        'mean_views': 'INTEGER',
        'total_downloads': 'INTEGER',
        'recent_downloads': 'INTEGER',
        'mean_downloads': 'INTEGER'
      }
    }
  ]
}
