/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Widget for sorting columns
 */
Ext.define('Lada.view.widget.ColumnSort' ,{
    extend: 'Ext.container.Container',
    alias: 'widget.columnsort',
    layout: {
        type: 'hbox',
        align: 'stretchmax'
    },
    require: ['Lada.view.widget.Sort'],
    margin: '20,0,0,10',
    title: null,
    store: Ext.create('Ext.data.Store', {
        model: 'Lada.model.Column'
    }),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var cboxmodel = Ext.create('Ext.data.Model', {
            fields: [{name: 'name'}, {name: 'value'}]
        });
        var comboboxstore = Ext.create('Ext.data.Store', {
            model: cboxmodel,
            data: [{
                name: 'Aufsteigend',
                value: 'asc'
            }, {
                name: 'Absteigend',
                value: 'desc'
            }, {
                name: 'Keine Sortierung',
                value: null
            }]
        });
        this.items = [{
            name: 'sortGrid',
            flex: 1,
            xtype: 'grid',
            store: this.store,
            scrollable: true,
            maxHeight: 125,
            autoSort: false,
            multiSelect: true,
            stripeRows: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    containerScroll: true
                },
                listeners: {
                    drop: function(node, data, overModel) {
                        // write the new order to the store(s)
                        // TODO this is still not good. It relies on uniqueness
                        // of column names, and that the table's cell template
                        // does not change.
                        var nodes = me.down('grid[name=sortGrid]').getView()
                            .getNodes();
                        for (var i = 0 ; i < nodes.length; i++) {
                            var nodename = nodes[i].innerText.substr(0,
                                nodes[i].innerText.length -3);
                            var entry = overModel.store.findRecord('name', nodename);
                            var orig_entry = me.up('querypanel').columnStore
                                .findRecord('dataIndex',entry.get('dataIndex'));
                            entry.set('sortIndex', i);
                            orig_entry.set('sortIndex', i);
                        }
                    }
                },
                markDirty: false
            },
            columns: [{
                text: '',
                sortable: false,
                dataIndex: 'name',
                flex: 2
            },{
                xtype: 'widgetcolumn',
                minWidth: 150,
                widget: {
                    xtype: 'combobox',
                    dataIndex: 'sort',
                    model: cboxmodel,
                    store: comboboxstore,
                    defaultValue: null,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    triggers: {
                        clear: {
                            hidden: true
                        }
                    },
                    listeners: {
                        change: function(box, newValue) {
                            var newval = newValue || null;
                            var rec = box.$widgetRecord;
                            rec.set('sort', newval);
                            var origindata = this.up('querypanel')
                                .columnStore.getById(rec.get('id'));
                            origindata.set('sort', newval);
                        }
                    }
                },
                text: '',
                dataIndex: 'sort',
                sortable: false
            }],
            title: i18n.getMsg('query.sorting'),
            minHeight: 40
        }];
        this.callParent();
    },

    setStore: function(newStore) {
        if (newStore) {
            this.store.setData(newStore.getData().items);
        }
        this.store.filter('visible', true);
        this.store.sort('sortIndex', 'ASC');
        var sorter = this.store.getSorters();
        sorter.remove('sortIndex');

    }
});
