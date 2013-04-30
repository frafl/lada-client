Ext.application({
    name: 'Lada',
    // Setting this variable to true should trigger loading the Viewport.js
    // file which sets ob the viewport. But this does not happen.
    autoCreateViewprt: false,
    launch: function() {
        // Start the application.
        console.log('Launching the application');

        // This code works here, but this should usually be done in the
        // Viewport.js class.
        Ext.create('Ext.panel.Panel', {
            renderTo: Ext.getBody(),
            title: 'Probenauswahlmaske',
            items: [
                {
                    xtype: 'probenlist'
                }
            ]
        });
    },
    // Define the controllers of the application. They will be initialized
    // first before the application "launch" function is called.
    controllers: [
        'Proben',
        'Sql'
    ]
});
