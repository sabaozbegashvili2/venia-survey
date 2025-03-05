# Medical survey task

### Note
In order the FE code to work out, we'll need either to have Magento 2 BE GQL's exposed
or I've placed DUMMY data in talon, so the popup can appear and viewed.

The quick plan how I'd implement BE functionality as well
1. Create brand new module (won't dive into how to create module)
2. Create system.xml configuration to have three fields:
  1. Popup heading which would be text
  2. Form title which would also be text
  3. questions which would be AbstractFieldArray (it would make field like a simple grid where you would specify as much questions as you want)
4. create config.xml if there is some defaults for those fields
5. create schema.graphqls where you'd define the shape of query and mutation
6. implement query/mutation resolvers accordingly

## Installation

1. yarn create @magento/pwa
2. cd your_project_name
3. copy @sabavend folder to your_project_name
4. yarn add dompurify
5. run command from your_project_name dir:
  - for development: `yarn add link:./@sabavend/questionnaire`
  - for production: `yarn add file:src/@sabavend/questionnaire`
6. add module in trusted vendors ex:
```json
{
  "pwa-studio": {
    "targets": {
      "intercept": "./local-intercept.js"
    },
    "trusted-vendors": [
      "@sabavend"
    ]
  }}
```
7. run yarn watch
   - if getting "(node:59260) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead error" , then:
   ```json
   export NODE_OPTIONS=--openssl-legacy-provider
   yarn watch
```
