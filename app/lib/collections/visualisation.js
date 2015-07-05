hubs = new Mongo.Collection("IOTHub");
feeds = new Mongo.Collection("IOTFeed");
datasets = new Mongo.Collection("Dataset");
widgetTypes = new Mongo.Collection("widgetTypes");
widgets = new Mongo.Collection("widgets");

feedDataCache = {};
datasetDataCache = {};