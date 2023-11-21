const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  level: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  resourceId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  traceId: {
    type: String,
    required: true,
  },
  spanId: {
    type: String,
    required: true,
  },
  commit: {
    type: String,
    required: true,
  },
  metadata: {
    parentResourceId: {
      type: String,
    },
  },
},
  {
    versionKey: false, // Exclude the versionKey (__v) field
  });

  logSchema.index({ level: 1, resourceId: 1, traceId: 1, spanId: 1 }, { background: true }); 
  logSchema.index({ level: 1, resourceId: 1, traceId: 1 }, { background: true }); 
  logSchema.index({ level: 1, resourceId: 1, spanId: 1 }, { background: true }); 
  logSchema.index({ level: 1, traceId: 1, spanId: 1 }, { background: true }); 
  logSchema.index({ level: 1, resourceId: 1}, { background: true }); 
  logSchema.index({ level: 1, traceId: 1}, { background: true }); 
  logSchema.index({ level: 1, spanId: 1 }, { background: true }); 
  logSchema.index({ level: 1 }, { background: true }); 
  logSchema.index({ resourceId: 1}, { background: true }); 
  logSchema.index({traceId: 1}, { background: true });
  logSchema.index({spanId: 1 }, { background: true });
  

module.exports = mongoose.model('Logs', logSchema, 'logs');
