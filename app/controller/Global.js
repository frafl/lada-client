/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for functionality that can't be logically put elsewhere.
 */
Ext.define('Lada.controller.Global', {
    extend: 'Ext.app.Controller',

    init: function() {
        var me = this;
        this.control({
            'menuitem[action=about]': {
                click: this.about
            }
        });
    },

    /**
     * Handle the About action
     */
    about: function() {
        var win = Ext.create('Lada.view.window.About');
        win.show();
    }
});
