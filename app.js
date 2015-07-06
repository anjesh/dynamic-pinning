var PinModel = Backbone.Model.extend({});
var PinCollection = Backbone.Collection.extend({
    model: PinModel,
    localStorage: new Backbone.LocalStorage("pincollection")
});
var PinView = Backbone.View.extend({
    tagName: 'div',
    className: 'pin',
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
        this.addAll();
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
    addAll: function() {
        var self = this;
        this.collection.each(function(model) {
            self.addOne(model);
        });
    },
    exportPins: function() {
        this.collection.saveToCSV('pins');
    },
    removeAllPins: function() {
        var self = this;
        _.each(_.clone(this.collection.models), function(model) {
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
            var pin = new PinModel({pintext: txt.toString()});
            this.collection.add(pin);
            pin.save();
        }
    },
});