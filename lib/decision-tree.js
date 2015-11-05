var assert = require('assert');

function Stats() {
    function classify_by(data, attribute) {
        var ans = {};
        data.map(function(record){
            var key = record.attr[attribute];
            if (typeof(ans[key]) === 'undefined') {
                ans[key] = [record];
            } else {
                ans[key].push(record);
            }
        });
        return ans;
    }
    function get_total(data) {
        return data.map(function(point){return point.weight || 1;}).reduce(function(a,b){return a+b;},0);
    }
    function get_attribute_distribution(data, attribute) {

        var val_freq = {};
        var total = 0.0;
        data.map(function(record){
            var weight = Number(record.weight) || 1;
            if ((isNaN(weight)) || (weight <= 0)) return;
            if (typeof(val_freq[record.attr[attribute]]) === 'undefined') {
                val_freq[record.attr[attribute]] = weight;
            } else {
                val_freq[record.attr[attribute]] += weight;
            }
            total += weight;
        });
        Object.keys(val_freq).map(function(key){
            val_freq[key] /= total;
        });
        return val_freq;
    }
    function get_entropy(distribution){
        return Object.keys(distribution).map(function(key){
            var prob = distribution[key];
            return (-prob) * Math.log(prob);
        }).reduce(function(a,b){return a+b;},0.0);
    }
    function get_gain(data, attribute, target_attribute, /*optional*/ attribute_distribution, target_entropy) {
        // Look at what we have been given:
        attribute_distribution = attribute_distribution || get_attribute_distribution(data, attribute);
        if (Object.keys(attribute_distribution).length < 2) return 0;
        // This is the entropy we have to make smaller:
        target_entropy = target_entropy || get_entropy(get_attribute_distribution(data, target_attribute));
        // Any pain in using this variable?
        var classification_cost = 0; //get_entropy(attribute_distribution);
        var classified_data = classify_by(data, attribute);
        var subset_entropy = Object.keys(attribute_distribution).map(function(val){
            var val_prob = attribute_distribution[val];
            var data_subset = classified_data[val];
            var subset_distribution = get_attribute_distribution(data_subset, target_attribute);
            var subset_entropy = val_prob * get_entropy(subset_distribution);
            return subset_entropy;
        }).reduce(function(a,b){return a+b;},0.0);
        return target_entropy - (subset_entropy + classification_cost);
    }
    function choose_attribute(data, attributes, target_attribute, fitness_function, min_gain) {
        if (attributes.length < 2) return null;
        var best_gain = -1/0;
        var best_attribute = null;
        attributes.map(function(attribute){
            if (attribute === target_attribute) return;
            var gain = fitness_function(data, attribute, target_attribute);
            if ((gain > best_gain) && (attribute !== target_attribute)) {
                best_gain = gain;
                best_attribute = attribute;
            }
        });
        if (best_gain < min_gain) return null;
        else return {attribute:best_attribute, gain:best_gain};
    }
    function create_decision_tree(data, target_attribute, attributes, fitness_function, min_gain) {
        var total = get_total(data);
        var distribution = get_attribute_distribution(data, target_attribute);
        var entropy = get_entropy(distribution);
        var splitter = choose_attribute(data, attributes, target_attribute, fitness_function, min_gain);
        if (splitter === null) {
            return { result:null, sample_size:total, entropy:entropy, distribution:distribution};
        } else {
            var classified_data = classify_by(data, splitter.attribute);
            var subtree = {};
            var remaining_attributes = attributes.filter(function(attr){return attr != splitter.attribute;});
            Object.keys(classified_data).map(function(key){
                subtree[key] = create_decision_tree(classified_data[key], target_attribute, remaining_attributes, fitness_function, min_gain);
            });
            return { classifier:splitter.attribute
                   , gain:splitter.gain
                   , sample_size:total
                   , entropy:entropy
                   , distribution:distribution
                   , subtree:subtree
                   };
        }
    }
    // Front ends with lots of sanity checking but no serious logic:
    this.get_entropy = get_entropy;
    this.create_decision_tree = function(data, target_attribute, options) {
        assert(typeof(data) !== 'undefined', "Need an array of data!");
        assert(typeof(data.length) !== 'undefined', "Need an array of data!");
        assert(data.length > 0, "Data set is empty!");
        assert(typeof(target_attribute) !== 'undefined', "Need a target attribute!");
        // Set defaults:
        options = options || {};
        // What does that data look like?  The records should have a common form so examining
        // any one should do the trick:
        var sample = data[0];
        if (options.weighted) {
            assert(typeof(sample.attr) !== 'undefined', "Weighted records must be of the form {attr:attributes,weight:N}");
        } else {
            data = data.map(function(record){return {attr:record};});
        }
        sample = data[0].attr;
        var attributes;
        if (sample.length){
            attributes = options.attributes || sample.map(function(dummy,i){return i;});
        } else {
            attributes = options.attributes || Object.keys(sample);
        }
        var fitness_function = options.fitness_function || get_gain;
        var min_gain = typeof(options.min_gain) === 'undefined' ? -100 : options.min_gain;
        return create_decision_tree(data, target_attribute, attributes, fitness_function, min_gain);
    };
    this.fitness_functions =
    { get_gain: get_gain
    };
}

module.exports = new Stats();

// Example:
// dt = require('./js/stats.js');console.log(JSON.stringify(dt.create_decision_tree([{a:1,b:2,z:1},{a:1,b:3,z:1},{a:2,b:3,z:3}],'a', {min_gain:0.01}),null,2))
