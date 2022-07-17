import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDeleteUserByIdMutation } from "../services/appApi";
import { Row, Container, Table } from "react-bootstrap";
import { useEffect } from "react";

function Admin() {
  const [users, setUsers] = useState([{}]);
  const [deleteUser] = useDeleteUserByIdMutation();
  async function fetchData() {
    await fetch("http://localhost:5000/users/admin")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleDelete(user) {
    deleteUser(user._id);
    window.location.reload(false);
  }

  return (
    <Container>
      <div className="banner">
        <h4 className="banner__title">
          <center>Panel administratora</center>
        </h4>
      </div>
      <Row>
        <h5>Statystyki</h5>
        <p>Ilość użytkowników: {users.length}</p>
        <h5>
          <center>Lista użytkowników</center>
        </h5>
        <Table responsive className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                <td key={user._id}>{user._id}</td>
                <td key={user.email}>{user.email}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDelete(user)}
                  >
                    Usuń
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}

export default Admin;
