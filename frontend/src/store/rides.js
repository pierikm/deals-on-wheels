import { csrfFetch } from './csrf';

const LOAD = 'rides/LOAD';
const LOAD_SINGLE = 'rides/LOAD_SINGLE';
const CREATE = 'rides/CREATE';
const EDIT = 'rides/EDIT';
const DELETE = 'rides/DELETE';

const load = (rides) => ({
    type: LOAD,
    rides
})

const loadSingle = (ride) => ({
    type: LOAD_SINGLE,
    ride
})

const create = (ride) => ({
    type: CREATE,
    ride
})

const edit = (ride) => ({
    type: EDIT,
    ride
})

const del = (rideId) => ({
    type: DELETE,
    rideId
})

export const getSingleRide = (id) => async (dispatch) => {
    const response = await fetch(`/api/rides/${id}`);
    if (response.ok) {
        const ride = await response.json();
        dispatch(loadSingle(ride));
        return ride;
    }
}

export const getRides = () => async (dispatch) => {
    const response = await fetch('/api/rides');
    if (response.ok) {
        const rides = await response.json();
        dispatch(load(rides));
        return rides;
    }
}

export const createRide = (payload) => async (dispatch) => {
    const response = await csrfFetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        const newRide = await response.json();
        dispatch(create(newRide));
        return newRide;
    }
}

export const editRide = (payload, id) => async (dispatch) => {
    const response = await csrfFetch(`/api/rides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        const editRide = await response.json();
        dispatch(edit(editRide));
        return editRide;
    }
}

export const deleteRide = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/rides/${id}`, {
        method: 'DELETE',
    })
    if (response.ok) {
        const rideId = await response.json();
        dispatch(del(rideId))
        return rideId;
    }
}

export const addImage = (payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        const ride = await response.json();
        dispatch(edit(ride));
        return ride;
    }
};

const ridesReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD:
            const loadState = {};
            action.rides.forEach(ride => {
                loadState[ride.id] = ride;
            })
            return loadState;
        case CREATE:
            const createState = { ...state };
            createState[action.ride.id] = action.ride;
            return createState;
        case LOAD_SINGLE:
            const singleState = { ...state };
            singleState[action.ride.id] = action.ride;
            return singleState;
        case EDIT:
            const editState = { ...state };
            editState[action.ride.id] = action.ride;
            return editState;
        case DELETE:
            const removeState = { ...state }
            if (removeState[action.rideId]) delete removeState[action.rideId]
            return removeState;
        default:
            return { ...state };
    }
}

export default ridesReducer;
