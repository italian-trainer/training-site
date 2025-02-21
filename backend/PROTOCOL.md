# Authentication

## POST /auth/register

### Input/POST Parameters

```json
{
  "email": valid-email,
  "first_name": non-empty string,
  "last_name": non-empty string,
  "password": >8 char string (will add more requirements later),
}
```

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
