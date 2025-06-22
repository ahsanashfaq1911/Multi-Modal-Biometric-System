import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function CustomGoBack({ size = "medium", label = "Go Back", sx = {} }) {
  const navigate = useNavigate();

  return (
    <Button
      variant="text"
      startIcon={<ArrowBackIcon />}
      size={size}
      sx={{
        color: "black",
        textTransform: "none",
        fontWeight: "bold",
        fontSize: "1rem",
        "&:hover": {
          backgroundColor: "transparent",
          textDecoration: "underline",
        },
        ...sx,
      }}
      onClick={() => navigate(-1)}
    >
      {label}
    </Button>
  );
}

export default CustomGoBack;
