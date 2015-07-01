var PinModel = Backbone.Model.extend({});
var PinCollection = Backbone.Collection.extend({
    model: PinModel,
});
var PinView = Backbone.View.extend({
    tagName: 'div',
    events: {
        'click .removePin': 'removePin'
    },
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        var template = _.template($("#pinTemplate").html());
        this.$el.html(template(this.model.toJSON()));
        return this;
    },
    removePin: function() {
        this.model.destroy();
    }
});
var PinListView = Backbone.View.extend({
    events: {
        'click .exportPins': 'exportPins',
        'click .removeAllPins': 'removeAllPins'
    },
    initialize: function() {
        this.collection.bind('add', this.onPinAdded, this);
    },
    onPinAdded: function(model) {
        this.addOne(model);
    },
    addOne: function(model) {
        var view = new PinView({
            model: model
        });
        $(this.el).append(view.render().el);
    },
    exportPins: function() {
        this.collection.saveToCSV('pins');
    },
    removeAllPins: function() {
        this.collection.each(function(model) {
            console.log(model);
            model.destroy();
        });
    }
});
var EditorView = Backbone.View.extend({
    events: {
        'mouseup': 'getSelectedParagraphText',
    },
    initialize: function(options) {
        _.bindAll(this, 'getSelectedParagraphText');
    },
    getSelectedParagraphText: function() {
        var txt = ""
        if (window.getSelection) {
            txt = window.getSelection();
        } else if (document.getSelection) {
            txt = document.getSelection();
        } else if (document.selection) {
            txt = document.selection.createRange().text;
        }
        if (txt.toString().trim()) {
            this.collection.add({
                pintext: txt.toString()
            });
        }
    },
});