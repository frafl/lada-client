Ext.define('Lada.view.widgets.LadaForm', {
    extend: 'Ext.form.Panel',

    alias: 'widget.ladaform',
    /**
     * http://moduscreate.com/expert-ext-js-model-integration-in-forms/
     */

    /**
     * Can be a reference to a model instance or a model class name.
     */
    model: null,
    /**
     * Set to the id of the model instance and the model will be loaded for you.
     * Only applicable if model provided is a model class name (string).
     */
    modelId: null,
    bodyPadding: '10 10',
    border: 0,

    errors: null,
    warnings: null,
    message: null,
    success: null,
    readonly: false,

    initComponent: function() {

        this.callParent();

        this.getForm().trackResetOnLoad = true; //Workaround

        if (Ext.isString(this.model)) {

            //Load a model to be updated
            if (this.modelId) {

                Ext.ClassManager.get(this.model).load(this.modelId, {
                    failure: this.onModelLoadFailure,
                    success: this.onModelLoadSuccess,
                    scope: this
                });

            //Load an empty record to be inserted
            } else {
                this.bindModel(Ext.create(this.model, {}));
            }

        } else {

            //Bind the provided model to be updated
            this.bindModel(this.model);

        }

        this.addEvents('loadsuccess', 'loadfailure', 'savesuccess', 'savefailure');
    },

    bindModel: function(model) {
        this.model = model;
        this.loadRecord(model);
        // Set the form to readonly if the models readonly attribute is
        // true
        if (model.get('readonly') === true) {
            this.setReadOnly(true);
        }
    },

    commit: function(callback, scope) {
        if (this.form.isDirty() && this.form.isValid()) {
            this.form.updateRecord(this.model);

            var data = this.model.getAllData();
            var baseUrl = this.model.getProxy().url;
            var url = baseUrl;
            var method = "POST";
            if (this.model.getId()) {
                url += this.model.getEidi();
                method = "PUT";
            }

            Ext.Ajax.request({
                url: url,
                jsonData: data,
                method: method,
                callback: function(option, success, response) {
                    this.parseResponse(response);
                    if (this.success) {
                        console.log('Save was successfull');
                        this.fireEvent('savesuccess', this);
                    } else {
                        console.log('Save was not successfull');
                        this.form.markInvalid(this.errors);
                        this.fireEvent('savefailure', this);
                    }
                },
                scope: this
            });
        }
    },

    onModelLoadSuccess: function(record, operation) {
        this.bindModel(record);
        this.parseResponse(operation);
        this.fireEvent('loadsuccess', this, record, operation);
    },

    onModelLoadFailure: function(record, operation) {
        this.parseResponse(operation);
        this.fireEvent('loadfailure', this, record, operation);
    },

    translateReturnCodes: function(codes) {
        var translated = {};
        for (var k in codes) {
            translated[k] = Lada.getApplication().bundle.getMsg(codes[k]);
        }
        return translated;
    },
    setReadOnly: function (bReadOnly) {
        /* Iterate over all fields and set them readonly */
        if (bReadOnly) {
            this.getForm().getFields().each (function (field) {
                //field.setDisabled(bReadOnly);
                field.setReadOnly(true);
            });
            /* Iterate over all toolbars of lists and hide them */
            var childs = this.query('toolbar');
            for (var i = childs.length - 1; i >= 0; i--){
                childs[i].setVisible(false);
            }
        }
    },
    parseResponse: function(response) {
        var json = Ext.decode(response.responseText);
        if (json) {
            this.success = json.success;
            this.errors = this.translateReturnCodes(json.errors);
            this.warnings = this.translateReturnCodes(json.warnings);
            this.message = Lada.getApplication().bundle.getMsg(json.message);
        } else {
            this.setReadOnly(this.model.get('readonly'));
        }
    }
});
