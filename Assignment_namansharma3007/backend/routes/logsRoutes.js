const express = require('express');
const router = express.Router();
const Logs = require('../model/logs');

module.exports = function (io) {
    router.get('/getLogs', (req, res) => {
        Logs.find()
            .then((result) =>
                res.status(200).json({
                    message: 'Logs fetched successfully',
                    data: result,
                })
            )
            .catch((error) =>
                res.status(500).json({
                    message: 'Error occurred in DB',
                    error: error,
                })
            );
    });

    router.post('/pushLogs', (req, res) => {
        const timestamp = req.body.timestamp ? req.body.timestamp : new Date();
        const logData = new Logs({
            level: req.body.level,
            message: req.body.message,
            resourceId: req.body.resourceId,
            timestamp: timestamp,
            traceId: req.body.traceId,
            spanId: req.body.spanId,
            commit: req.body.commit,
            metadata: {
                parentResourceId: req.body.metadata.parentResourceId,
            },
        });

        // Save log data to the database
        logData.save((err, data) => {
            if (err) {
                console.log('Error occurred while ingesting logs');
                res.status(500).json({
                    error: err,
                });
            } else {
                const updatedLogs = data;

                // Broadcast the updated logs to all connected clients
                io.emit('logUpdate', updatedLogs);

                res.status(200).json({
                    message: 'Data saved',
                    data: data,
                });
            }
        });
    });

    router.post('/getLogsByQuery', (req, res) => {
        const { level, message, resourceId, traceId, spanId, commit, parentResourceId, timestampStart, timestampEnd } = req.body;
        const query = {};

        if (level) {
            query.level = level;
        }

        if (message) {
            query.message = { $regex: message, $options: 'i' };
        }

        if (resourceId) {
            query.resourceId = resourceId;
        }

        if (traceId) {
            query.traceId = traceId;
        }

        if (spanId) {
            query.spanId = spanId;
        }

        if (commit) {
            query.commit = { $regex: commit, $options: 'i' };;
        }

        if (parentResourceId) {
            query['metadata.parentResourceId'] = { $regex: parentResourceId, $options: 'i' };
        }

        if (timestampStart && timestampEnd) {
            query.timestamp = {
                $gte: new Date(timestampStart),
                $lt: new Date(timestampEnd)
            };
        }
        if (timestampStart && !timestampEnd) {
            query.timestamp = {
                $gte: new Date(timestampStart),
                $lt: new Date()
            };
        }
        if (timestampEnd && !timestampStart) {
            query.timestamp = {
                $gte: new Date("2000-01-01T00:00:00Z"),
                $lt: new Date(timestampEnd)
            };
        }

        Logs.find(query)
            .then(result =>
                res.status(200).json({
                    message: 'Logs fetched successfully',
                    data: result,
                }),
            )
            .catch((error) =>
                res.status(500).json({
                    message: 'Error occurred in DB',
                    error: error,
                })
            );
    });

    return router;
};
