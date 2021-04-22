# IQ96 web client

### Constant file needed (not provided in repo):

./src/constants.js

> export const IFRAME_URL = 'SOMEURL';
> export const SERVER_URL = 'IQ96_SERVER_URL';

### TODO

- User.js - When creating or updating user
- "Error" handling when iq_server returns either a UserResponse with an errormessage or an actual error

### ISSUES

- firebase token not refreshed in header of apolloclient. This means server is getting outdated token and can't validate user when accessing data
