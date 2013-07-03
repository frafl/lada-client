Ext.define('Lada.model.Status', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "sId"},
        {name: "messungsId"},
        {name: "probeId"},
        {name: "erzeuger"},
        {name: "status"},
        {name: "sdatum", type: 'date', convert: ts2date, defaultValue: new Date()},
        {name: "stext"}
    ],
    idProperty: "sId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/status',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    getEidi: function() {
        var sid =  this.get('sId');
        var messId = this.get('messungsId');
        var probeId = this.get('probeId');
        return "/" + sid + "/" + messId + "/" + probeId;
    }
});

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
