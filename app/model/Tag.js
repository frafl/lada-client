/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A Probe.
 * This class represents and defines the model of a Tag
 **/
Ext.define('Lada.model.Tag', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'tag',
        type: 'string'
    }, {
        name: 'mstId',
        type: 'string'
    },{
        name: 'netzbetreiberId',
        type: 'string'
    }, {
        name: 'generatedAt'
        // timestamp
    }, {
        name: 'typId',
        type: 'string'
    }, {
        name: 'gueltigBis'
        // timestamp
    }, {
        name: 'readonly',
        type: 'boolean'
    }
],
    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/tag',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});
