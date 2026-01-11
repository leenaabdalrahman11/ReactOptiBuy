import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  CircularProgress,
  Tooltip,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

export default function ProductReviewsList({ productId }) {
  const queryClient = useQueryClient();

  const fetchProductReviews = async () => {
    const { data } = await AxiosUserInstance.get(
      `/products/${productId}/reviews`
    );
    return data.reviews || data;
  };

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["productReviews", productId],
    queryFn: fetchProductReviews,
    enabled: !!productId,
    refetchOnWindowFocus: false,
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await AxiosUserInstance.delete(`/reviews/${id}`);
      queryClient.invalidateQueries({
        queryKey: ["productReviews", productId],
      });
      queryClient.invalidateQueries({ queryKey: ["latestReviews"] });
    } catch (err) {
      console.error("Delete review error:", err?.response?.data ?? err.message);
      alert("Failed to delete review");
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{color:"white"}}>
      <Typography variant="h6" gutterBottom>
        Reviews ({reviews.length})
      </Typography>

      {reviews.length === 0 ? (
        <Typography sx={{color:"white"}} variant="body2">No reviews for this product.</Typography>
      ) : (
        <List sx={{color:"white"}}>
          {reviews.map((r) => (
            <React.Fragment key={r._id}>
              <ListItem
              sx={{color:"white"}}
                alignItems="flex-start"
                secondaryAction={
                  <Tooltip title="Delete review">
                    <IconButton edge="end" onClick={() => handleDelete(r._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemAvatar>
                  <Avatar>{r.createdBy?.userName?.[0] ?? "U"}</Avatar>
                </ListItemAvatar>
                <ListItemText
                
                sx={{color:"white"}}
                  primary={
                    <>
                      <strong>
                        {r.createdBy?.userName ?? r.createdBy?.name ?? "User"}
                      </strong>{" "}
                      <Typography
                        component="span"
                        variant="caption"
                      sx={{color:"white"}}

                      >
                        {r.createdBy?.email ? ` — ${r.createdBy.email}` : ""}
                      </Typography>
                    </>
                  }
                  
                  secondary={
                    <>
                    <Box sx={{color:"white"}}>
                      <Typography
                        component="span"
                        variant="body2"
                      sx={{color:"white"}}

                      >
                        {`Rating: ${r.rating ?? "-"}`}
                      </Typography>
                      <br />
                      <span >{r.comment}</span>
                      <br />
                      <Typography variant="caption" color="">
                        {r.createdAt
                          ? format(new Date(r.createdAt), "PPpp")
                          : ""}
                      </Typography>
                    </Box>

                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}
