/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Controller for a Messungengrid
 */
Ext.define('Lada.controller.grid.Messung', {
    extend: 'Ext.app.Controller',

    requires: [
        'Lada.view.window.MessungEdit'
    ],

    /**
     * Inhitialize the controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'messunggrid': {
                itemdblclick: this.editItem
            },
            'messunggrid button[action=add]': {
                click: this.add
            },
            'messunggrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    /**
     * This function opens a new {@link Lada.view.window.MessungEdit}
     * Window.
     */
    editItem: function(grid, record) {
        // we have a window with a probe record!
        if (grid.up('window')) {
            var probe = grid.up('window').record;
            var win = Ext.create('Lada.view.window.MessungEdit', {
                parentWindow: grid.up('window'),
                probe: probe,
                record: record,
                grid: grid
            });
            win.show();
            win.setPosition(window.innerWidth - 30 -win.width);
            win.initData();
            return;
        }
        var probeRecord = Ext.create('Lada.model.ProbeList');
        probeRecord.setId(record.get('probeId'));
        probeRecord.set('owner', record.get('owner'));
        probeRecord.set('readonly', record.get('readonly'));

        var probeWin = Ext.create('Lada.view.window.ProbeEdit', {
            record: probeRecord,
            style: 'z-index: -1;' //Fixes an Issue where windows could not be created in IE8
        });

        probeWin.setPosition(30);
        probeWin.show();
        probeWin.initData();

        Ext.ClassManager.get('Lada.model.Probe').load(record.get('probeId'), {
            failure: function(record, action) {
                me.setLoading(false);
                // TODO
                console.log('An unhandled Failure occured. See following Response and Record');
                console.log(action);
                console.log(record);
            },
            success: function(precord, response) {
                var messungWin = Ext.create('Lada.view.window.MessungEdit', {
                    parentWindow: probeWin,
                    probe: precord,
                    record: record,
                    grid: grid
                });
                messungWin.show();
                messungWin.setPosition(window.innerWidth - 30 - messungWin.width);
                messungWin.initData();
            }
        });
    },

    /**
     * This function opens a window add a Messung
     */
    add: function(button) {
        var probe = button.up('window').record;
        var win = Ext.create('Lada.view.window.MessungCreate', {
            record: probe,
            grid: button.up('messunggrid'),
            parentWindow: button.up('window')
        });
        win.show();
        win.initData();
    },

    /**
     * This function removes a Messung
     * It displays a Confirmation-Popup.
     * When the Removal was confirmed and the operation was successful,
     * the Messung-row is removed from the grid.
     * On failure an Errormessage is shown
     */
    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm(
            'Messung löschen',
            'Sind Sie sicher?',
            function(btn) {
                if (btn === 'yes') {
                    selection.erase({
                        success: function() {
                            button.up('window').initData();
                            var parentGrid = Ext.ComponentQuery.query(
                                'messunglistgrid');
                            if (parentGrid.length == 1){
                                parentGrid[0].store.reload();
                            }
                        },
                        failure: function(request, response) {
                            var i18n = Lada.getApplication().bundle;
                            if (response.error){
                                //TODO: check content of error.status (html error code)
                                Ext.Msg.alert(i18n.getMsg(
                                    'err.msg.delete.title'),
                                    i18n.getMsg('err.msg.generic.body'));
                            } else {
                                var json = Ext.decode(response.getResponse().responseText);
                                if (json) {
                                    if (json.message){
                                        Ext.Msg.alert(i18n.getMsg(
                                            'err.msg.delete.title')
                                        +' #' + json.message,
                                        i18n.getMsg(json.message));
                                    } else {
                                        Ext.Msg.alert(i18n.getMsg(
                                            'err.msg.delete.title'),
                                            i18n.getMsg(
                                                'err.msg.generic.body'));
                                    }
                                } else {
                                    Ext.Msg.alert(i18n.getMsg(
                                        'err.msg.delete.title'),
                                        i18n.getMsg('err.msg.response.body'));
                                }
                            }
                        }
                    });
                }
            }
        );
        grid.down('button[action=delete]').disable();
    }
});
