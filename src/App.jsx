import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setBody("");
    setOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setBody(post.body);
    setOpen(true);
  };

  const handleSave = () => {
    const postData = {
      title,
      body,
      userId: 1,
    };

    if (editingId === null) {
      // POST
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((data) => {
          setPosts([{ ...data }, ...posts]);
          setOpen(false);
          setTitle("");
          setBody("");
        });
    } else {
      // PUT
      fetch(`https://jsonplaceholder.typicode.com/posts/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          ...postData,
        }),
      })
        .then((response) => response.json())
        .then((updatedPost) => {
          setPosts(
            posts.map((post) =>
              post.id === editingId ? updatedPost : post
            )
          );

          setOpen(false);
          setEditingId(null);
          setTitle("");
          setBody("");
        });
    }
  };

  const handleDelete = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    }).then(() => {
      setPosts(posts.filter((post) => post.id !== id));
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" align="center" sx={{ my: 3 }}>
        Post Management
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={handleOpenAdd}
      >
        Add Post
      </Button>

      {posts.map((post) => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{post.title}</Typography>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {post.body}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => handleOpenEdit(post)}
              >
                Edit
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editingId === null ? "Add Post" : "Edit Post"}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Body"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSave}>
            {editingId === null ? "Save" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;