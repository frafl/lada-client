Ext.define('Lada.model.Messung', {
    extend: 'Ext.data.Model',
        fields: [
        {name: "id"},
        {name: "messungsId", mapping:"id.messungsId"},
        {name: "probeId", mapping:"id.probeId"},
        {name: "mmtId"},
        {name: "nebenprobenNr"},
        {name: "messdauer"},
        {name: "messzeitpunkt", convert: ts2date},
        {name: "fertig", type: "boolean"},
        {name: "letzteAenderung", type:"date"},
        {name: "geplant", type: "boolean"}
    ],
    idProperty: "convertedId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/messung',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
