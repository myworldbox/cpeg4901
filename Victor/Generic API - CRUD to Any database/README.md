# myapibox


Author - myworldbox


<a href="https://github.com/myworldbox"><img src="https://myworldbox.github.io/resource/image/portrait/VL_0.jpeg" align="left" height="150" width="150" ></a>

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

## customised typescript api

1. based on [ fastify / express ] framework

2. constructed with [ web socket ] support

3. self-defined and built-in cryptography function [ *key / myworldbox / sha256 / aes256 / rsa ]

4. crud integration with [ postgre_sql / mongodb / firebase / firestore / google sheet / redis ]

5. user verification and authentication with [ firebase ]

## rank by utility

- postgre_sql : (3d) -> database -> collection

- mongodb : (3d) -> database -> collection

- firebase : (3d) -> database -> collection

- firestore : (2d) -> collection

- google sheet : (2d) -> tab

- redis : (1d)

## Quick start

```bash
# clone repo
git clone https://github.com/myworldbox/myapibox.git

# download module
yarn

# start development
yarn start
```

## useful command

```bash
# quick github commit
yarn commit
```

## api

```bash
# function can be triggered by both GET / POST request
# fill the below variable with json format displayed below
# [ GET ] - req.query.eject
# [ POST ] - req.body

# root
/

# user verification and authentication - ( firebase )
/api/auth

# well-defined - ( *key / myworldbox / sha256 / aes256 / rsa ) function
/api/crypto

# database - ( postgre_sql / mongodb / firebase / firestore / google sheet / redis ) - [ CRUD ] operation
/api/database

# json visualization
/api/json
```

## essential json

```json
{
    "service": {
        "provider": "",
        "action": "",
        "password": "",
        "hash_target": [
            "password"
        ],
        "validation_target": [
            "email"
        ]
    },
    "data": {}
}
```

## full json

```json

```

## vercel deployment

routes are reduced to suite the 12 serverless function limits of vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/project?template=https://github.com/myworldbox/myapibox)
