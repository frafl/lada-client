/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form to edit the Ortszuordnung of a Probe
 */
Ext.define('Lada.view.form.Ortszuordnung', {
    extend: 'Lada.view.form.LadaForm',
    alias: 'widget.ortszuordnungform',

    requires: [
        'Lada.controller.form.Ortszuordnung',
        'Lada.view.form.OrtInfo',
        'Lada.view.widget.OrtszuordnungTyp',
        'Lada.view.widget.OrtsZusatz',
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.Staat',
        'Lada.view.widget.base.TextArea'
    ],

    controller: 'ortszuordnungform',
    layout: 'fit',
    margin: '5, 5, 0, 5',
    border: false,

    currentOrt: null, // the record of the currently set Ort

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{
            xtype: 'fieldset',
            title: i18n.getMsg('ortszuordnung.form.fset.title'),
            layout: 'fit',
            items: [{
                overflowY: 'auto',
                border: false,
                margin: '0, 0, 10, 0',
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    border: '0, 1, 1, 1',
                    style: {
                        borderBottom: '1px solid #b5b8c8 !important',
                        borderLeft: '1px solid #b5b8c8 !important',
                        borderRight: '1px solid #b5b8c8 !important'
                    },
                    items: ['->', {
                        text: i18n.getMsg('orte.show'),
                        tooltip: i18n.getMsg('save.qtip'),
                        // TODO icon:
                        action: 'showort'
                    }, {
                        text: i18n.getMsg('save'),
                        tooltip: i18n.getMsg('save.qtip'),
                        icon: 'resources/img/dialog-ok-apply.png',
                        action: 'save',
                        disabled: true
                    }, {
                        text: i18n.getMsg('discard'),
                        qtip: i18n.getMsg('discard.qtip'),
                        icon: 'resources/img/dialog-cancel.png',
                        action: 'revert',
                        disabled: true
                    }]
                }],
                items: [{
                    layout: 'hbox',
                    border: false,
                    margin: '0, 0, 5, 0',
                    items: [{
                        layout: 'vbox',
                        border: false,
                        flex: 1,
                        items: [{
                            layout: 'vbox',
                            border: false,
                            margin: '0, 20, 0, 0',
                            items: [{
                                xtype: 'ortszuordnungtyp',
                                labelWidth: 120,
                                allowBlank: false,
                                editable: true,
                                name: 'ortszuordnungTyp',
                                disableKeyFilter: true,
                                fieldLabel: i18n.getMsg(
                                    'ortszuordnung.form.field.ortszuordnungtyp')
                            }, {
                                xtype: 'ortszusatz',
                                labelWidth: 120,
                                width: 350,
                                editable: true,
                                name: 'ozId',
                                fieldLabel: i18n.getMsg(
                                    'ortszuordnung.form.field.ozId')
                            }, {
                                // empty conttainer for vertical separation
                                xtype: 'container',
                                minHeight: 10
                            }, {
                                // this field is hidden because the user doesn't
                                // need to know the internal ortID
                                xtype: 'textfield',
                                allowBlank: false,
                                regex: /^[0-9]{1,45}$/,
                                submitValue: true,
                                hidden: true,
                                name: 'ortId',
                                listeners: {
                                    change: me.changed
                                }
                            }, {
                                xtype: 'fieldset',
                                name: 'orte',
                                title: i18n.getMsg('title.ortsangabe'),
                                padding: '5, 5',
                                margin: 5,
                                items: [
                                    Ext.create('Lada.view.form.OrtInfo')
                                ]
                            }, {
                                // empty conttainer for vertical separation
                                xtype: 'container',
                                minHeight: 10
                            }, {
                                xtype: 'tarea',
                                labelWidth: 125,
                                maxLength: 100,
                                width: 350,
                                name: 'ortszusatztext',
                                fieldLabel: i18n.getMsg(
                                    'ortszuordnung.form.field.ortszusatztext'),
                                flex: 1
                            }]
                        }]
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(record) {
        this.clearMessages();
        this.loadRecord(record);
        this.setReadOnly(record.get('readonly'));
    },

    /**
     * setOrt can be called from a CallbackFunction, ie select from a grid.
     * it will set the ortId of this record
     */
    setOrt: function(row, selRecord) {
        if (selRecord) {
            var newOrtId = selRecord.get('id');
            if (!this.getRecord().get('readonly') && newOrtId) {
                this.getForm().setValues({ortId: newOrtId});
                this.setOrtInfo(selRecord);
                this.down('button[action=showort]').setDisabled(false);
            }
        } else {
            this.down('button[action=showort]').setDisabled(true);
        }
    },

    /**
     * sets the ort even if the record is readOnly. Used for initially setting
     * a record on existing entries.
     * */
    setFirstOrt: function(record) {
        if (record) {
            this.getForm().setValues({ortId: record.get('id')});
            this.setOrtInfo(record);
        }
    },

    setOrtInfo: function(ortrecord) {
        this.currentOrt = ortrecord;

        var dirtyForm = false;
        if (this.down('ortinfo').getForm().getRecord() !== undefined) {
            if (ortrecord.get('ortId') !==
                this.down('ortinfo').getForm().getRecord().get('ortId') ) {
                dirtyForm = true;
            }
        }

        var ortinfo = this.down('ortinfo').getForm();
        ortinfo.loadRecord(ortrecord);

        var verw = Ext.StoreManager.get('verwaltungseinheiten')
            .getById(ortrecord.get('gemId'));
        if (verw !== null) {
            ortinfo.setValues({gemeinde: verw.get('bezeichnung')});
        } else {
            ortinfo.setValues({gemeinde: ''});
        }

        var staat = Ext.StoreManager.get('staaten')
            .getById(ortrecord.get('staatId'));
        if (staat !== null) {
            ortinfo.setValues({
                staatISO: staat.get('staatIso'),
                staat: staat.get('staat')});
        } else {
            ortinfo.setValues({staat: '', staatISO: ''});
        }

        var ozid = Ext.StoreManager.get('ortszusatz')
            .getById(ortrecord.get('ozId'));
        if (ozid !== null) {
            if (dirtyForm) {
                this.down('ortszusatz').setValue(ozid.get('ozsId'));
            } else {
                if (this.getRecord().get('ozId') === undefined) {
                    this.down('ortszusatz').setValue(ozid.get('ozsId'));
                }
            }
        } else {
            if (this.getRecord().get('ozId') === undefined
                || dirtyForm === true
            ) {
                this.down('ortszusatz').setValue('');
            }
        }
    },

    /**
     * Helper to trigger the forms' validity check
     */
    changed: function() {
        var controller = Lada.app.getController(
            'Lada.controller.form.Ortszuordnung');
        var form = this.up('form').getForm();
        controller.validityChange(form, form.isValid());
    },

    /**
     * When the form is editable, a Record can be selected.
     * If the Record was selected from a grid this function
     * sets the ortzuordnung.
     */
    chooseLocation: function() {
        var win = this.up('ortszuordnungwindow');
        var osg = win.down('ortstammdatengrid');
        var oForm = win.down('ortszuordnungform');
        if (!this.getRecord().get('readonly')) {
            osg.addListener('select', oForm.setOrt, oForm);
            var map = win.down('map');
            if (!map.featureLayer) {
                map.initFeatureLayer();
            }
            map.featureLayer.setVisibility(true);
            osg.addListener('select', oForm.setOrt, oForm);
        } else {
            osg.removeListener('select', oForm.setOrt, oForm);
        }
    }
});

