dt = require('../lib/decision-tree.js');

console.log(JSON.stringify(dt.create_decision_tree([{attr:{a:1,b:2,z:1},weight:5},{attr:{a:1,b:3,z:1},weight:9},{attr:{a:2,b:3,z:3},weight:1}],'a', {min_gain:0.01, weighted:true}),null,2))

