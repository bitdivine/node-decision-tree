dt = require('../lib/decision-tree.js');

var data =
[ [0,1,2]
, [1,1,3]
, [1,1,3]
, [1,1,3]
, [0,1,4]
, [1,1,5]
, [1,1,5]
];

console.log(JSON.stringify(dt.create_decision_tree(data,0, {min_gain:0.01,max_depth:0}),null,2));

