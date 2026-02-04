const Event = require('../../models/event/event.model');
const EventVisit = require('../../models/event/eventVisit.model');

exports.createEvent = async (data, adminId) => {
    data.created_by = adminId;
    return await Event.create(data);
};

exports.getAllEvents = async (query = {}) => {
    // strict filter for non-deleted ACTIVE events
    const filter = {
        is_deleted: false,
        is_active: true,
        ...query
    };
    return await Event.find(filter).sort({ event_date: 1 });
};

exports.getEventById = async (id, isAdmin = false) => {
    const event = await Event.findById(id);
    if (!event) throw new Error('Event not found');

    if (!isAdmin && (event.is_deleted || !event.is_active)) {
        throw new Error('Event not found or unavailable');
    }
    return event;
};

exports.updateEvent = async (id, data) => {
    const event = await Event.findById(id);
    if (!event || event.is_deleted) throw new Error('Event not found');

    return await Event.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteEvent = async (id) => {
    // Soft delete logic
    const event = await Event.findById(id);
    if (!event || event.is_deleted) {
        throw new Error('Event already deleted or not found');
    }

    event.is_deleted = true;
    event.deleted_at = new Date();
    await event.save();
    return true;
};

exports.recordVisit = async (eventId, workerId) => {
    const event = await Event.findById(eventId);
    if (!event || event.is_deleted || !event.is_active) {
        throw new Error('Cannot visit this event');
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Check if already visited? Requirement says "Store visits separately". 
    // Assuming unique visit per user per event is okay (schema constraint).
    try {
        await EventVisit.create({
            event_id: eventId,
            worker_id: workerId
        });
    } catch (e) {
        if (e.code === 11000) return; // Ignore duplicate visit
        throw e;
    }
    return true;
};
