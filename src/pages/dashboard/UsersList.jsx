import React from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UsersList() {
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const { data } = await AxiosUserInstance.get("/users");
    return data.users;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });

  const handleEdit = (id) => {
    navigate(`/dashboard/users/${id}`);
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await AxiosUserInstance.delete(`/users/${id}`);
        refetch();
      } catch (error) {
        console.error(
          "Failed to delete user:",
          error.response?.data || error.message
        );
        alert(
          "Failed to delete user: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Users List
      </Typography>

      {isLoading && <CircularProgress />}
      {isError && <Typography color="error">Failed to load users</Typography>}

      {!isLoading && data && (
        <Card className="mt-4">
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>{user.address || "-"}</TableCell>
                    <TableCell>{user.gender || "-"}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(user._id)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRemove(user._id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/dashboard/users/create")}
        sx={{ mt: 2 }}
      >
        Create User
      </Button>
    </Box>
  );
}
