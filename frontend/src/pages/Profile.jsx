import React, { useState } from "react";
import { Button, Container, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useUpdateUserEmailMutation } from "../services/appApi";

function Profile() {
  const [email, setEmail] = useState("");
  const [updateUser, { error }] = useUpdateUserEmailMutation();
  const user = useSelector((state) => state.user);

  async function handleUpdate(e) {
    e.preventDefault();
    updateUser({ user, email });
  }

  return (
    <Container>
      <div className="banner mb-5">
        <h1 className="banner__title text-center">Profil</h1>
        {error && (
          <p className="alert alert-danger text-center">{error.data}</p>
        )}
      </div>
      <Col className="d-flex align-items-center justify-content-center">
        <Form onSubmit={handleUpdate}>
          <Row className="mb-3">
            <h4 className="text-center">Aktualizowanie maila:</h4>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Adres email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                Przykład: test@example.com
              </Form.Text>
            </Form.Group>
          </Row>
          <Row className="d-flex align-items-center justify-content-center">
            <Button variant="primary" type="submit" style={{ width: "60%" }}>
              Zaktualizuj maila
            </Button>
          </Row>
        </Form>
      </Col>
    </Container>
  );
}

export default Profile;
