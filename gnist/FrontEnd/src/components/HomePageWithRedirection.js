import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import HomePage from "./HomePage";
import Loading from "./Loading";

function HomePageWithRedirection() {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // check that user is authenticated
      if (!isLoading && isAuthenticated && user) {
        try {
          // check if role is employee
          const roles = user["https://digitalmedlemsordning/roles"];
          const isEmployee = roles.includes("employee");

          if (isEmployee) {
            // send employee to employee dashboard
            navigate("/employee-dashboard");
          } else {
            // For non-employees, check registration status
            const sub = user.sub; // Get the sub from auth0
            const response = await fetch(
              `http://127.0.0.1:8000/digital_medlemsordning/check_user_registration_status/?sub=${sub}`
            );
            const data = await response.json();

            if (data.registered) {
              // if fully registered
              navigate("/user-dashboard");
            } else {
              // if not fully registered
              navigate("/user-info");
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [isAuthenticated, isLoading, user, navigate]);

  return isLoading ? <Loading /> : <HomePage />;
}

export default HomePageWithRedirection;