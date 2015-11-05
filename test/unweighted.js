dt = require('../lib/decision-tree.js');

console.log(JSON.stringify(dt.create_decision_tree([{a:1,b:2,z:1},{a:1,b:3,z:1},{a:2,b:3,z:3}],'a', {min_gain:0.01}),null,2));

