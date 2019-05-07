#!/usr/bin/env node
'use strict';

const assert = require('assert');
const cp = require('child_process');
const {JSONParser} = require('@oresoftware/json-stream-parser');


process.on('uncaughtException', err => {
    console.error('uncaughtException:', {err});
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    console.error('unhandledRejection:', reason);
    process.exit(1);
});


console.log('Running test', __filename);

const k = cp.spawn('bash');
const foo = 'medicine';

k.stdin.end(`

  foo="${foo}"
  
  cat <<EOF
  
  {"foo":"$foo"}    ∆∆
  {"foo":"$foo"} ∆
  ∆{"foo":"$foo"}∆
  {"foo":"$foo"}      ∆
  
  EOF

`);

const to = setTimeout(() => {
    console.error('did not receive parsed JSON object within alloted time.');
    process.exit(1);
}, 2000);


let count = 0;

k.stdout.pipe(new JSONParser({delimiter:'∆'})).on('data', d => {

    count++;

    if(count > 3){

        console.error('HELLLLOOOOO:',{count});
        throw new Error('too many json blobs.');  // this never gets caught, no evidence of it whatsoever...!
    }

    if(count === 3){

        setTimeout(() => {

            clearTimeout(to);
            try {
                assert.deepStrictEqual(d, {foo: foo});
                process.exit(0);
            }
            catch (err) {
                console.error(err.message);
                process.exit(1);
            }

        },1000);

    }


});