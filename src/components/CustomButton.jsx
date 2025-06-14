import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function customButton({ label, onClick, style }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "white",
        }}
      >
        <Button variant="outlined" startIcon={<DeleteIcon />}>
          Delete
        </Button>

        <Button variant="contained" color="success" endIcon={<SendIcon />}>
          Send
        </Button>

        <Button variant="contained" startIcon={<CloudUploadIcon/>} size="Large">Upload</Button>
        
        <Button variant="contained" startIcon={<CloudUploadIcon/>} size="Medium">Upload</Button>
        
        <Button variant="contained" endIcon={<CloudUploadIcon/>} size="small">Upload</Button>
      </Box>
    </>
  );
}

export default customButton;
