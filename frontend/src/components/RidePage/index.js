import { useEffect, useState } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSingleRide, deleteRide } from '../../store/rides';
import { deleteImage } from "../../store/images";
import EditRideForm from '../EditRidePage';
import AddImgForm from "../AddImgForm";
import './Ride.css';

const RidePage = () => {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const { rideId } = useParams();
    const userId = useSelector((state) => state.session.user?.id);
    const ride = useSelector((state) => state.rides[rideId]);
    const images = useSelector((state) => state.images);
    const [showEdit, setShowEdit] = useState(false);
    const [showAddImg, setShowAddImg] = useState(false);
    const [imgKey, setImgKey] = useState(Date.now());

    const history = useHistory();
    const redirect = () => history.replace('/rides')

    useEffect(() => {
        dispatch(getSingleRide(rideId));
    }, [dispatch, rideId]);

    useEffect(() => {
        setImgKey(Date.now());
    }, [images]);

    if (!ride) {
        return null;
    }

    const noImage = "https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg";

    // useEffect(() => {
    //     setImages(ride.Images)
    // }, [ride]);

    const handleDelete = () => {
        ride.Images.forEach(async (image) => {
            return await dispatch(deleteImage(image.id));
        });
        dispatch(deleteRide(rideId));
        redirect();
    }

    const editRideClick = () => {
        setShowEdit((prevState) => !prevState);
        setShowAddImg(false);
    }

    const addImgClick = () => {
        setShowEdit(false);
        setShowAddImg((prevState) => !prevState);
    }
    if (!sessionUser) {
        return (
            <Redirect to="/login" />
        )
    }

    return (
        <div className="ride-page-container">
            <div className="img-scroller snaps-inline">
                {ride.Images && ride.Images[0] ?
                    (ride?.Images.map((image) => (
                        <div key={`${image.id}${imgKey}`} className="img-element">
                            <img alt={ride?.name} src={image.url} />
                        </div>
                    ))) :
                    (<div className="img-element">
                        <img alt={ride?.name} src={noImage} />
                    </div>)
                }
            </div>
            <div className="ride-details-container">
                <h2 className="ride-title ride-dtl">
                    {ride?.name}
                </h2>
                <div className="ride-location ride-dtl">
                    Location: {ride?.location}
                </div>
                <div className="ride-price ride-dtl">
                    Price: {`$${ride?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / day`}
                </div>
                <div className="ride-type ride-dtl">
                    Ride Type: {ride?.travelType}
                </div>
                <div className="ride-speed ride-dtl">
                    Speed: {ride?.speed} mph
                </div>
                <p className="ride-description ride-dtl">
                    {ride?.description}
                </p>
            </div>
            <div className="ride-btn-container">
                <div className="edit-add-container">
                    <button
                        className="edit-ride-btn ride-btn"
                        hidden={userId !== ride?.userId}
                        onClick={editRideClick}>
                        Edit Ride
                    </button>
                    <button
                        className="add-pic-btn ride-btn"
                        hidden={userId !== ride?.userId}
                        onClick={addImgClick}>
                        Add a Pic
                    </button>
                    <div hidden={!showEdit}>
                        <EditRideForm ride={ride} hideForm={() => setShowEdit(false)} />
                    </div>
                    <div hidden={!showAddImg}>
                        <AddImgForm rideId={rideId} hideForm={() => setShowAddImg(false)} />
                    </div>
                </div>
                <button
                    className="delete-ride-btn ride-btn"
                    hidden={userId !== ride?.userId}
                    onClick={handleDelete}>
                    Delete Ride
                </button>
            </div>
        </ div>
    );
}

export default RidePage;
