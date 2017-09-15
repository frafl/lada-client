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
    alias:'widget.pagingsize',
    layout: 'hbox',
    baseCls: 'x-box-inner',

    items : [{
        xtype: 'combobox',
        allowBlank: false,
        forceSelection: true,
        displayField: 'label',
        valueField: 'value',
        submitValue: false,
        store: Ext.StoreManager.get('pagingSizes'),
        queryMode: 'local',
        width: 60,
        disableKeyFilter: true,
        onChange: function(newVal, oldVal){
            Lada.pagingSize = parseInt(newVal);
            var tb = this.up('pagingtoolbar');
            if (tb){
                tb.doRefresh();
            }
        }
    }, {
        xtype: 'tbtext',
        text: ' Einträge pro Seite'
    }],

    initComponent: function(){
        this.callParent(arguments);
        this.down('combobox').setValue(Lada.pagingSize);
    }
});

