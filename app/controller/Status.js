/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.Status', {
    extend: 'Lada.controller.Base',

    views: [
        'status.Create'
    ],

    stores: [
        'Status'
    ],

    init: function() {
        this.callParent(arguments);
    },

    addListeners: function() {
        this.control({
            'statuslist toolbar button[action=open]': {
                click: this.editItem
            },
            'statuslist toolbar button[action=add]': {
                click: this.addItem
            },
            'statuslist toolbar button[action=delete]': {
                click: this.deleteItem
            },
            'statuscreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'statuscreate button[action=save]': {
                click: this.saveItem
            },
            'statusedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },

    addItem: function(button) {
        var zusatzwert = Ext.create('Lada.model.Status');
        zusatzwert.set('probeId', button.probeId);
        zusatzwert.set('messungsId', button.parentId);
        Ext.widget('statuscreate', {
            model: zusatzwert
        });
    },

    editItem: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var statusId = selection.getId();
        var record = selection.store.getById(statusId);
        
        var mstore = Ext.data.StoreManager.get('Messungen');
        var messung = mstore.getById(record.get('messungsId'));
        record.getAuthInfo(this.initEditWindow, messung.get('probeId'));
    },

    initEditWindow: function(record, readonly) {
        var view = Ext.widget('statuscreate', {
            model: record
        });
        var ignore = [];
        if (readonly) {
            var form = view.down('form');
            form.setReadOnly(true, ignore);
        }
    },

    createSuccess: function(form) {
        // Reload store
        var store = this.getStatusStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },

    editSuccess: function(form) {
        // Reload store
        var store = this.getStatusStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
