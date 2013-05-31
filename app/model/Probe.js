Ext.define('Lada.model.Probe', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "probeId"},
        {name: "baId"},
        {name: "datenbasisId"},
        {name: "erzeugerId"},
        {name: "hauptprobenNr"},
        {name: "letzteAenderung"},
        {name: "media"},
        {name: "mediaDesk"},
        {name: "mittelungsdauer"},
        {name: "mpKat"},
        {name: "mplId"},
        {name: "mprId"},
        {name: "mstId"},
        {name: "netzbetreiberId"},
        {name: "probeId"},
        {name: "probeNehmerId"},
        {name: "probeentnahmeBeginn", type: 'date', convert: ts2date},
        {name: "probeentnahmeEnde", type: 'date', convert: ts2date},
        {name: "probenartId"},
        {name: "solldatumBeginn", type: 'date', convert: ts2date},
        {name: "solldatumEnde", type: 'date', convert: ts2date},
        {name: "test"},
        {name: "umwId"}
    ],
    idProperty: "probeId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/proben',
        api: {
        },
        reader: {
            type: 'json'
        }
    }
});

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
