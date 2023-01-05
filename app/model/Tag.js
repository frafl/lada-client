/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This class represents and defines the model of a Tag
 **/
Ext.define('Lada.model.Tag', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'measFacilId',
        type: 'string',
        allowNull: true
    }, {
        name: 'networkId',
        type: 'string',
        allowNull: true
    }, {
        name: 'createdAt',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'tagType',
        type: 'string'
    }, {
        name: 'isAutoTag',
        type: 'boolean'
    }, {
        name: 'valUntil',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'readonly',
        type: 'boolean'
    }],

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/tag',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            transform: function(data, request) {
                // Omit ID generated by ExtJS in POST request
                if (request.getAction() === 'create') {
                    var model = request.getProxy().getModel();
                    if (model instanceof String) {
                        model = Ext.ClassManager.get(model);
                    }
                    delete data[model.idProperty];
                }
                return data;
            }
        }
    },

    isAssignable: function() {
        return Lada.model.Tag.isTagAssignable(this.getData());
    },

    statics: {
        /**
         * Check whether the user might assign the tag, given as plain object.
         */
        isTagAssignable: function(tag) {
            switch (tag.tagType) {
                case 'netz':
                    return Ext.Array.contains(
                        Lada.netzbetreiber, tag.networkId);
                case 'mst':
                    return Ext.Array.contains(Lada.mst, tag.measFacilId);
                default:
                    return true;
            }
        }
    }
});
