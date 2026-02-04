const eventService = require('../../services/event/event.service');
const ApiResponse = require('../../utils/apiResponse');

exports.createEvent = async (req, res) => {
    const event = await eventService.createEvent(req.body, req.user._id);
    res.status(201).json(new ApiResponse(true, 'Event created successfully', event));
};

exports.getAllEvents = async (req, res) => {
    // Optional query filters
    const events = await eventService.getAllEvents();
    res.status(200).json(new ApiResponse(true, 'Events fetched successfully', events));
};

exports.getEventById = async (req, res) => {
    const isAdmin = req.user.role === 'admin';
    const event = await eventService.getEventById(req.params.id, isAdmin);
    res.status(200).json(new ApiResponse(true, 'Event details fetched', event));
};

exports.updateEvent = async (req, res) => {
    const event = await eventService.updateEvent(req.params.id, req.body);
    res.status(200).json(new ApiResponse(true, 'Event updated successfully', event));
};

exports.deleteEvent = async (req, res) => {
    await eventService.deleteEvent(req.params.id);
    res.status(200).json(new ApiResponse(true, 'Event deleted successfully (Soft Delete)'));
};

exports.recordVisit = async (req, res) => {
    await eventService.recordVisit(req.params.id, req.user._id);
    res.status(200).json(new ApiResponse(true, 'Visit recorded'));
};
