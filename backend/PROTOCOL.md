# Authentication

## POST /roster/add_user

### Input/POST Parameters

```json
{
  "first_name": non-empty string,
  "last_name": non-empty string,
  "role": employee/manager
}
```

* Valid login cookie expected  

### Output

```json
{
    "status": "success",
    "message": "User added to roster successfully"
    "data": {
      "first_name": non-empty string,
      "last_name": non-empty string,
      "role": employee,manager,
      "user_id": long user id to be given to new users to register
    }
}
``` 

### Notes on Implementation

* Managers can only create employees
* Another role, owner, can create managers, will need to manually add this account to the database

## POST /auth/register

### Input/POST Parameters

```json
{
  "email": valid-email,
  "user_id": valid-userid
  "first_name": non-empty string,
  "last_name": non-empty string,
  "password": >8 char string (will add more requirements later),
}
```

* The registration function can also be used to update any user data, email, first name, password, etc. The user ID is essentially the most powerful form of authentication

### Output

```json
{
    "status": "success",
    "message": "Registration successful"
}
```

## POST /auth/login

### Input/POST Parameters

```json
{
  email: valid-email,
  password: >8 char string (will add more requirements later)
}
```

### Output

```json
{
    "status": "success",
    "message": "Successful login."
}
```

& SessionID cookie for future logins and authenticated requests

# Future Plans
1. Create a database for all verified emails for registration as a manager/employee, currently all new users are managers
    * This database will serve as the backbone for the roster feature
2. Implement interactive quiz and training functionality and expand user data
