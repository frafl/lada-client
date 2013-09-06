/**
 * Helper class
 * This class provides some globally used functions.
*/
Ext.define('Lada.lib.Helpers', {
    statics: {
        /**
         * Function to translate a timestamp into a date
         */
        ts2date: function(v, record){
            // Converts a timestamp into a date object.
            if (v === null || v === undefined) {
                return v;
            }
            return new Date(v);
        }
    }
})
