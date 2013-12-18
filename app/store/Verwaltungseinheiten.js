/**
 * Store for Verwaltungseinheiten
 */
Ext.define('Lada.store.Verwaltungseinheiten', {
    extend: 'Ext.data.Store',
    fields: ['gemId', 'bezeichnung', 'longitude', 'latitude'],
    sorters: [{
        property: 'bezeichnung'
    }],
    autoLoad: true,
    proxy: {
        type: 'rest',
        api: {
        read: 'server/rest/verwaltungseinheit'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
