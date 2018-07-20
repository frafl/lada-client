/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for selecting items per page on pagingToolbars
 */
Ext.define('Lada.view.widget.PagingSize', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pagingsize',
    layout: 'hbox',
    baseCls: 'x-box-inner',

    items: [{
        xtype: 'combobox',
        allowBlank: false,
        forceSelection: true,
        displayField: 'label',
        valueField: 'value',
        submitValue: false,
        queryMode: 'local',
        width: 60,
        disableKeyFilter: true,
        editable: false,
        onChange: function(newVal, oldVal) {
            if (newVal === oldVal) {
                return;
            }
            Lada.getApplication().setPagingSize(parseInt(newVal));
            var tb = this.up('pagingtoolbar');
            if (tb) {
                var pageStore = tb.getStore();
                if (pageStore) {
                    pageStore.setPageSize(newVal);
                }
                tb.doRefresh();
            }
        }
    }, {
        xtype: 'tbtext'
    }],

    refreshPagingSize: function() {
        this.down('combobox').select(Lada.pagingSize);
    },

    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        this.down('tbtext').text = i18n.getMsg('grid.itemsperpage');
        Lada.getApplication().on('pagingSizeChanged', me.refreshPagingSize, this);
        me.store = Ext.StoreManager.get('pagingSizes');
        this.callParent(arguments);
        this.down('combobox').getTriggers().clear.hidden = true;
        this.down('combobox').setStore(this.store);
        this.down('combobox').select(Lada.pagingSize);
    }
});

