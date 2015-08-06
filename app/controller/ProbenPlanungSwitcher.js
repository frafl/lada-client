/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the ProbenPlanungSwitcher
 * This controller handles all logic related to the PPS
 */
Ext.define('Lada.controller.ProbenPlanungSwitcher', {
    extend: 'Ext.app.Controller',
    displayFields: null,

    requires: [
        'Lada.store.MessprogrammQueries',
        'Lada.store.ProbeQueries'
    ],

    /**
     * Initialize this Controller
     * It has 1 Listeners
     * A checked PPS-Radiofield fired a 'check'-event
     */
    init: function() {
        this.control({
            'radiofield[name=ppswitch]': {
                check: this.switchModes
            }
        });
        this.callParent(arguments);
    },

    /**
     * Function is called when the user selects a checkbox.
     * according to the checkboxes inputValue,
     * the function alters the store which was loaded by the
     * filterpanels combobox,
     * If enabled the function also disables / enables the UI-Buttons
     * in the Filterresult grid.
     */
    switchModes: function(field) {

        var disableButtons = true;
        var cbox = field.up('probenplanungswitcher').up().down('combobox');
        var resultGrid = field.up('panel[name=main]').down('filterresultgrid');
        filters = field.up('panel[name=main]').down('fieldset[name=filtervariables]');
        filters.removeAll();
        filters.hide();
        var sname = 'Lada.store.ProbeQueries';
        var gridsname = 'Lada.store.ProbenList';
        if (field.inputValue === 'MessprogrammList' && cbox) {
            sname = 'Lada.store.MessprogrammQueries';
            gridsname = 'Lada.store.MessprogrammeList';
        }
        else if (field.inputValue === 'ProbeList' && cbox) {
            sname = 'Lada.store.ProbeQueries';
            gridsname = 'Lada.store.ProbenList';
        }


        var store = Ext.StoreManager.lookup(sname);

        if (!store) {
            store = Ext.create(sname, {
                //Select first Item on Load
                listeners: {
                    load: function(s){
                        var records = new Array();
                        records.push(store.getAt(0));

                        cbox.select(records[0]);
                        cbox.fireEvent('select', cbox, records);
                    }
                }
            });
        }
        if (store) {
            store.load();
            cbox.reset();
            cbox.bindStore(store);
        }

        var gridstore = Ext.StoreManager.lookup(gridsname);
        if (!gridstore) {
            gridstore = Ext.create(gridsname);
        }
        if (gridstore) {
            resultGrid.setStore(gridstore);
            resultGrid.show();
        }

    }
});
