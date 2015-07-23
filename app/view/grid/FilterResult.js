/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list the result of the Filter
 */
Ext.define('Lada.view.grid.FilterResult', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.filterresultgrid',

    requires: 'Lada.view.window.DeleteProbe',

    store: null, //'ProbenList',

    multiSelect: true,

    viewConfig: {
        emptyText: 'Keine Ergebnisse gefunden.',
        deferEmptyText: false
    },

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'tbtext',
                id: 'tbtitle',
                text: i18n.getMsg('probelist')
            },
            '->',
            {
                text: 'Probe erstellen',
                icon: 'resources/img/list-add.png',
                action: 'addProbe',
                disabled: false
            }, {
                text: 'Proben Importieren',
                icon: 'resources/img/svn-commit.png',
                action: 'import',
                disabled: false
            }, {
                text: 'Proben Exportieren',
                icon: 'resources/img/svn-update.png',
                action: 'export',
                disabled: true
            },
            '-',
            {
                text: 'Messprogramm erstellen',
                icon: 'resources/img/list-add.png',
                action: 'addMessprogramm',
                disabled: true
            }, {
                text: 'Proben generieren',
                icon: 'resources/img/view-time-schedule-insert.png',
                action: 'genProbenFromMessprogramm',
                disabled: true
            }]
        }];
        this.columns = [];
        this.callParent(arguments);
    },

    /**
     * This sets the Store of the FilterResultGrid
     */
    setStore: function(store){
        var i18n = Lada.getApplication().bundle;

        this.removeDocked(Ext.getCmp('ptbar'), true);
        this.reconfigure(store);
        this.addDocked([{
            xtype: 'pagingtoolbar',
            id: 'ptbar',
            dock: 'bottom',
            store: store,
            displayInfo: true
        }]);

        //Configure the Toolbar.
        this.setMode(store);
    },

    /**
     * Enables or disables Toolbar-Buttons according to the selected mode
     */
    setMode: function(store) {
        var t = Ext.getCmp('tbtitle');
        var i18n = Lada.getApplication().bundle;
        if (store.model.modelName == 'Lada.model.ProbeList'){
            t.setText(i18n.getMsg('probelist'));
            this.down('button[action=addMessprogramm]').disable();
            this.down('button[action=genProbenFromMessprogramm]').disable();
            this.down('button[action=addProbe]').enable();
            this.down('button[action=import]').enable();
            this.down('button[action=export]').enable();
        }
        else if (store.model.modelName == 'Lada.model.MessprogrammList') {
            t.setText(i18n.getMsg('probeplanning'));
            this.down('button[action=addMessprogramm]').enable();
            this.down('button[action=genProbenFromMessprogramm]').enable();
            this.down('button[action=addProbe]').disable();
            this.down('button[action=import]').disable();
            this.down('button[action=export]').disable();
        }
        else {
            t.setText('');
            console.log('The model '+store.model.modelName+
                'was not defined in the FilterResultGrid.' +
                ' Hence the title could not be set.');
        }
    },

    /**
     * Setup columns of the Grid dynamically based on a list of given cols.
     * The function is called from the {@link Lada.controller.Filter#search
     * search event}
     * The Images for the Read-Write Icon are defined in CSS
     */
    setupColumns: function(cols) {
        var resultColumns = [];
        var fields = [];

        fields.push(new Ext.data.Field({
            name: 'owner'
        }));
        fields.push(new Ext.data.Field({
            name: 'readonly'
        }));

        resultColumns.push({
            xtype: 'actioncolumn',
            text: 'RW',
            dataIndex: 'readonly',
            sortable: false,
            tooltip: 'Probe öffnen',
            width: 30,
            getClass: function (val, meta, rec) {
                return rec.get('readonly') === false ? "edit" : "noedit";
            },
            handler: function(grid, rowIndex, colIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                grid.fireEvent('itemdblclick', grid, rec);
             }
        });

        for (var i = cols.length - 1; i >= 0; i--) {
            if (cols[i] === 'id') {
                continue;
            }
            resultColumns.push(cols[i]);
            fields.push(new Ext.data.Field({
                name: cols[i].dataIndex
            }));
        }
        if (this.store.$className == 'Lada.store.ProbenList') {
            // Add a Delete-Button
            // TODO: Might need to be extended to Messprogramme
            resultColumns.push({
                xtype: 'actioncolumn',
                text: 'Aktion',
                sortable: false,
                width: 30,
                items: [{
                    icon: 'resources/img/edit-delete.png',
                    tooltip: 'Löschen',
                    isDisabled: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        if ( rec.get('readonly') || !rec.get('owner')) {
                            return true;
                        }
                        return false;
                    },
                    handler: function(grid, rowIndex, colIndex){
                        var rec = grid.getStore().getAt(rowIndex);

                        var winname = 'Lada.view.window.DeleteProbe';
                        var win = Ext.create(winname, {
                            record: rec,
                            parentWindow: this
                        });
                        win.show();
                        win.initData();
                    }
                }]
            });
        }
        this.store.model.setFields(fields);
        this.reconfigure(this.store, resultColumns);
    }
});
