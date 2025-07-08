// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Box,
//   IconButton,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import CustomButton from "./CustomButton";

// function CustomDialog({
//   open,
//   onClose,
//   onConfirm,
//   title = "Are you sure?",
//   children,
//   confirmText = "Confirm",
//   cancelText = "Cancel",
//   showActions = true,
//   showCloseIcon = true,
//   maxWidth = "sm",
// }) {
//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
//       <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <Typography variant="h6" fontWeight="bold">{title}</Typography>
//         {showCloseIcon && (
//           <IconButton onClick={onClose} size="small">
//             <CloseIcon />
//           </IconButton>
//         )}
//       </DialogTitle>

//       <DialogContent dividers>
//         <Box>{children}</Box>
//       </DialogContent>

//       {showActions && (
//         <DialogActions>
//           <CustomButton onClick={onClose} color="#aaa" hoverColor="#888">
//             {cancelText}
//           </CustomButton>
//           <CustomButton onClick={onConfirm}>{confirmText}</CustomButton>
//         </DialogActions>
//       )}
//     </Dialog>
//   );
// }

// export default CustomDialog;
