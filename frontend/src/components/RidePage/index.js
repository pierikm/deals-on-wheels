import { useEffect, useState } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSingleRide, deleteRide } from '../../store/rides';
import { deleteImage } from "../../store/images";
import EditRideForm from '../EditRidePage';
import AddImgForm from "../AddImgForm";

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
        <>
            <div>
                <img alt={ride?.name} key={imgKey} src={ride.Images ? (ride.Images[0] ? ride.Images[0].url : noImage) : noImage} />
            </div>
            <h2>
                {ride?.name}
            </h2>
            <div>
                Location: {ride?.location}
            </div>
            <div>
                Price: {`$${ride?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / day`}
            </div>
            <div>
                Ride Type: {ride?.travelType}
            </div>
            <div>
                Speed: {ride?.speed} mph
            </div>
            <p>{ride?.description}</p>
            <button hidden={userId !== ride?.userId} onClick={editRideClick}>Edit Ride</button>
            <button hidden={userId !== ride?.userId} onClick={handleDelete}>Delete Ride</button>
            <div hidden={!showEdit}>
                <EditRideForm ride={ride} hideForm={() => setShowEdit(false)} />
            </div>
            <button hidden={userId !== ride?.userId} onClick={addImgClick}>Add a Pic</button>
            <div hidden={!showAddImg}>
                <AddImgForm rideId={rideId} hideForm={() => setShowAddImg(false)} />
            </div>
        </>
    );
}

export default RidePage;
