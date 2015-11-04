
# API
### `create_decision_tree(data, target_attribute, options={})`


`data` is an array of records.  This may be a simple dictionary of attribute-value pairs: {whatever:12, else:99} or it may be a complete record of the type used by dt internally: {weight:100, attr:{whatever:12, else:99}}.  If you use the latter form you must tell dt by setting `option.weighted=true`.

`target_attribute` is the attribute we wish to understand.

`options`:

*	`attributes` are the terms in which we wish to understand the target attribute.

*	`fitness_function==get_gain`

*	`min_gain==-100`

