/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Probenehmer Stammdaten
 */
Ext.define('Lada.view.grid.Probenehmer', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.probenehmergrid',

    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },

    warnings: null,
    errors: null,
    readOnly: true,
    allowDeselect: true,
    border: false,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('pn.emptyGrid');

        // TODO: Which docked Items are required?
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'tbtext',
                id: 'tbtitle',
                text: i18n.getMsg('pn.gridTitle')
            }]
        }];
        this.columns = [{
            header: i18n.getMsg('netzbetreiberId'),
            dataIndex: 'netzbetreiberId',
            renderer: function(value) {
                var r = '';
                if (!value || value === '') {
                    r = 'Error';
                }
                var store = Ext.data.StoreManager.get('netzbetreiber');
                var record = store.getById(value);
                if (record) {
                  r = record.get('netzbetreiber');
                }
                return r;
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('netzbetreiber'),
                displayField: 'netzbetreiber',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('bearbeiter'),
            dataIndex: 'bearbeiter',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('prnId'),
            dataIndex: 'prnId',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('bemerkung'),
            dataIndex: 'bemerkung',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('kurzBezeichnung'),
            dataIndex: 'kurzBezeichnung',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('ort'),
            dataIndex: 'ort',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('plz'),
            dataIndex: 'plz',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('strasse'),
            dataIndex: 'strasse',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('telefon'),
            dataIndex: 'telefon',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('tp'),
            dataIndex: 'tp',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('typ'),
            dataIndex: 'typ',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('letzteAenderung'),
            dataIndex: 'letzteAenderung'
        }];
        this.listeners = {
           select: {
               fn: this.activateRemoveButton,
               scope: this
            },
            deselect: {
                fn: this.deactivateRemoveButton,
                scope: this
            }
        };
        this.callParent(arguments);
    },

    /**
     * This sets the Store of this Grid
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
    }
});

