/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Orte Stammdaten
 */
Ext.define('Lada.view.grid.verwaltungseinheiten', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.verwaltungseinheitengrid',
    requires: ['Ext.grid.filters.Filters'],

    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,
    store: Ext.data.StoreManager.get('verwaltungseinheiten'),

    plugins: 'gridfilters',
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true,
    },
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('grid.emptyGrid');
        var me = this;
        this.columns = [{
            header: 'Code', // i18n.getMsg(TODO)
            dataIndex: 'id'
        }, {
            header: 'Name', //i18n.getMsg(TODO)
            dataIndex: 'bezeichnung',
            align:'left',
            flex: 1
        }];
        this.store.on('filterchange', function(store){
            var tb = me.down('pagingtoolbar');
            if (tb){
                var count = me.store.getCount();
                tb.afterPageText = 'von ' + Math.ceil(count / me.store.pageSize);
                tb.displayMsg = 'Zeige Eintrag {0} - {1} von ' + count;
                tb.onLoad();
            }
        });
        this.callParent(arguments);
    },

    /**
     * This sets the Store of this Grid
     */
    setStore: function(store){
        if (store) {
            this.reconfigure(store);
            this.setTitle(
                'Verwaltungseinheiten (' + store.getCount() + ')');
        }
    }
});
