import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ReservationsManagment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to pending reservations by default
    navigate("/restaurant/reservations/pending", { replace: true });
  }, [navigate]);

  return null;
};

export default ReservationsManagment;
