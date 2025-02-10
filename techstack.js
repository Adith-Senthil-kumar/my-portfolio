import React from "react";
import { Col, Row } from "react-bootstrap";
import { DiPython, DiGit, DiJava, DiMysql } from "react-icons/di";
import { SiFirebase, SiC } from "react-icons/si";
import { FaFlutter } from "react-icons/fa";
import { SiDart } from "react-icons/si";
import { SiVisualstudiocode, SiAndroidstudio, SiFigma } from "react-icons/si";

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <SiC />
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px" }}>C</p>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiDart />
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px" }}>Dart</p>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiPython />
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px" }}>Python</p>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiMysql />
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px" }}>MySQL</p>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiJava />
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px" }}>Java</p>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <FaFlutter />
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px" }}>Flutter</p>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiGit />
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px" }}>Git</p>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiFirebase />
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px" }}>Firebase</p>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiVisualstudiocode />
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px" }}>VS Code</p>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiAndroidstudio />
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px" }}>Android Studio</p>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiFigma />
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px" }}>Figma</p>
      </Col>
    </Row>
  );
}

export default Techstack;
