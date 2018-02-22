# node-red-contrib-august-home
Interface for August Home devices, such as the August Smart Locs, for Node-Red. This node connects to the August API, which appears to be mostly undocumented now. Excellent resources in the links below (from which the bulk of the api calls in this project were derived).

**Project Status:** basic functionality seems to be working. Now testing and tidying the module.

Still need to consider the way the node works, but for now, here is how to use it: In Node-Red, the input message payload should be a Javascript Object or JSON in the form `{ "group": "Group Name", "name" : "Request Name" }`. Any needed options for the request are set in the node's configuration, but additional one-off options can be passed in with the input data like this:
```json
{
    "group": "Group name from requests.json",
    "name": "Name of the request from requests.json",
    "options": {
        "Option Name": "Data",
        "Option Name": "Data"
    }
}
```
For example, to call the API to check for firmware updates, the node input could be:
```json
{
    "group": "Lock",
    "name": "Check for firmware updates",
    "options": {
        "LockId": "12345"
    }
}
```
See the `requests.json` file for all of the available commands that [jmaxxz](https://github.com/jmaxxz/) has discovered in his project (copied directly into this module). The node output message payload will be the body of the resulting API response.

Some Useful References:
* https://medium.com/@nolanbrown/the-process-of-reverse-engineering-the-august-lock-api-9dbd12ab65cb
* https://medium.com/@nolanbrown/august-lock-rest-apis-the-basics-7ec7f31e7874
* https://github.com/jmaxxz/keymaker/

To get your August API access token, follow the directions in jmaxxz's post here: https://github.com/jmaxxz/keymaker/issues/5#issuecomment-360007335

