  Add plugins using main package.json and adding plugins subfolders to 'workspaces':
  
```package.json
    {   
        ...
        "workspaces": [
            "bundles/*",
            "plugins/aws/*"
            ...
        ],
        ...
    }
```