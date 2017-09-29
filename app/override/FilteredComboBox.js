/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.override.FilteredComboBox', {
    override: 'Ext.form.field.ComboBox',
    alias: 'widget.filteredcombobox',
    anyMatch: true,
    /* TODO: doQuery disturbs doLocalQuery in ways not yet fully understood
    doQuery: function(queryString, forceAll) {
        this.expand();
        this.store.clearFilter(!forceAll);
        if (!forceAll) {
            this.store.filter(this.displayField,
                    new RegExp(Ext.String.escapeRegex(queryString), 'i'));
        }
    },
*/
    /* Overwrites the ExtJS local query with a filter that does the following:
        * 1. Partial matches will still return true
        * 2. not case sensitive
        * 3. Will look either in "displayField" and in "searchValueField"
        * or (if latter non existant) in "ValueField".
        */
    doLocalQuery: function(queryPlan){
        var me = this,
            queryString = queryPlan.query,
            store = me.getStore(),
            value = queryString,
            filter;
        me.clearLocalFilter();
        if (queryString) {
            if (me.enableRegEx) {
                try {
                    value = new RegExp(value);
                } catch(e) {
                    value = null;
                }
            }
            if (value !== null) {
                value = value.toString().toLowerCase();
                me.changingFilters = true;
                filter = me.queryFilter = Ext.create('Ext.util.Filter', {
                    id: me.id + '-filter',
                    filterFn: function(candidate){
                        var display = candidate.data[me.displayField].toString().toLowerCase();
                        if (display.indexOf(value) > -1){
                            return true;
                        }
                        var secondarySearchField = me.searchValueField || me.valueField;
                        var val = candidate.data[secondarySearchField].toString().toLowerCase();
                        if (val.indexOf(value) > -1){
                            return true;
                        }
                        return false;
                    },
                    root: 'data',
                    value: value
                });
                store.addFilter(filter, true);
                me.changingFilters = false;
            }
            if (me.store.getCount() || me.getPicker().emptyText) {
                me.getPicker().refresh();
                me.expand();
            } else {
                me.collapse();
            }
            me.afterQuery(queryPlan);
        }
    }
});

