/**
 * applies the groupBy operation to an array 
 * @param {any[]} array the target of the groupBy operation
 * @param {string | (any) => any } keyGetter name of the grouping key or function to generate a grouping key from each array element
 * @returns {object} an object where the key is the value extracted with the keyGetter and value is an array of objects that have that key in common
 * @example 
 * let people = [
 *  {name: 'Ana', gender:'F'},
 *  {name: 'Dan', gender:'M'},
 *  {name: 'Linda', gender:'F'},
 *  {name: 'Taylor', gender:'N/A'}    
 * ]
 *  groupBy(people, 'gender')
 *  // returns:
 *  {
 *      'f' : [{name: 'Ana', gender:'F'}, {name: 'Linda', gender:'F'}],
 *      'm' : [{name: 'Dan', gender:'M'}]
 *      'N/A' : [{name: 'Taylor', gender:'N/A'} ]
 *  }
 */
function groupBy(array, keyGetter) {
    return array.reduce(function(result, current) {
        let key = keyGetter instanceof Function ? keyGetter(current) : current[keyGetter];
        result[key] = result[key] || []
        result[key].push(current)
        return result
    }, {});
};

  module.exports = {groupBy}