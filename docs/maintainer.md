
## pack

Zips your `dist` directory and saves it in the `packages` directory.

```bash
$ gulp pack --vendor=firefox
```

## Version

Increments version number of `manifest.json` and `package.json`,
commits the change to git and adds a git tag.

```bash
$ gulp patch      // => 0.0.X
```

or

```bash
$ gulp feature    // => 0.X.0
```

or

```bash
$ gulp release    // => X.0.0
```
