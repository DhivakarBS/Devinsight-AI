import { useState } from "react";
import api from "../api/api";

function Register() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
  try {
    const response = await api.post(
      "/api/auth/register",
      {
        username,
        email,
        password,
      }
    );

    console.log(response.data);

    alert("Registered Successfully ✅");

  } catch (error) {
    console.error(error);

    if (error.response) {
      alert(error.response.data.detail);
    } else {
      alert("Registration Failed ❌");
    }
  }
};
}

export default Register;