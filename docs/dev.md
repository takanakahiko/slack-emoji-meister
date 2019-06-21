# Develop

## Installation

```bash
$ npm install
```



## Usage

```bash
$ npm run dev --help
$ npm run dev chrome
$ npm run dev firefox
$ npm run dev opera
$ npm run dev edge
```

## Globals

The build tool also defines a variable named `process.env.NODE_ENV` in your scripts. It will be set to `development` unless you use the `--production` option.


**Example:** `./app/background.ts`

```typescript
if(process.env.NODE_ENV === 'development'){
  console.log('We are in development mode!');
}
```
