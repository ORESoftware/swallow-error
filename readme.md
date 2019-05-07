

### Swallow-error - this main.js file will swallow the thrown error

> No need to install node_modules - they are in version control

simply run:

```bash
node . ; echo $?
```

you will notice the exit code is 0. There is no error trace from the thrown error on line 55.