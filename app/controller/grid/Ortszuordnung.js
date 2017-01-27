/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of Orte
 */
Ext.define('Lada.controller.grid.Ortszuordnung', {
    extend: 'Ext.app.Controller',

    requires: [
        'Lada.view.window.Ortszuordnung',
        'Lada.view.window.Ortserstellung',
        'Lada.view.window.OrtFilter'
    ],

    resultPanel: null,
    searchField: null,

    /**
     * Inhitialize the controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'ortszuordnunggrid': {
                itemdblclick: this.open
            },
            'ortszuordnunggrid button[action=add]': {
                click: this.add
            },
            'ortszuordnunggrid button[action=delete]': {
                click: this.remove
            },
            'ortszuordnungwindow toolbar button[action=createort]':{
                click: this.createort
            },
            'ortszuordnungwindow toolbar button[action=frommap]':{
                click: this.frommap
            },
            'ortszuordnungwindow toolbar button[action=clone]':{
                click: this.cloneort
            },
            'ortszuordnungwindow toolbar textfield[name=search]': {
                keyup: this.search
            },
            'ortfilterwindow grid[name=messpunkte]': {
                itemdblclick: this.selectedMesspunkt
            },
            'ortfilterwindow grid[name=verwaltungseinheiten]': {
                itemdblclick: this.selectedVerwaltungseinheit
            },
            'ortfilterwindow grid[name=staaten]': {
                itemdblclick: this.selectedStaat
            }
        });
    },

    /**
     * When open is called, a {@link Lada.view.window.Ortszuordnung}
     * is created which allows to edit the Orte
     */
    open: function(grid, record) {
        var probe = grid.up('window').record;
        var win = Ext.create('Lada.view.window.Ortszuordnung', {
            parentWindow: grid.up('window'),
            probe: probe,
            record: record,
            grid: grid
        });
        win.show();
        win.initData();
    },

    /**
     * This function adds a new row to add an Ort
     */
    add: function(button) {
        var probe = button.up('window').record;
        var win = Ext.create('Lada.view.window.Ortszuordnung', {
            parentWindow: button.up('window'),
            probe: probe,
            record: null,
            grid: button.up('ortszuordnung')
        });
        win.show();
        win.initData();
    },

    /**
     * A Ort-row can be removed from the grid with the remove
     * function. It asks the user for confirmation
     * If the removal was confirmed, it reloads the parent window on success,
     * on failure, an error message is shown.
     */
    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var i18n = Lada.getApplication().bundle;
        Ext.MessageBox.confirm(i18n.getMsg('delete'), i18n.getMsg('confirmation.question'),
                                function(btn) {
                if (btn === 'yes') {
                selection.destroy({
                    success: function() {
                        button.up('window').initData();
                    },
                    failure: function(request, response) {
                        var i18n = Lada.getApplication().bundle;
                        var json = response.request.scope.reader.jsonData;
                        if (json) {
                            if (json.message){
                                Ext.Msg.alert(i18n.getMsg('err.msg.delete.title')
                                    +' #'+json.message,
                                    i18n.getMsg(json.message));
                            } else {
                                Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                    i18n.getMsg('err.msg.generic.body'));
                            }
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                i18n.getMsg('err.msg.response.body'));
                        }
                    }
                });
            }
        });
        grid.down('button[action=delete]').disable();
    },

    /**
     * Opens the form for a new Messpunkt
     */
    createort: function(button) {
        Ext.create('Lada.view.window.Ortserstellung',{
            parentWindow: button.up('ortszuordnungwindow')
        }).show();
    },

    /**
     *
     * Creates an event listener for a map click
     */
    frommap: function(button) {
        var map = button.up('ortszuordnungwindow').down('map');
        var me = this;
        map.map.events.register('click', button, me.newOrtfromMapClick);
        // TODO visual feedback that map click is active.
        // TODO Deactivate event listener if button is destroyed
    },

    /**
     * Opens the form for a new Messpunkt, with all values prefilled from the currently
     * selected item
     */
    cloneort: function(button) {
        var grid = button.up('ortszuordnungwindow').down('ortstammdatengrid').getView();
        var selected = grid.getSelectionModel().getSelection()[0];
         Ext.create('Lada.view.window.Ortserstellung', {
             record: Ext.create('Lada.model.Ort', selected.data),
             parentWindow: button.up('ortszuordnungwindow')
        }).show();
    },

    /**
     * Gets the clicked map's coordinates and opens a new Messpunkt window with coordinates prefilled
     */
    newOrtfromMapClick: function(evt) {
        var me = this; //this = button(action:frommap)
        var map = this.up('ortszuordnungwindow').down('map').map;
        var lonlat = map.getLonLatFromViewPortPx(evt.xy).transform(new OpenLayers.Projection('EPSG:3857'),
                                                                   new OpenLayers.Projection('EPSG:4326'));
        var controller = Lada.app.getController('Lada.controller.grid.Ortszuordnung');
        map.events.unregister('click', this, controller.newOrtfromMapClick);
        Ext.create('Lada.view.window.Ortserstellung', {
            record: Ext.create('Lada.model.Ort',{
                koordXExtern: lonlat.lon,
                koordYExtern: lonlat.lat,
                kdaId : 4
            }),
            parentWindow: this.up('ortszuordnungwindow')
        }).show();
    },

    /**
     * Search triggered by textfield key event.
     */
    search: function(field, evt, opts) {
        this.searchField = field;
        if ((evt.getKey() == 13 || evt.getKey() == 8) && field.getValue() && field.getValue().length > 0) {
            this.execSearch(field, field.getValue());
        }
        if (field.getValue().length === 0) {
            this.resultPanel.hide();
            return;
        }
        if (field.getValue().length < 3) {
            return;
        }
        this.execSearch(field, field.getValue());
    },

    /*
     * Execute search in stores (ort, verwaltungseinheit and staat) and
     * display the resultset.
     */
    execSearch: function(field, filter) {
        // Filter stores
        var messpunkte = Ext.data.StoreManager.get('orte');
        var verwaltungseinheiten = Ext.data.StoreManager.get('verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        messpunkte.clearFilter(true);
        verwaltungseinheiten.clearFilter(true);
        staaten.clearFilter(true);
        messpunkte.filter({filterFn: function(item) {
                if (item.get('ortId').indexOf(filter) > -1) {
                    return true;
                }
                if (item.get('kurztext').indexOf(filter) > -1) {
                    return true;
                }
                if (item.get('langtext').indexOf(filter) > -1) {
                    return true;
                }
                if (item.get('berichtstext') &&
                    item.get('berichtstext').indexOf(filter) > -1) {
                    return true;
                }
                if (item.get('gemId').indexOf(filter) > -1) {
                    return true;
                }
            }});
        verwaltungseinheiten.filter('bezeichnung', filter);
        staaten.filter('staat', filter);

        if (!this.resultPanel) {
            this.resultPanel = Ext.create('Lada.view.window.OrtFilter', {
                x: 500,
                y: 500,
                alwaysOnTop: true
            });
        }
        this.resultPanel.show();
        this.resultPanel.updateGrids(messpunkte, verwaltungseinheiten, staaten);
        this.resultPanel.reposition(field.getX() + field.getLabelWidth(), field.getY());
        field.focus();
    },

    selectedMesspunkt: function(grid, record) {
        var win = grid.up('window');
        win.hide();
        this.searchField.reset();
        var grid = this.searchField.up('panel').down('ortstammdatengrid');
        grid.getSelectionModel().select(record);
        grid.getView().focusRow(record);
    },

    selectedVerwaltungseinheit: function(grid, record) {
        var win = grid.up('window');
        win.hide();
        this.searchField.reset();
        Ext.create('Lada.view.window.Ortserstellung', {
            record: Ext.create('Lada.model.Ort', record.data),
            parentWindow: grid.up('ortszuordnungwindow')
        }).show();
    },

    selectedStaat: function(grid, record) {
        var win = grid.up('window');
        console.log(grid.up('ortszuordnungwindow'));
        win.hide();
        Ext.create('Lada.view.window.Ortserstellung', {
            record: Ext.create('Lada.model.Ort', record.data),
            parentWindow: grid.up('ortszuordnungwindow')
        }).show();
        this.searchField.reset();
    }
});
