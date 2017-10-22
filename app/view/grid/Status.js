/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Status
 */
Ext.define('Lada.view.grid.Status', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.statusgrid',

    requires: ['Ext.grid.filters.Filters'],
    plugins: 'gridfilters',

    maxHeight: 350,
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },

    recordId: null,
    readOnly: true,
    allowDeselect: true,
    statusWerteStore: null,
    statusStufeStore: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('statusgrid.emptyText');

        this.statusWerteStore = Ext.create('Lada.store.StatusWerte');
        this.statusWerteStore.load({
            params: {
                messungsId: this.recordId
            }
        });
        this.statusStufeStore = Ext.create('Lada.store.StatusStufe');
        this.statusStufeStore.load();

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            disabled: false,
            errorSummary: false,
            pluginId: 'rowedit',
            listeners: {
                beforeedit: function(editor, context, eOpts) {
                    if ( !context.record.phantom ||
                        ! context.grid.up('window').record.get('statusEdit')) {
                    //Check if edit is allowed, this is true, when the selected
                    // Record has an id (=is not new)
                    // or is not allowed to add records.
                        return false;
                    }
                }
            }
        });
        this.plugins = [this.rowEditing];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: i18n.getMsg('reset'),
                icon: 'resources/img/edit-redo.png',
                action: 'reset',
                probeId: this.probeId,
                parentId: this.parentId
            }, {
                text: i18n.getMsg('add'),
                icon: 'resources/img/list-add.png',
                action: 'add',
                probeId: this.probeId,
                parentId: this.parentId
            }]
        }];
        this.columns = [{
            header: i18n.getMsg('statusgrid.header.datum'),
            dataIndex: 'datum',
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            width: 110,
            sortable: false
        }, {
            header: i18n.getMsg('statusgrid.header.erzeuger'),
            dataIndex: 'mstId',
            renderer: function(value) {
                var r = '';
                if (!value || value === '') {
                    r = i18n.getMsg('error');
                }
                var mstore = Ext.data.StoreManager.get('messstellen');
                var item = mstore.getById(value);
                if (item) {
                    r = item.get('messStelle');
                }
                return r;
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('messstellenFiltered'),
                displayField: 'messStelle',
                valueField: 'id',
                allowBlank: false,
                queryMode: 'local',
                editable: false
            },
            sortable: false
        }, {
            header: i18n.getMsg('statusgrid.header.statusStufe'),
            dataIndex: 'statusKombi',
            renderer: function(value) {
                var kombi = Ext.data.StoreManager.get('statuskombi');
                var r = '';
                var item = kombi.getById(value);
                if (item) {
                    r = item.data.statusStufe.stufe;
                }
                return r;
            },
            editor: {
                xtype: 'combobox',
                store: this.statusStufeStore,
                queryMode: 'local',
                displayField: 'stufe',
                valueField: 'id',
                allowBlank: false,
                editable: false,
                forceSelection: true
            },
            sortable: false
        }, {
            header: i18n.getMsg('statusgrid.header.statusWert'),
            dataIndex: 'statusKombi',
            renderer: function(value) {
                var kombi = Ext.data.StoreManager.get('statuskombi');
                //This store is NOT used in the editor...
                var r = '';
                var item = kombi.getById(value);
                if (item) {
                    r = item.data.statusWert.wert;
                }
                return r;
            },
            editor: {
                xtype: 'combobox',
                store: this.statusWerteStore,
                queryMode: 'local',
                displayField: 'wert',
                valueField: 'id',
                allowBlank: false,
                editable: false,
                forceSelection: true
            },
            sortable: false
        }, {
            header: i18n.getMsg('statusgrid.header.text'),
            dataIndex: 'text',
            flex: 1,
            editor: {
                allowBlank: true,
                maxLength: 1000,
                enforceMaxLength: true
            },
            sortable: false
        }];
        this.initData();
        this.callParent(arguments);
        this.setReadOnly(true); //Grid is always initialised as RO
    },

    initData: function() {
        if (this.store) {
            this.store.removeAll();
        } else {
            this.store = Ext.create('Lada.store.Status',{
                sorters: [{
                    property: 'datum',
                    direction: 'ASC'
                }]
            });
        }

        this.store.load({
            params: {
                messungsId: this.recordId
            }
        });
    },

    setReadOnly: function(b) {
        if (b == true) {
            //Readonly
            this.down('button[action=add]').disable();
        } else {
            //Writable
            this.down('button[action=add]').enable();
        }
    },

    setResetable: function(b) {
        if (b == true) {
            this.down('button[action=reset]').enable();
        } else {
            this.down('button[action=reset]').disable();
        }
    }
});
