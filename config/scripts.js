// Make merged array unique
Array.prototype.unique = function() {
    var array = this.concat();
    for(var i = 0; i < array.length; ++i) {
        for(var j = i + 1; j < array.length; ++j) {
            if(array[i] === array[j])
                array.splice(j--, 1);
        }
    }

    return array;
};

module.exports = {
    'wp-content/plugins/tmhk-plugin/assets/dist/frontend.js': [
        'wp-content/plugins/tmhk-plugin/assets/js/library/jquery.bquery.min.js',
        'wp-content/plugins/tmhk-plugin/assets/js/library/jquery.cookie.min.js',
        'wp-content/plugins/tmhk-plugin/assets/js/library/jquery.sticky.js',
        'wp-content/plugins/tmhk-plugin/assets/js/tmhk.js'
    ]
};