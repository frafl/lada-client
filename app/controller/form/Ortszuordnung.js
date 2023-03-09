/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * This is a controller for an Ortszuordnung Form
 */
Ext.define('Lada.controller.form.Ortszuordnung', {
    extend: 'Lada.controller.form.BaseFormController',
    alias: 'controller.ortszuordnungform',

    /**
     * Initialize the Controller with 4 listeners
     */
    init: function() {
        this.control({
            'ortszuordnungform button[action=save]': {
                click: this.save
            },
            'ortszuordnungform button[action=revert]': {
                click: this.revert
            },
            'ortszuordnungform button[action=showort]': {
                click: this.showort
            },
            'ortszuordnungform': {
                validitychange: this.validityChange
            },
            'ortszuordnungform ortszuordnungtyp [name=ortszuordnungTyp]': {
                change: this.dirtyChange
            },
            'ortszuordnungform ortszusatz [name=ozId]': {
                change: this.dirtyChange
            },
            'ortszuordnungform tarea [name=ortszusatztext]': {
                change: this.dirtyChange
            }
        });
    },

    /**
      * The save function saves the content of the Ort form.
      * On success it will reload the Store,
      * on failure, it will display an Errormessage
      */
    save: function(button) {
        var formPanel = button.up('ortszuordnungform');

        //try to disable ortPickerButton:
        if (formPanel.down('button[action=setOrt]')) {
            formPanel.down('button[action=setOrt]').toggle(false);
        }
        var data = formPanel.getForm().getFieldValues(false);
        var record = formPanel.getForm().getRecord();
        record.set('siteId', data.siteId);
        record.set('typeRegulation', data.typeRegulation);
        record.set('addSiteText', data.addSiteText);
        record.set('poiId', data.poiId);
        if (record.phantom) {
            record.set('id', null);
        }
        button.setDisabled(true);
        button.up('ortszuordnungform').form.owner
            .down('button[action=revert]')
            .setDisabled(true);
        record.save({
            scope: this,
            success: function(newRecord, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    formPanel.setRecord(newRecord);
                    formPanel.setMessages(json.errors, json.warnings);
                    formPanel.up('window').parentWindow.initData();
                }
                //try to refresh the Grid of the Probe
                if (
                    formPanel.up('window').parentWindow.down(
                        'ortszuordnunggrid') &&
                        formPanel.up('window').parentWindow.down(
                            'ortszuordnunggrid').store &&
                        formPanel.up('window').parentWindow.xtype
                            === 'probenedit'
                ) {
                    formPanel.up('window').parentWindow
                        .down('ortszuordnunggrid').store.reload();
                }
            },
            failure: this.handleSaveFailure
        });
    },

    /**
     * reverts the form to the currently saved state
     */
    revert: function(button) {
        var form = button.up('form');
        var osg = button.up('window').down('ortstammdatengrid');
        var recordData = form.getForm().getRecord().data;
        var currentOrt = recordData.ortId;
        var selmod = osg.getView().getSelectionModel();
        form.getForm().reset();
        if (!currentOrt) {
            selmod.deselectAll();
        } else {
            var record = osg.store.getById(currentOrt);
            if (!record) {
                Lada.model.Site.load(currentOrt, {
                    success: function(rec) {
                        form.setFirstOrt(rec);
                    }
                });
            } else {
                form.setFirstOrt(record);
                selmod.select(record);
            }
            var map = button.up('window').down('map');
            if (map.previousOrtLayer) {
                var prevOrt = map.previousOrtLayer.getSource().getFeatures()[0];
                if (prevOrt) {
                    var geom = prevOrt.getGeometry();
                    map.map.getView().setCenter([geom.getCoordinates()[0],
                        geom.getCoordinates()[1]]);
                    map.map.getView().setZoom(12);
                }
            }
        }
        button.setDisabled(true);
        button.up('toolbar').down('button[action=save]').setDisabled(true);
    },


    /**
     * The validitychange function enables or disables the save button which
     * is present in the toolbar of the form.
     */
    validityChange: function(form, valid) {
        // the simple form.isDirty() check seems to fail for a lot of cases
        var ortIdIsDirty = true;
        if (
            form.getRecord().data.ortId ===
                form.findField('siteId').getValue()
        ) {
            ortIdIsDirty = false;
        }
        if (form.getRecord().get('readonly') === true) {
            form.owner.down('button[action=save]').setDisabled(true);
            form.owner.down('button[action=revert]').setDisabled(true);
            return;
        }
        if (form.findField('addSiteText').isDirty()
            || form.findField('typeRegulation').isDirty()
            || form.findField('poiId').isDirty()
            || ortIdIsDirty) {
            form.owner.down('button[action=revert]').setDisabled(false);
            if (valid && form.getValues().ortId !== '') {
                form.owner.down('button[action=save]').setDisabled(false);
            } else {
                form.owner.down('button[action=save]').setDisabled(true);
            }
        } else {
            //not dirty
            form.owner.down('button[action=save]').setDisabled(true);
            form.owner.down('button[action=revert]').setDisabled(true);
        }
    },

    dirtyChange: function(combo) {
        var ozf = combo.up('ortszuordnungform');
        ozf.form.owner.down('button[action=revert]').setDisabled(false);
        if (
            ozf.form.findField('siteId').getValue() !== '' &&
            ozf.form.isValid()
        ) {
            ozf.form.owner.down('button[action=save]').setDisabled(false);
            ozf.clearMessages();
        }

    },

    /**
     * Opens the orte form with the currently set Ort
     */
    showort: function(button) {
        var win = button.up('ortszuordnungwindow');
        var currentOrt = win.down('ortszuordnungform').currentOrt;
        if (currentOrt) {
            Ext.create('Lada.view.window.Ort', {
                record: currentOrt,
                parentWindow: win
            }).show();
        }
    }
});
