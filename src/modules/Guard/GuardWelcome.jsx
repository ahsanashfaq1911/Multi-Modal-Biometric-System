import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import AppLayout from "../../layout/AppLayout";
import CustomTextField from "../../components/CustomTextField";
import bifuse from "../../assets/Images/title.PNG";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function GuardWelcome() {
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const selected = Array.from(e.target.files);
    setImageFiles(selected);
    setImagePreview(
      <Typography>{selected.length} image(s) selected</Typography>
    );
  };

  const handleVideoUpload = (e) => {
    const selected = e.target.files[0];
    setVideoFile(selected);
    setVideoPreview(<Typography>{selected.name}</Typography>);
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setLoading(true); // start loading

    if (imageFiles.length < 6 && !videoFile) {
      setError("Upload at least 6 images or 1 gait video.");
      setLoading(false); // stop loading
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("cnic", cnic);
    formData.append("contact", phone);

    if (imageFiles.length >= 6) {
      imageFiles.forEach((img) => {
        formData.append("profile_img", img);
      });
    }

    if (videoFile) {
      formData.append("gait_video", videoFile);
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/add_visitor",
        formData
      );
      setSuccess(res.data.message || "Visitor registered successfully!");
      setImageFiles([]);
      setVideoFile(null);
      setImagePreview(null);
      setVideoPreview(null);
      setName("");
      setCnic("");
      setPhone("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false); // always stop loading
    }
  };

  return (
    <AppLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          gap: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Welcome
        </Typography>
        <Typography variant="subtitle1">Please register visitor</Typography>
        <img src={bifuse} alt="BiFuse" style={{ width: 150 }} />

        {/* Upload Previews */}
        <Box
          sx={{
            border: "2px dashed #aaa",
            borderRadius: 4,
            width: "100%",
            maxWidth: 400,
            height: 200,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            textAlign: "center",
            p: 2,
          }}
        >
          {imagePreview || videoPreview || (
            <Typography>No file selected</Typography>
          )}
        </Box>

        {/* Upload Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" component="label">
            Upload Images
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
          </Button>
          <Button variant="contained" component="label">
            Upload Video
            <input
              type="file"
              hidden
              accept="video/*"
              onChange={handleVideoUpload}
            />
          </Button>
        </Box>

        {/* Error/Success messages */}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {/* Input Fields */}
        <CustomTextField
          label="Visitor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <CustomTextField
          label="CNIC"
          value={cnic}
          onChange={(e) => setCnic(e.target.value)}
        />
        <CustomTextField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              "&:hover": { backgroundColor: "#367676" },
              minWidth: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={20}
                  sx={{ color: "#fff", marginRight: 1 }}
                />
                Registering...
              </>
            ) : (
              "Register Visitor"
            )}
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#469C9C",
              "&:hover": { backgroundColor: "#367676" },
              minWidth: 160,
            }}
            onClick={() => navigate("/route-selection")}
          >
            Route Selection
          </Button>
        </Box>
      </Box>
    </AppLayout>
  );
}

export default GuardWelcome;
