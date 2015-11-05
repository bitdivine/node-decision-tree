decision-tree
=============

Reasonably fast discrete decision tree.  Useful for:

* Diagnosing under what circumstances X happens.

# Installation:
	npm require fast-decision-tree

# Usage:

	var dt = require('fast-decision-tree');
	var data =
	[ {a:1,b:2,z="pink"}
	, {a:3,b:1,z="violet"}
	, {a:9,b:2,z="pink"}
	];
	var tree = dt.create_decision_tree(data,'z');
	console.log(JSON.stringify(tree,null,2));

# API
### `create_decision_tree(data, target_attribute, options={})`


`data` is an array of records.  Each may be a simple dictionary of attribute-value pairs: {whatever:12, else:99} or it may be a complete record of the type used by the decision tree internally: {weight:100, attr:{whatever:12, else:99}}.  If you use the latter form you must tell dt by setting `option.weighted=true`.

`target_attribute` is the attribute we wish to understand.

`options`:

*	`attributes` are the terms in which we wish to understand the target attribute.

*	`fitness_function(data, attribute, target_attribute)==get_gain`
	This is a function that returns the improvement or gain, e.g. the reduction in entropy,
	that would be provided if we branch on `attribute`.  Here `data` comes in the internal
	format described previously.
	The default fitness function is `require('fast-decision-tree').fitness_functions.get_gain`.

*	`min_gain==-100`
	Don't bother branching if the gain is below this value.
