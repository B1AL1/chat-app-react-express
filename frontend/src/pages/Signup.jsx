import React, { useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useSignupUserMutation } from "../services/appApi";
//import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [role, setRole] = useState("student");
  const [url, setUrl] = useState("");
  const [signupUser, { error }] = useSignupUserMutation();
  //const navigate = useNavigate();
  //image upload states
  const [image, setImage] = useState(null);
  const [upladingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 5_242_880) {
      return alert("Maksymalny rozmiar pliku to 5mb!");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function uploadImage(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("image", image);
    setUploadingImg(true);
    fetch("http://localhost:5000/image-upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        //console.log(data.response.message);
        setUploadingImg(false);

        const file = data.response.message;
        setUrl(`${process.env.PUBLIC_URL}/uploads/${file}`);
      })
      .catch((err) => {
        setUploadingImg(false);
        console.log(err);
      });
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!image) return alert("Dodaj zdjęcie profilowe!");
    signupUser({ name, secondName, email, password, picture: url, role }).then(
      ({ data }) => {
        if (data) {
          console.log(data);
          //navigate("/chat");
        }
      }
    );
  }

  return (
    <Container>
      <Row>
        <Col
          md={5}
          className="d-flex align-items-center justify-content-center"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
            <h1 className="text-center">Rejestracja</h1>
            {error && (
              <p className="alert alert-danger text-center">{error.data}</p>
            )}
            <div className="signup-profile-pic__container">
              <img
                src={
                  imagePreview || "//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                }
                alt="profile-img"
                className="signup-profile-pic"
              />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png, image/jpeg, image/jpg"
                onChange={validateImg}
              />
            </div>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Imię:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Imię"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <Form.Text className="text-muted">Przykład: Konrad</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicSecondName">
              <Form.Label>Nazwisko:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nazwisko"
                required
                onChange={(e) => setSecondName(e.target.value)}
                value={secondName}
              />
              <Form.Text className="text-muted">Przykład: Kalman</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Adres email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Adres email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Form.Text className="text-muted">
                Przykład: test@example.com
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicRole">
              <Form.Label>Rola:</Form.Label>
              <Form.Control
                as="select"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label="Default select example"
              >
                <option value="student">Uczeń</option>
                <option value="teacher">Nauczyciel</option>
                <option value="parent">Rodzic</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Hasło</Form.Label>
              <Form.Control
                type="password"
                placeholder="Hasło"
                required
                title="Hasło musi zawierać przynajmniej jedną liczbę, jedną dużą literę i przynajmniej jedną małą literę i mieć minimum 8 znaków"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                minlength="8"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Form.Group>
            <div className="d-flex align-items-center justify-content-center">
              <Button className="m-2" variant="primary" onClick={uploadImage}>
                {upladingImg ? "Przesyłanie..." : "Prześlij zdjęcie"}
              </Button>
              <Button variant="primary" type="submit">
                {upladingImg ? "Rejestrowanie..." : "Zarejestruj"}
              </Button>
            </div>
          </Form>
        </Col>
        <Col md={7} className="signup__bg"></Col>
      </Row>
    </Container>
  );
}

export default Signup;
