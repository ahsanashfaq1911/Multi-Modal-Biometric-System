import React, { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "../../../layout/AppLayout";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
} from "@mui/material";

function ViewAllSupervisors() {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/supervisors")
      .then((response) => {
        setSupervisors(response.data.supervisors || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching supervisors:", error);
        setLoading(false);
      });
  }, []);

  return (
    <AppLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          All Supervisors
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : supervisors.length === 0 ? (
          <Typography>No supervisors found.</Typography>
        ) : (
          supervisors.map((sup, index) => (
            <Card
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 2, p: 2 }}
            >
              <Avatar
                src={sup.profile_img}
                alt={sup.name}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <CardContent>
                <Typography variant="h6">{sup.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Department: {sup.department_name}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </AppLayout>
  );
}

export default ViewAllSupervisors;
